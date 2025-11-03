import 'package:http/http.dart' as http;
import 'package:just_audio/just_audio.dart';

class AudioPlayerService {
  final AudioPlayer _audioPlayer = AudioPlayer();

  Future<void> playAudioFromResponse(http.Response response) async {
    print(response.body);
    if (response.statusCode == 200 &&
        response.headers['content-type']?.contains('audio/wav') == true) {
      await _audioPlayer.stop();
      final audioSource = AudioSource.uri(
        Uri.dataFromBytes(response.bodyBytes, mimeType: 'audio/wav'),
      );
      await _audioPlayer.setAudioSource(audioSource);
      await _audioPlayer.play();
    } else {
      throw Exception('Invalid audio response');
    }
  }

  // Add a stream to listen for playback completion
  Stream<PlayerState> get playerStateStream => _audioPlayer.playerStateStream;

  Future<void> stopAudio() async {
    await _audioPlayer.stop();
    await _audioPlayer.seek(Duration.zero);
  }

  void dispose() {
    _audioPlayer.dispose();
  }
}