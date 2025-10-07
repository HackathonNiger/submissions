import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:path_provider/path_provider.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:uuid/uuid.dart';
import '../model/aidora_chat_model.dart';
import '../services/aidora_services.dart';

class AidoraChatProvider with ChangeNotifier {
  List<Message> _messages = [];
  bool _isListening = false;
  bool _useFlutterSound = true;
  final FlutterSoundRecorder _recorder = FlutterSoundRecorder();
  final stt.SpeechToText _speechToText = stt.SpeechToText();
  final AidoraServices _aidoraServices = AidoraServices();
  File? _audioFile;
  String? _conversationId; // Track conversation ID
  static const int _maxMessages = 100;

  List<Message> get messages => _messages;
  bool get isListening => _isListening;

  String? get conversationId => _conversationId;

  // Initialize or set conversation ID
  void setConversationId(String? id) {
    _conversationId = id ?? const Uuid().v4();
    notifyListeners();
  }


  // Build conversation history for prompt
  String _buildConversationHistory() {
    if (_messages.isEmpty) {
      return 'This is a new conversation.';
    }
    return _messages.reversed
        .map((msg) =>
    "${msg.sender == Sender.user ? 'User' : 'Assistant'}: ${msg.text}")
        .join('\n');
  }

  Future<void> initRecorder() async {
    try {
      debugPrint('Initializing FlutterSoundRecorder...');
      await _recorder.openRecorder();
      _recorder.setSubscriptionDuration(const Duration(milliseconds: 100));
      debugPrint('FlutterSoundRecorder initialized successfully');
    } catch (e) {
      debugPrint('FlutterSoundRecorder initialization failed: $e');
      _useFlutterSound = false;
      addMessage(Message(
        id: const Uuid().v4(),
        text: 'Falling back to speech_to_text due to recorder error: $e',
        sender: Sender.ai,
        timestamp: DateTime.now(),
        imageMessageData: {},
      ));

      try {
        bool available = await _speechToText.initialize(
          onError: (error) => debugPrint('SpeechToText error: $error'),
          onStatus: (status) => debugPrint('SpeechToText status: $status'),
        );
        if (!available) {
          addMessage(Message(
            id: const Uuid().v4(),
            text: 'Speech recognition not available',
            sender: Sender.ai,
            timestamp: DateTime.now(),
            imageMessageData: {},
          ));
        }
      } catch (e) {
        addMessage(Message(
          id: const Uuid().v4(),
          text: 'Error initializing speech recognition: $e',
          sender: Sender.ai,
          timestamp: DateTime.now(),
          imageMessageData: {},
        ));
      }
    }
    notifyListeners();
  }

  Future<void> _cleanupAudioFiles() async {
    try {
      if (_audioFile != null && await _audioFile!.exists()) {
        await _audioFile!.delete();
        _audioFile = null;
      }
    } catch (e) {
      debugPrint('Error cleaning up audio files: $e');
    }
  }

  Future<void> toggleListening() async {
    await _cleanupAudioFiles();

    if (_isListening) {
      if (_useFlutterSound) {
        try {
          debugPrint('Stopping FlutterSoundRecorder...');
          await _recorder.stopRecorder();
          debugPrint('Recorder stopped');
          if (_audioFile != null && await _audioFile!.exists()) {
            try {
              debugPrint('Transcribing audio with Groq API...');
              final transcribedText = await _aidoraServices.transcribeAudio(_audioFile!);
              if (transcribedText.trim().isNotEmpty) {
                await sendMessage(transcribedText);
              } else {
                addMessage(Message(
                  id: const Uuid().v4(),
                  text: 'No speech detected',
                  sender: Sender.ai,
                  timestamp: DateTime.now(),
                  imageMessageData: {},
                ));
              }
            } catch (e) {
              addMessage(Message(
                id: const Uuid().v4(),
                text: 'Error transcribing audio: $e',
                sender: Sender.ai,
                timestamp: DateTime.now(),
                imageMessageData: {},
              ));
            }
          }
        } catch (e) {
          addMessage(Message(
            id: const Uuid().v4(),
            text: 'Error stopping recorder: $e',
            sender: Sender.ai,
            timestamp: DateTime.now(),
            imageMessageData: {},
          ));
        }
      } else {
        try {
          debugPrint('Stopping SpeechToText...');
          await _speechToText.stop();
          debugPrint('SpeechToText stopped');
        } catch (e) {
          addMessage(Message(
            id: const Uuid().v4(),
            text: 'Error stopping speech recognition: $e',
            sender: Sender.ai,
            timestamp: DateTime.now(),
            imageMessageData: {},
          ));
        }
      }
    } else {
      if (_useFlutterSound) {
        try {
          debugPrint('Starting FlutterSoundRecorder...');
          final directory = await getTemporaryDirectory();
          _audioFile = File('${directory.path}/recording_${DateTime.now().millisecondsSinceEpoch}.wav');
          await _recorder.startRecorder(
            toFile: _audioFile!.path,
            codec: Codec.pcm16WAV,
            sampleRate: 16000,
            numChannels: 1,
          );
          debugPrint('Recording started');
        } catch (e) {
          debugPrint('Error starting recorder: $e');
          addMessage(Message(
            id: const Uuid().v4(),
            text: 'Error starting recorder: $e',
            sender: Sender.ai,
            timestamp: DateTime.now(),
            imageMessageData: {},
          ));
          _useFlutterSound = false;
          await _startSpeechToText();
        }
      } else {
        await _startSpeechToText();
      }
    }
    _isListening = !_isListening;
    notifyListeners();
  }

