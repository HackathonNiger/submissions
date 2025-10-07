import 'package:aidora/utilities/constants/app_strings.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';
import 'package:just_audio/just_audio.dart';
import 'package:provider/provider.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import '../../../utilities/constants/app_icons.dart';
import '../components/chat_bubbles/chat_bubble.dart';
import '../model/aidora_chat_model.dart';
import '../provider/aidora_chat_provider.dart';
import '../provider/aidora_seek_settings_provider.dart';
import '../services/aidora_services.dart';
import '../services/audio_player_service.dart';
import '../provider/tts_provider.dart';

class AidoraVoiceChatScreen extends StatefulWidget {
  const AidoraVoiceChatScreen({super.key});

  @override
  State<AidoraVoiceChatScreen> createState() => _AidoraVoiceChatScreenState();
}

class _AidoraVoiceChatScreenState extends State<AidoraVoiceChatScreen> {
  final stt.SpeechToText _speech = stt.SpeechToText();
  final FlutterTts _flutterTts = FlutterTts();
  final AidoraServices _aidoraServices = AidoraServices();
  final AudioPlayerService _audioPlayerService = AudioPlayerService();
  bool _isListening = false;
  bool _isSpeaking = false;
  bool _isProcessing = false;
  bool _isInitialized = false;
  String _text = 'Tap the button to start listening';

  @override
  void initState() {
    super.initState();
    _initSpeech();
    _initTts();
    _initializeConversation();
    _audioPlayerService.playerStateStream.listen(
      (playerState) {
        if (playerState.processingState == ProcessingState.completed) {
          _resetState();
        }
      },
      onError: (e) {
        _handleError('Audio playback error: $e');
      },
    );
  }

  void _initializeConversation() {
    final provider = Provider.of<AidoraChatProvider>(context, listen: false);
    if (provider.conversationId == null) {
      provider.setConversationId(
        null,
      ); // Generate new conversation ID if none exists
    }
  }

  void _initSpeech() async {
    bool available = await _speech.initialize(
      onStatus: (status) {
        print('Speech status: $status');
        if (status == 'done' && _isListening && mounted) {
          _stopListening();
        }
      },
      onError: (error) {
        print('Speech error: $error');
        _handleError('Speech recognition error: $error');
      },
    );
    if (mounted) {
      setState(() {
        _isInitialized = available;
        if (!available) {
          _text = 'Speech recognition not available';
        }
      });
    }
  }

  void _initTts() async {
    await _flutterTts.setLanguage('en-US');
    await _flutterTts.setSpeechRate(0.5);
    await _flutterTts.setVolume(1.0);
    await _flutterTts.setPitch(1.0);
    await _flutterTts.setSilence(0);
    _flutterTts.setCompletionHandler(_resetState);
    _flutterTts.setErrorHandler((msg) {
      _handleError('TTS error: $msg');
    });
  }

  void _resetState() {
    if (mounted) {
      setState(() {
        _isSpeaking = false;
        _isProcessing = false;
        _isListening = false;
        _text = 'Tap the button to start listening';
      });
    }
  }

  void _handleError(String message) {
    if (mounted) {
      setState(() {
        _isSpeaking = false;
        _isProcessing = false;
        _isListening = false;
        _text = message;
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(message)));
    }
  }

  Future<bool> _tryTextToSpeech(
    String text,
    String voice, {
    int retries = 3,
    int delaySeconds = 2,
  }) async {
    for (int attempt = 1; attempt <= retries; attempt++) {
      try {
        final response = await _aidoraServices.triggerTextToSpeech(
          text: text,
          voice: voice,
        );
        if (response.statusCode == 200) {
          await _audioPlayerService.playAudioFromResponse(response);
          return true;
        } else if (response.statusCode == 429) {
          if (attempt < retries) {
            print(
              'Rate limit hit, retrying in $delaySeconds seconds... (Attempt $attempt/$retries)',
            );
            await Future.delayed(Duration(seconds: delaySeconds));
            continue;
          }
          _handleError('Too many requests, please try again later.');
          return false;
        } else {
          _handleError(
            'Error generating audio: ${response.statusCode} - ${response.reasonPhrase}',
          );
          return false;
        }
      } catch (e) {
        _handleError('Error generating audio: $e');
        return false;
      }
    }
    return false;
  }

  void _toggleListening() {
    if (_isListening) {
      _stopListening();
    } else if (!_isSpeaking && !_isProcessing) {
      _startListening();
    } else if (_isSpeaking) {
      _stopSpeaking();
    }
  }

  void _startListening() async {
    if (!_isInitialized) {
      setState(() {
        _text = 'Speech recognition not available';
      });
      return;
    }
    setState(() {
      _isListening = true;
      _isSpeaking = false;
      _isProcessing = false;
      _text = 'Listening...';
    });
    await _flutterTts.stop();
    await _audioPlayerService.stopAudio();
    _speech.listen(
      listenFor: const Duration(seconds: 30),
      onResult: (result) {
        if (mounted) {
          setState(() {
            _text = result.recognizedWords;
          });
        }
      },
    );
  }

