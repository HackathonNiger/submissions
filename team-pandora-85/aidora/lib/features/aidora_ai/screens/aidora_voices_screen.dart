import 'package:aidora/utilities/constants/app_strings.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../components/aidora_voice_option_card.dart';
import '../provider/tts_provider.dart';
import '../services/audio_player_service.dart';
import '../services/aidora_services.dart';

class AidoraVoicesScreen extends StatefulWidget {
  const AidoraVoicesScreen({super.key});

  @override
  State<AidoraVoicesScreen> createState() => _AidoraVoicesScreenState();
}

class _AidoraVoicesScreenState extends State<AidoraVoicesScreen> {
  final AidoraServices _ttsService = AidoraServices();
  final AudioPlayerService _audioPlayerService = AudioPlayerService();
  bool _isLoading = false;
  String _statusMessage = '';
  String? _currentlyPlayingVoice;

  static const List<String> _voices = [
    'Arista-PlayAI',
    'Atlas-PlayAI',
    'Basil-PlayAI',
    'Briggs-PlayAI',
    'Calum-PlayAI',
    'Celeste-PlayAI',
    'Cheyenne-PlayAI',
    'Chip-PlayAI',
    'Cillian-PlayAI',
    'Deedee-PlayAI',
    'Fritz-PlayAI',
    'Gail-PlayAI',
    'Indigo-PlayAI',
    'Mamaw-PlayAI',
    'Mason-PlayAI',
    'Mikail-PlayAI',
    'Mitch-PlayAI',
    'Quinn-PlayAI',
    'Thunder-PlayAI',
  ];

  Future<void> _playHelloWorld(String voice, TTSProvider ttsProvider) async {
    setState(() {
      _isLoading = true;
      _currentlyPlayingVoice = voice;
      _statusMessage = 'Generating audio for $voice...';
    });

    try {
      final response = await _ttsService.triggerTextToSpeech(
        text: 'Hello, I am ${AppStrings.appName}',
        voice: voice,
      );

      if (response.statusCode == 200) {
        await _audioPlayerService.playAudioFromResponse(response);
        setState(() {
          _statusMessage = 'Playing $voice';
        });
        print(_statusMessage = 'Playing $voice');
      } else {
        setState(() {
          _statusMessage = 'Error with $voice: ${response.statusCode}';
        });
        print('Error with $voice: ${response.statusCode}');
      }
    } catch (e) {
      setState(() {
        _statusMessage = 'Error with $voice: ${e.toString()}';
      });
      print('Error with $voice: ${e.toString()}');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _currentlyPlayingVoice = null;
        });
      }
    }
  }

  @override
  void dispose() {
    _audioPlayerService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ttsProvider = Provider.of<TTSProvider>(context);
    // Find the index of the selected voice from TTSProvider
    final currentIndex = _voices.indexOf(ttsProvider.selectedVoice ?? _voices[0]);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        centerTitle: true,
        title: const Text(
          "Voice Samples",
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 0.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "Available ",
                  style: TextStyle(
                      fontSize: 25,
                      fontWeight: FontWeight.w400
                  ),
                ),
                Text(
                  AppStrings.appName,
                  style: const TextStyle(fontSize: 25, fontWeight: FontWeight.w400),
                ),
                Text(
                  " Voices",
                  style: TextStyle(
                      fontSize: 25,
                      fontWeight: FontWeight.w400
                  ),
                ),
              ],
            ),
            Text(
              'Choose from the available AI voices to customize your experience.',
              style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10,),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    for (int index = 0; index < _voices.length; index++)
                      AidoraVoiceOptionCard(
                        title: _voices[index],
                        onClick: () {
                          // Set the selected voice immediately
                          ttsProvider.setSelectedVoice(_voices[index]);
                          _playHelloWorld(_voices[index], ttsProvider);
                        },
                        currentIndex: currentIndex,
                        index: index,
                        isPlaying: _voices[index] == _currentlyPlayingVoice,
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}