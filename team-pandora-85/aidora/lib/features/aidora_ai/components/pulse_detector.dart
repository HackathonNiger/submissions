import 'package:flutter/services.dart';

class PulseDetector {
  static const platform = MethodChannel('com.example.pulse_detector/pulse');

  Future<int?> getPulseRate() async {
    try {
      final int? pulseRate = await platform.invokeMethod('getPulseRate');
      return pulseRate;
    } on PlatformException catch (e) {
      print("Failed to get pulse rate: '${e.message}'.");
      return null;
    }
  }
}