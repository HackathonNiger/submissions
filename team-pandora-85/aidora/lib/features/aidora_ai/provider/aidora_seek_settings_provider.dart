import 'package:flutter/foundation.dart';

class AidoraSeekSettingsProvider with ChangeNotifier {
  String _selectedModel = 'deepseek-r1-distill-llama-70b';
  String _selectedReasoningFormat = 'raw';
  bool _useTools = false;
  bool _streamResponse = false;
  double _temperature = 0.6;
  int _maxTokens = 1024;
  double _topP = 0.95;

  // Getters
  String get selectedModel => _selectedModel;
  String get selectedReasoningFormat => _selectedReasoningFormat;
  bool get useTools => _useTools;
  bool get streamResponse => _streamResponse;
  double get temperature => _temperature;
  int get maxTokens => _maxTokens;
  double get topP => _topP;

  // Setters
  void setSelectedModel(String value) {
    _selectedModel = value;
    notifyListeners();
  }

  void setSelectedReasoningFormat(String value) {
    _selectedReasoningFormat = value;
    notifyListeners();
  }

  void setUseTools(bool value) {
    _useTools = value;
    if (value) {
      _selectedReasoningFormat = 'hidden';
    }
    notifyListeners();
  }

  void setStreamResponse(bool value) {
    _streamResponse = value;
    notifyListeners();
  }

  void setTemperature(double value) {
    _temperature = value;
    notifyListeners();
  }

  void setMaxTokens(int value) {
    _maxTokens = value;
    notifyListeners();
  }

  void setTopP(double value) {
    _topP = value;
    notifyListeners();
  }

  // Update all settings at once
  void updateAllSettings({
    required String model,
    required String reasoningFormat,
    required bool useTools,
    required bool streamResponse,
    required double temperature,
    required int maxTokens,
    required double topP,
  }) {
    _selectedModel = model;
    _selectedReasoningFormat = reasoningFormat;
    _useTools = useTools;
    _streamResponse = streamResponse;
    _temperature = temperature;
    _maxTokens = maxTokens;
    _topP = topP;
    notifyListeners();
  }

  // Reset to default settings
  void resetToDefaults() {
    _selectedModel = 'deepseek-r1-distill-llama-70b';
    _selectedReasoningFormat = 'raw';
    _useTools = false;
    _streamResponse = false;
    _temperature = 0.6;
    _maxTokens = 1024;
    _topP = 0.95;
    notifyListeners();
  }
}