  void _stopSpeaking() async {
    await _flutterTts.stop();
    await _audioPlayerService.stopAudio();
    _resetState();
  }

  void _stopListening() async {
    final provider = Provider.of<AidoraChatProvider>(context, listen: false);
    final ttsProvider = Provider.of<TTSProvider>(context, listen: false);
    final text = _text.trim();
    await _speech.stop();
    if (!mounted) return;

    setState(() {
      _isListening = false;
      if (text.isEmpty) {
        _isProcessing = false;
        _text = 'No input detected. Tap to try again.';
        return;
      }
      _isProcessing = true;
      _text = 'Processing your request...';
    });

    if (text.isEmpty) return;

    try {
      // Send the recognized text to the AI without clearing previous messages
      await provider.sendMessage(text);

      // Get the latest AI response
      final aiResponse =
          provider.messages.isNotEmpty
              ? provider.messages
                  .lastWhere((msg) => msg.sender != Sender.user)
                  .text
              : 'No response received.';

      if (mounted) {
        setState(() {
          _isSpeaking = true;
          _isProcessing = false;
          _text = aiResponse;
        });
      }

      // Get selected voice from TTSProvider
      final selectedVoice = ttsProvider.selectedVoice ?? 'Arista-PlayAI';
      final cleanText = aiResponse.replaceAll(RegExp(r'\*\*'), '');

      // Try API-based TTS first
      bool success = await _tryTextToSpeech(cleanText, selectedVoice);

      // Fallback to FlutterTts if API fails
      if (!success) {
        print('Falling back to FlutterTts');
        await _flutterTts.setLanguage('en-US');
        await _flutterTts.setPitch(1.0);
        await _flutterTts.setSpeechRate(0.5);
        await _flutterTts.speak(cleanText);
      }

      // Generate conversation title if this is the first message
      if (provider.messages.length == 2) {
        // First user message + AI response
        String conversationTitle = await _aidoraServices
            .generateConversationTitle(
              text: text,
              imageFile: null,
              base64Image: null,
            );
      }
    } catch (e) {
      _handleError('Error: $e');
    }
  }

  @override
  void dispose() {
    _speech.stop();
    _flutterTts.stop();
    _audioPlayerService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AidoraChatProvider>(context);
    final seekSettingsProvider = Provider.of<AidoraSeekSettingsProvider>(
      context,
    );
    return Stack(
      children: [
        // MovingCirclesScreen(),
        Container(
          height: MediaQuery.of(context).size.height,
          width: MediaQuery.of(context).size.width,
          decoration: BoxDecoration(color: Colors.white.withOpacity(0.9)),
        ),
        Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(
            backgroundColor: Colors.white,
            surfaceTintColor: Colors.transparent,
            leadingWidth: 90,
            title: Row(
              children: [
                Text(
                  AppStrings.appName,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const Text(
                  ' Voice Chat',
                  style: TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
                ),
              ],
            ),
            centerTitle: true,
            actions: [
              IconButton(
                onPressed: () {
                  provider.clearConversation();
                  setState(() {
                    _text = 'Tap the button to start listening';
                  });
                },
                icon: const Icon(IconlyLight.edit_square, color: Colors.grey),
              ),
            ],
          ),
          body:
              provider.messages.isNotEmpty
                  ? Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Expanded(
                        child: Consumer<AidoraChatProvider>(
                          builder: (context, provider, child) {
                            return SingleChildScrollView(
                              reverse: false,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  for (var msg in provider.messages.reversed)
                                    Align(
                                      alignment:
                                          msg.sender == Sender.user
                                              ? Alignment.centerRight
                                              : Alignment.centerLeft,
                                      child: ChatBubble(
                                        text: msg.text,
                                        isUser: msg.sender == Sender.user,
                                        isStreaming: msg.isStreaming,
                                      ),
                                    ),
                                  const SizedBox(height: 150),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  )
                  : Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                          height: 50,
                          width: 50,
                          child: Transform.scale(
                            scale: 2.3,
                            child: Image.asset(AppIcons.aidoraBot),
                          ),
                        ),
                        const SizedBox(height: 30),
                        Text(
                          "Hi, i'm ${AppStrings.appName}",
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const Text(
                          "How can i help you today?",
                          style: TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
          floatingActionButtonLocation:
              FloatingActionButtonLocation.centerFloat,
          floatingActionButton: GestureDetector(
            onTap: _toggleListening,
            child: Container(
              height: 50,
              width: 50,
              decoration: BoxDecoration(
                color:
                    _isListening
                        ? Colors.red
                        : _isSpeaking
                        ? Colors.orange
                        : Colors.blue,
                shape: BoxShape.circle,
              ),
              child: Icon(
                _isListening ? Icons.stop : IconlyLight.voice,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
