import 'dart:io';
import 'dart:ui';
import 'package:aidora/features/aidora_ai/components/sender_image_message_bubble.dart';
import 'package:aidora/utilities/constants/app_strings.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:iconly/iconly.dart';
import 'package:image_picker/image_picker.dart';
import 'package:just_audio/just_audio.dart';
import 'package:provider/provider.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

import '../../../utilities/constants/app_colors.dart';
import '../model/aidora_chat_model.dart';
import '../provider/aidora_chat_provider.dart';
import '../provider/aidora_seek_settings_provider.dart';
import '../provider/tts_provider.dart';
import '../screens/aidora_voices_screen.dart';
import '../services/audio_player_service.dart';
import '../services/aidora_services.dart';
import 'aidora_info_dialog.dart';
import 'chat_bubbles/chat_bubble.dart';

class AidoraVoiceChatBottomSheet extends StatefulWidget {
  const AidoraVoiceChatBottomSheet({super.key});

  @override
  State<AidoraVoiceChatBottomSheet> createState() =>
      _AidoraVoiceChatBottomSheetState();
}

class _AidoraVoiceChatBottomSheetState
    extends State<AidoraVoiceChatBottomSheet> {
  final stt.SpeechToText _speech = stt.SpeechToText();
  final _messageController = TextEditingController();
  final FlutterTts _flutterTts = FlutterTts();
  final AidoraServices _aidoraServices = AidoraServices();
  final AudioPlayerService _audioPlayerService = AudioPlayerService();
  bool _isListening = false;
  bool _isSpeaking = false;
  bool _isProcessing = false;
  bool _isInitialized = false;
  String _text = 'Tap the button to start listening';
  File? _imageFile;

  final ScrollController _scrollController = ScrollController();

  Future<void> _showAidoraBottomSheet(BuildContext context) async {
    showCupertinoModalPopup(
      context: context,
      builder: (context) => const AidoraInfoDialog(),
    );
  }

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

    // Add this to listen for message changes
    final provider = Provider.of<AidoraChatProvider>(context, listen: false);
    provider.addListener(_scrollToBottom);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToBottom();
    });
  }

  // Add this method to scroll to bottom
  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _initializeConversation() {
    final provider = Provider.of<AidoraChatProvider>(context, listen: false);
    if (provider.conversationId == null) {
      provider.setConversationId(null); // Generate new conversation ID if none exists
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
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message)),
      );
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
      final aiResponse = provider.messages.isNotEmpty
          ? provider.messages.lastWhere((msg) => msg.sender != Sender.user).text
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
      if (provider.messages.length == 2) { // First user message + AI response
        String conversationTitle = await _aidoraServices.generateConversationTitle(
          text: text,
          imageFile: null,
          base64Image: null,
        );
      }
    } catch (e) {
      _handleError('Error: $e');
    }
  }

  String options = "";

  @override
  void dispose() {
    _speech.stop();
    _flutterTts.stop();
    _audioPlayerService.dispose();
    _messageController.dispose();
    // Remove the listener when disposing
    final provider = Provider.of<AidoraChatProvider>(context, listen: false);
    provider.removeListener(_scrollToBottom);
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _sendMessage() async {
    final provider = Provider.of<AidoraChatProvider>(context, listen: false);
    final text = _messageController.text.trim();

    // Don't send if both image and text are empty
    if (text.isEmpty && _imageFile == null) return;

    try {
      if (_imageFile != null) {
        // Store image file temporarily to send it
        final tempImageFile = _imageFile;
        // Clear inputs and image from UI immediately
        setState(() {
          _messageController.clear();
          _imageFile = null;
          options = "";
        });
        // Send image with optional text question
        await provider.sendImageMessage(
          text: text.isNotEmpty ? text : null,
          imageFile: tempImageFile,
        );
        // Generate conversation title for image message
        String conversationTitle = await _aidoraServices.generateConversationTitle(
          text: text.isNotEmpty ? text : null,
          imageFile: tempImageFile,
          base64Image: null,
        );
        print("Conversation title: $conversationTitle");
      } else {
        // Clear inputs immediately
        setState(() {
          _messageController.clear();
          _imageFile = null;
          options = "";
        });
        // Send text only
        await provider.sendMessage(text);
        // Generate conversation title if this is the first message
        if (provider.messages.length == 2) { // First user message + AI response
          String conversationTitle = await _aidoraServices.generateConversationTitle(
            text: text,
            imageFile: null,
            base64Image: null,
          );
        }
      }
      // Scroll to bottom after sending
      _scrollToBottom();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error sending message: $e')),
      );
    }
  }

  Future<void> _createNewConversation(BuildContext context, String title) async {
    try {
    } catch (e) {
      print(e);
    }
  }

  final ImagePicker _imagePicker = ImagePicker();

  Future<void> _pickImage(ImageSource source) async {
    try {
      final pickedFile = await _imagePicker.pickImage(source: source);
      if (pickedFile != null) {
        setState(() {
          _imageFile = File(pickedFile.path);
          options = "Image";
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking image: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 30),
          child: Container(
            height: MediaQuery.of(context).size.height,
            width: MediaQuery.of(context).size.width,
            decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.0),
            ),
          ),
        ),
        Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            automaticallyImplyLeading: false,
            centerTitle: true,
            surfaceTintColor: Colors.transparent,
            title: GestureDetector(
              onTap: () => _showAidoraBottomSheet(context),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    "Chat ",
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.black,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    AppStrings.appName,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              Padding(
                padding: const EdgeInsets.only(right: 10.0),
                child: Container(
                  height: 40,
                  width: 40,
                  clipBehavior: Clip.antiAlias,
                  decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle
                  ),
                  child: MaterialButton(
                    padding: EdgeInsets.zero,
                    onPressed: () {
                      Provider.of<AidoraChatProvider>(context, listen: false).clearConversation();
                      setState(() {
                        _messageController.clear();
                        _imageFile = null;
                        _text = 'Tap the button to start listening';
                        options = "";
                      });
                      _createNewConversation(context, "New Voice Chat");
                    },
                    child: const Icon(IconlyLight.edit_square, color: Colors.grey, size: 20,),
                  ),
                ),
              ),
            ],
            leading: Padding(
              padding: const EdgeInsets.only(left: 10.0, top: 10, bottom: 5),
              child: Container(
                height: 30,
                width: 30,
                clipBehavior: Clip.antiAlias,
                decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle
                ),
                child: MaterialButton(
                  padding: EdgeInsets.zero,
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Icon(Icons.arrow_downward_rounded, color: Colors.grey, size: 20,),
                ),
              ),
            ),
          ),
          body: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(
                child: Consumer<AidoraChatProvider>(
                  builder: (context, provider, child) {
                    return SingleChildScrollView(
                      reverse: false,
                      controller: _scrollController,
                      physics: const AlwaysScrollableScrollPhysics(),  // Ensure it's always scrollable
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          for (var msg in provider.messages.reversed)
                            if (msg.sender == Sender.user &&
                                (msg.imageMessageData.containsKey('file') ||
                                    msg.imageMessageData.containsKey('url')))
                              Align(
                                alignment: Alignment.centerRight,
                                child: SenderImageMessageBubble(
                                  imageFile: msg.imageMessageData['file'] as File?,
                                  imageUrl: msg.imageMessageData['url'] as String?,
                                  text: msg.text,
                                ),
                              )
                            else
                              Align(
                                alignment: msg.sender == Sender.user
                                    ? Alignment.centerRight
                                    : Alignment.centerLeft,
                                child: ChatBubble(
                                  text: msg.text,
                                  isUser: msg.sender == Sender.user,
                                  isStreaming: msg.isStreaming,
                                ),
                              ),
                          const SizedBox(height: 100),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
          floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
          floatingActionButton: Container(
            decoration: BoxDecoration(color: Colors.transparent),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 1),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 5),
                  Align(
                    alignment: Alignment.bottomRight,
                    child: _imageFile == null
                        ? null
                        : Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 10.0),
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                _imageFile = null;
                                options = "";
                              });
                            },
                            child: Container(
                              height: 30,
                              width: 30,
                              decoration: BoxDecoration(
                                color: Colors.grey.withOpacity(0.4),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.close,
                                color: Colors.white,
                                size: 15,
                              ),
                            ),
                          ),
                        ),
                        Container(
                          height: 200,
                          width: 150,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(23),
                              topRight: Radius.circular(23),
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.grey.withOpacity(0.1),
                                offset: Offset(0, -18),
                                blurRadius: 10,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(5.0),
                            child: Container(
                              height: 200,
                              width: 150,
                              clipBehavior: Clip.antiAlias,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(18),
                              ),
                              child: Image.file(_imageFile!, fit: BoxFit.cover),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    height: 60,
                    width: MediaQuery.of(context).size.width,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: _imageFile != null
                          ? BorderRadius.only(
                        topLeft: Radius.circular(25),
                        bottomLeft: Radius.circular(25),
                        bottomRight: Radius.circular(25),
                      )
                          : BorderRadius.circular(25),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10.0),
                      child: Row(
                        children: [
                          IconButton(
                            onPressed: () => _pickImage(ImageSource.gallery),
                            icon: Icon(IconlyLight.image, color: Colors.grey),
                          ),
                          Expanded(
                            child: SizedBox(
                              height: 35,
                              child: TextFormField(
                                controller: _messageController,
                                cursorHeight: 15,
                                onChanged: (value) {
                                  setState(() {});
                                },
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                                decoration: InputDecoration(
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(50),
                                    borderSide: const BorderSide(
                                      color: Colors.transparent,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(50),
                                    borderSide: BorderSide(
                                      color: Colors.grey.withOpacity(0.0),
                                    ),
                                  ),
                                  fillColor: Colors.grey.withOpacity(0.0),
                                  filled: false,
                                  hintText: _imageFile != null
                                      ? "Need info on the image?"
                                      : "Ask ${AppStrings.appName} any medical question...",
                                  hintStyle: const TextStyle(
                                    fontSize: 11,
                                    color: Colors.grey,
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Row(
                            children: [
                              GestureDetector(
                                onTap: _messageController.text.trim().isNotEmpty
                                    ? _sendMessage
                                    : _toggleListening,
                                child: Container(
                                  height: 40,
                                  width: 40,
                                  clipBehavior: Clip.antiAlias,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: LinearGradient(
                                      colors: [
                                        Color(AppColors.primaryColor),
                                        Colors.green,
                                      ],
                                    ),
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.all(3.0),
                                    child: Center(
                                      child: Container(
                                        height: 40,
                                        width: 40,
                                        clipBehavior: Clip.antiAlias,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: Colors.white,
                                        ),
                                        child: Center(
                                          child: _messageController.text.trim().isEmpty
                                              ? Icon(
                                            _isListening
                                                ? Icons.stop
                                                : IconlyLight.voice,
                                            color: Colors.black,
                                            size: 20,
                                          )
                                              : Icon(
                                            Icons.arrow_upward_rounded,
                                            color: Colors.black,
                                            size: 18,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 5),
                              IconButton(
                                onPressed: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (context) => AidoraVoicesScreen(),
                                    ),
                                  );
                                },
                                icon: Icon(Icons.multitrack_audio),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}