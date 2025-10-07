import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:iconly/iconly.dart';
import 'package:just_audio/just_audio.dart';
import 'package:provider/provider.dart';

import '../../provider/tts_provider.dart';
import '../../services/aidora_services.dart';
import '../../services/audio_player_service.dart';
import '../aidora_reply_indicator.dart';


class ReceiverChatBubble extends StatefulWidget {
  final String text;
  final bool isStreaming;

  const ReceiverChatBubble({
    super.key,
    required this.text,
    this.isStreaming = false,
  });

  @override
  State<ReceiverChatBubble> createState() => _ReceiverChatBubbleState();
}

class _ReceiverChatBubbleState extends State<ReceiverChatBubble> {
  bool isTapped = false;
  bool isSpeaking = false;
  final AidoraServices _ttsService = AidoraServices();
  final AudioPlayerService _audioPlayerService = AudioPlayerService();
  late final FlutterTts _tts;

  @override
  void initState() {
    super.initState();
    _tts = FlutterTts();
    _initializeTts();
    _audioPlayerService.playerStateStream.listen((playerState) {
      if (playerState.processingState == ProcessingState.completed) {
        if (mounted) {
          setState(() => isSpeaking = false);
        }
      }
    });
  }

  Future<void> _initializeTts() async {
    await _tts.awaitSpeakCompletion(true);
    _tts.setCompletionHandler(() {
      if (mounted) {
        setState(() => isSpeaking = false);
      }
    });
    _tts.setErrorHandler((msg) {
      if (mounted) {
        setState(() => isSpeaking = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('TTS error: $msg')),
        );
      }
    });
  }

  @override
  void dispose() {
    _audioPlayerService.dispose();
    _tts.stop();
    super.dispose();
  }

  Future<bool> _tryTextToSpeech(
      String text,
      String voice, {
        int retries = 3,
        int delaySeconds = 2,
      }) async {
    for (int attempt = 1; attempt <= retries; attempt++) {
      try {
        final response = await _ttsService.triggerTextToSpeech(
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
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Too many requests, please try again later.'),
            ),
          );
          return false;
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Error generating audio: ${response.statusCode} - ${response.reasonPhrase}',
              ),
            ),
          );
          return false;
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error generating audio: $e')),
        );
        return false;
      }
    }
    return false;
  }

  Future<void> _speak(String text) async {
    if (isSpeaking) {
      await _audioPlayerService.stopAudio();
      await _tts.stop();
      setState(() => isSpeaking = false);
      return;
    }

    try {
      setState(() => isSpeaking = true);
      final ttsProvider = Provider.of<TTSProvider>(context, listen: false);
      final selectedVoice = ttsProvider.selectedVoice ?? 'Arista-PlayAI';
      final cleanText = text.replaceAll(RegExp(r'\*\*'), '');

      bool success = await _tryTextToSpeech(cleanText, selectedVoice);

      if (!success) {
        print('Falling back to FlutterTts');
        await _tts.setLanguage('en-US');
        await _tts.setPitch(1.0);
        await _tts.setSpeechRate(0.5);
        await _tts.speak(cleanText);
      }
    } catch (e) {
      setState(() => isSpeaking = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error playing audio: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return widget.isStreaming || widget.text.isEmpty
        ? const Padding(
      padding: EdgeInsets.only(top: 4),
      child: SizedBox(child: AidoraReplyIndicator(amplitude: 3.0)),
    )
        : GestureDetector(
      onTap: () => setState(() => isTapped = !isTapped),
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.only(left: 12.0, right: 48.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(15),
                  topRight: Radius.circular(15),
                  bottomLeft: Radius.zero,
                  bottomRight: Radius.circular(15),
                ),
              ),
              child: MarkdownBody(
                key: ValueKey(widget.text),
                data: widget.text,
                styleSheet: MarkdownStyleSheet(
                  p: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w400,
                  ),
                  strong: const TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                  code: TextStyle(
                    backgroundColor: Colors.grey[200],
                  ),
                  listBullet: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 5),
            if (!widget.isStreaming && isTapped)
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  GestureDetector(
                    onTap: () async {
                      await Clipboard.setData(
                        ClipboardData(text: widget.text),
                      );
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          backgroundColor: Colors.transparent,
                          elevation: 0,
                          content: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(5),
                              gradient: const LinearGradient(
                                colors: [Colors.blue, Colors.purple],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                            ),
                            padding: const EdgeInsets.all(8),
                            child: const Center(
                              child: Text(
                                'message copied',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                    child: const Icon(
                      Icons.copy_rounded,
                      size: 18,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(width: 10),
                  GestureDetector(
                    onTap: () => _speak(widget.text),
                    child: Icon(
                      isSpeaking ? Icons.volume_up : IconlyLight.voice,
                      size: 18,
                      color: isSpeaking ? Colors.blue : Colors.grey,
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}