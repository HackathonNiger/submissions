import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TTSProvider with ChangeNotifier {
  String? _selectedVoice;
  static const String _voiceKey = 'selected_voice';

  String? get selectedVoice => _selectedVoice;

  TTSProvider() {
    _loadVoice();
  }
  Future<void> _loadVoice() async {
    final prefs = await SharedPreferences.getInstance();
    _selectedVoice = prefs.getString(_voiceKey);
    notifyListeners();
  }

  // Set and save the selected voice to SharedPreferences
  Future<void> setSelectedVoice(String voice) async {
    _selectedVoice = voice;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_voiceKey, voice);
    notifyListeners();
  }
}