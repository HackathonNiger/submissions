import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:just_audio/just_audio.dart';

class TTSScreen extends StatefulWidget {
  const TTSScreen({super.key});

  @override
  State<TTSScreen> createState() => _TTSScreenState();
}

class _TTSScreenState extends State<TTSScreen> {
  final TextEditingController _textController = TextEditingController();
  final AudioPlayer _audioPlayer = AudioPlayer();
  String? _selectedVoice = 'Fritz-PlayAI';
  bool _isLoading = false;
  String _statusMessage = '';

  // List of available English voices for playai-tts
  final List<String> _voices = [
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

  // Replace with your Groq API key or use dotenv
  final String _apiKey = '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';

  Future<void> _generateSpeech() async {
    setState(() {
      _isLoading = true;
      _statusMessage = 'Generating audio...';
    });

    // Stop and reset the audio player to ensure it can play new audio
    await _audioPlayer.stop();
    await _audioPlayer.seek(Duration.zero);
    // await _audioPlayer.setAudioSource(EmptyAudioSource()); // Clear previous source

    final url = Uri.parse('https://api.groq.com/openai/v1/audio/speech');
    final headers = {
      'Authorization': 'Bearer $_apiKey',
      'Content-Type': 'application/json',
    };
    final body = {
      'model': 'playai-tts',
      'voice': _selectedVoice,
      'input': _textController.text,
      'response_format': 'wav',
    };

    try {
      final response = await http.post(
        url,
        headers: headers,
        body: jsonEncode(body),
      );

      if (response.statusCode == 200 && response.headers['content-type']?.contains('audio/wav') == true) {
        // Play audio directly from bytes
        final audioSource = AudioSource.uri(
          Uri.dataFromBytes(response.bodyBytes, mimeType: 'audio/wav'),
        );
        await _audioPlayer.setAudioSource(audioSource);
        await _audioPlayer.play();
        setState(() {
          _statusMessage = 'Audio played successfully!';
        });
      } else {
        setState(() {
          _statusMessage = 'Error: ${response.statusCode} - ${response.reasonPhrase}';
        });
      }
    } catch (e) {
      setState(() {
        _statusMessage = 'Error generating audio: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _textController.dispose();
    _audioPlayer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Groq Text-to-Speech'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _textController,
              decoration: const InputDecoration(
                labelText: 'Enter text to convert to speech',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedVoice,
              decoration: const InputDecoration(
                labelText: 'Select Voice',
                border: OutlineInputBorder(),
              ),
              items: _voices.map((voice) {
                return DropdownMenuItem(
                  value: voice,
                  child: Text(voice),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedVoice = value;
                });
              },
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _textController.text.isEmpty || _isLoading
                  ? null
                  : _generateSpeech,
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : const Text('Generate and Play Speech'),
            ),
            const SizedBox(height: 16),
            Text(
              _statusMessage,
              style: TextStyle(
                color: _statusMessage.contains('Error') ? Colors.red : Colors.green,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Define an empty audio source to clear the player
// class EmptyAudioSource extends StreamAudioSource {
//   @override
//   Future<StreamAudioResponse> request([int? start, int? end]) async {
//     return StreamAudioResponse(
//       sourceLength: 0,
//       contentType: 'audio/wav',
//       stream: Stream.value(Uint8List(0)),
//       offset: start ?? 0, contentLength: null,
//     );
//   }
// }