  Future<void> _startSpeechToText() async {
    try {
      debugPrint('Starting SpeechToText...');
      await _speechToText.listen(
        onResult: (result) {
          if (result.finalResult) {
            if (result.recognizedWords.trim().isNotEmpty) {
              sendMessage(result.recognizedWords);
            } else {
              addMessage(Message(
                id: const Uuid().v4(),
                text: 'No speech detected',
                sender: Sender.ai,
                timestamp: DateTime.now(),
                imageMessageData: {},
              ));
            }
          }
        },
        listenFor: const Duration(seconds: 30),
        pauseFor: const Duration(seconds: 5),
      );
      debugPrint('SpeechToText listening');
    } catch (e) {
      addMessage(Message(
        id: const Uuid().v4(),
        text: 'Error starting speech recognition: $e',
        sender: Sender.ai,
        timestamp: DateTime.now(),
        imageMessageData: {},
      ));
    }
  }

  Future<void> sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    final userMsg = Message(
      id: const Uuid().v4(),
      text: text,
      sender: Sender.user,
      timestamp: DateTime.now(),
      imageMessageData: {},
    );
    addMessage(userMsg);

    final responseMsg = Message(
      id: const Uuid().v4(),
      text: '',
      sender: Sender.ai,
      timestamp: DateTime.now(),
      isStreaming: true,
      imageMessageData: {},
    );
    addMessage(responseMsg);

    try {
      // Construct prompt with conversation context
      final prompt = '''
You are Grok, an AI assistant created by xAI. You are continuing an ongoing conversation with the user (Conversation ID: $_conversationId). Below is the conversation history to provide context. Treat the user's new message as part of this conversation unless explicitly instructed to start a new one.

**Conversation History**:
${_buildConversationHistory()}

**User's New Message**:
$text

**Instructions**:
- Respond based on the conversation history and the new message.
- Maintain continuity in tone, context, and any referenced details.
- If the conversation history is empty or the user indicates a new conversation, treat this as a fresh interaction.
- Provide a concise and relevant response.

**Response**:
''';

      final stream = queryLlamaStream(prompt);
      await for (final chunk in stream) {
        final index = _messages.indexWhere((m) => m.id == responseMsg.id);
        if (index != -1) {
          _messages[index] = _messages[index].copyWith(
            text: _messages[index].text + chunk,
            isStreaming: false,
          );
          notifyListeners();
        }
      }
    } catch (e) {
      final index = _messages.indexWhere((m) => m.id == responseMsg.id);
      if (index != -1) {
        _messages[index] = _messages[index].copyWith(
          text: 'Error: ${e.toString()}',
          isStreaming: false,
        );
        notifyListeners();
      }
    }
  }

  void addMessage(Message msg) {
    _messages.insert(0, msg);
    // Limit the number of messages to prevent memory issues
    if (_messages.length > _maxMessages) {
      _messages = _messages.sublist(0, _maxMessages);
    }
    notifyListeners();
  }

  String? encodeImage(File imageFile) {
    try {
      final bytes = imageFile.readAsBytesSync();
      return 'data:image/jpeg;base64,${base64Encode(bytes)}';
    } catch (e) {
      return null;
    }
  }
























  // Modified sendImageMessage to include conversation context
  Future<void> sendImageMessage({
    String? text,
    String? imageUrl,
    File? imageFile,
    String? base64Image,
  }) async {
    if ((text?.trim().isEmpty ?? true) &&
        imageUrl == null &&
        imageFile == null &&
        base64Image == null) {
      throw ArgumentError('Either text or an image (URL, file, or base64) must be provided');
    }

    final userMsg = Message(
      id: const Uuid().v4(),
      text: text ?? '',
      sender: Sender.user,
      timestamp: DateTime.now(),
      imageMessageData: {
        if (imageUrl != null) 'url': imageUrl,
        if (imageFile != null) 'file': imageFile,
        if (base64Image != null) 'url': 'data:image/jpeg;base64,$base64Image',
      },
    );
    addMessage(userMsg);

    final responseMsg = Message(
      id: const Uuid().v4(),
      text: '',
      sender: Sender.ai,
      timestamp: DateTime.now(),
      isStreaming: true,
      imageMessageData: {},
    );
    addMessage(responseMsg);

    try {
      final previousMessages = _messages
          .where((m) => m.sender == Sender.user || m.sender == Sender.ai)
          .map((message) {
        if (message.sender == Sender.ai) {
          return {
            'role': 'assistant',
            'content': message.text.isNotEmpty ? message.text : ' '
          };
        } else {
          final content = <Map<String, dynamic>>[];
          if (message.text.isNotEmpty) {
            content.add({'type': 'text', 'text': message.text});
          }
          if (message.imageMessageData.containsKey('url')) {
            content.add({
              'type': 'image_url',
              'image_url': {'url': message.imageMessageData['url']},
            });
          }
          if (message.imageMessageData.containsKey('file')) {
            final base64ImageData = encodeImage(message.imageMessageData['file']);
            if (base64ImageData != null) {
              content.add({
                'type': 'image_url',
                'image_url': {'url': base64ImageData},
              });
            }
          }
          return {
            'role': 'user',
            'content': content.isNotEmpty
                ? content
                : [
              {'type': 'text', 'text': message.text}
            ],
          };
        }
      }).toList();

      // Construct prompt with conversation context
      final promptText = text ?? 'Describe this image';
      final prompt = '''
You are Grok, an AI assistant created by xAI. You are continuing an ongoing conversation with the user (Conversation ID: $_conversationId). Below is the conversation history to provide context. Treat the user's new message as part of this conversation unless explicitly instructed to start a new one.

**Conversation History**:
${_buildConversationHistory()}

**User's New Message**:
$promptText

**Instructions**:
- Respond based on the conversation history and the new message.
- If an image is provided, analyze it in the context of the conversation and the user's message.
- Maintain continuity in tone, context, and any referenced details.
- Provide a concise and relevant response.

**Response**:
''';

      final stream = queryLlamaImageStream(
        question: prompt,
        imageUrl: imageUrl ?? (base64Image != null ? 'data:image/jpeg;base64,$base64Image' : null),
        imageFile: imageFile,
        messages: previousMessages,
      );

      String fullResponse = '';
      await for (final chunk in stream) {
        final index = _messages.indexWhere((m) => m.id == responseMsg.id);
        if (index != -1) {
          fullResponse += chunk;
          _messages[index] = _messages[index].copyWith(
            text: fullResponse,
            isStreaming: true,
          );
          notifyListeners();
        }
      }

      final completeIndex = _messages.indexWhere((m) => m.id == responseMsg.id);
      if (completeIndex != -1) {
        _messages[completeIndex] = _messages[completeIndex].copyWith(
          isStreaming: false,
        );
        notifyListeners();
      }
    } catch (e) {
      final errorIndex = _messages.indexWhere((m) => m.id == responseMsg.id);
      if (errorIndex != -1) {
        _messages[errorIndex] = _messages[errorIndex].copyWith(
          text: 'Error: ${e.toString()}',
          isStreaming: false,
        );
        notifyListeners();
      }
      rethrow;
    }
  }


  Future<void> sendSeekMessage({
    required String? text,
    required String model,
    required double temperature,
    required int maxTokens,
    required double topP,
    required String reasoningFormat,
    required bool useTools,
    required bool stream,
  }) async {
    if ((text?.trim().isEmpty ?? true)) {
      throw ArgumentError('Text must be provided for seek message');
    }

    final userMsg = Message(
      id: const Uuid().v4(),
      text: text!,
      sender: Sender.user,
      timestamp: DateTime.now(),
      imageMessageData: {},
    );
    addMessage(userMsg);

    final responseMsg = Message(
      id: const Uuid().v4(),
      text: '',
      sender: Sender.ai,
      timestamp: DateTime.now(),
      isStreaming: stream,
      imageMessageData: {},
    );
    addMessage(responseMsg);

    try {
      final prompt = '''
You are Grok, an AI assistant created by xAI. You are continuing an ongoing conversation with the user (Conversation ID: $_conversationId). Below is the conversation history to provide context. Treat the user's new message as part of this conversation unless explicitly instructed to start a new one.

**Conversation History**:
${_buildConversationHistory()}

**User's New Message**:
$text

**Instructions**:
- Respond based on the conversation history and the new message.
- Use the following settings: model=$model, temperature=$temperature, maxTokens=$maxTokens, topP=$topP, reasoningFormat=$reasoningFormat, useTools=$useTools.
- Maintain continuity in tone, context, and any referenced details.
- Provide a concise and relevant response.

**Response**:
''';

      Stream<String> streamResponse;
      if (useTools) {
        streamResponse = queryLlamaToolUseStream(
          prompt: prompt,
          model: model,
          temperature: temperature,
          maxTokens: maxTokens,
          topP: topP,
          reasoningFormat: reasoningFormat,
        );
      } else {
        streamResponse = queryLlamaReasoningStream(
          prompt: prompt,
          model: model,
          temperature: temperature,
          maxTokens: maxTokens,
          topP: topP,
          reasoningFormat: reasoningFormat,
          stream: stream,
        );
      }

      String fullResponse = '';
      await for (final chunk in streamResponse) {
        final index = _messages.indexWhere((m) => m.id == responseMsg.id);
        if (index != -1) {
          fullResponse += chunk;
          _messages[index] = _messages[index].copyWith(
            text: fullResponse,
            isStreaming: stream,
          );
          notifyListeners();
        }
      }

      final completeIndex = _messages.indexWhere((m) => m.id == responseMsg.id);
      if (completeIndex != -1) {
        _messages[completeIndex] = _messages[completeIndex].copyWith(
          isStreaming: false,
        );
        notifyListeners();
      }
    } catch (e) {
      final errorIndex = _messages.indexWhere((m) => m.id == responseMsg.id);
      if (errorIndex != -1) {
        _messages[errorIndex] = _messages[errorIndex].copyWith(
          text: 'Error: ${e.toString()}',
          isStreaming: false,
        );
        notifyListeners();
      }
      rethrow;
    }
  }

  Stream<String> queryLlamaImageStream({
    String? question,
    String? imageUrl,
    File? imageFile,
    required List<Map<String, dynamic>> messages,
  }) async* {
    try {
      final response = await _aidoraServices.sendRequest(
        question: question,
        imageUrl: imageUrl,
        imageFile: imageFile,
        messages: messages,
      );

      final responseContent = response['response'];
      if (responseContent is String) {
        try {
          final jsonResponse = jsonDecode(responseContent);
          yield jsonResponse.toString();
        } catch (e) {
          yield responseContent;
        }
      } else {
        yield responseContent.toString();
      }
    } catch (e) {
      yield 'Error: $e';
    }
  }

  Stream<String> queryLlamaStream(String prompt) async* {
    try {
      final response = await _aidoraServices.callLlamaApi(prompt);
      final lines = response.body.split('\n');
      for (final line in lines) {
        if (line.startsWith('data:') && !line.contains('[DONE]')) {
          final data = jsonDecode(line.substring(5));
          yield data['choices'][0]['delta']['content'] ?? '';
        }
      }
    } catch (e) {
      yield 'Error: $e';
    }
  }

  Stream<String> queryLlamaReasoningStream({
    required String prompt,
    required String model,
    required double temperature,
    required int maxTokens,
    required double topP,
    required String reasoningFormat,
    required bool stream,
  }) async* {
    try {
      final response = await _aidoraServices.sendReasoningRequest(
        model: model,
        prompt: prompt,
        temperature: temperature,
        maxCompletionTokens: maxTokens,
        topP: topP,
        stream: stream,
        reasoningFormat: reasoningFormat,
      );

      if (stream) {
        final lines = response['choices'][0]['message']['content'].split('\n');
        for (final line in lines) {
          if (line.isNotEmpty) {
            yield line;
          }
        }
      } else {
        final content = response['choices'][0]['message']['content'];
        yield content;
      }
    } catch (e) {
      yield 'Error: $e';
    }
  }








  Stream<String> queryLlamaToolUseStream({
    required String prompt,
    required String model,
    required double temperature,
    required int maxTokens,
    required double topP,
    required String reasoningFormat,
  }) async* {
    try {
      final response = await _aidoraServices.sendToolUseRequest(
        model: model,
        prompt: prompt,
        temperature: temperature,
        maxCompletionTokens: maxTokens,
        topP: topP,
        reasoningFormat: reasoningFormat,
        tools: [
          {
            'type': 'function',
            'function': {
              'name': 'get_weather',
              'description': 'Get current temperature for a given location.',
              'parameters': {
                'type': 'object',
                'properties': {
                  'location': {
                    'type': 'string',
                    'description': 'City and country e.g. Bogotá, Colombia',
                  },
                },
                'required': ['location'],
                'additionalProperties': false,
              },
              'strict': true,
            },
          }
        ],
      );

      final content = response['choices'][0]['message']['content'];
      yield content;
    } catch (e) {
      yield 'Error: $e';
    }
  }

  @override
  void dispose() {
    if (_useFlutterSound) {
      _recorder.closeRecorder();
    }
    _speechToText.cancel();
    _cleanupAudioFiles();
    super.dispose();
  }


  // Clear conversation and reset ID
  void clearConversation() {
    _messages.clear();
    _conversationId = const Uuid().v4();
    notifyListeners();
  }
}