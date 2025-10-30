import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';

class ConnectivityService extends ChangeNotifier {
  bool _isOnline = false;
  bool get isOnline => _isOnline;

  ConnectivityService() {
    _initConnectivity();

    // FIX 1: onConnectivityChanged.listen now expects a single ConnectivityResult,
    // which matches the signature of _updateConnectionStatus below.
    Connectivity().onConnectivityChanged.listen(_updateConnectionStatus);
  }

  // 1. Initial Check
  void _initConnectivity() async {
    // FIX 2: checkConnectivity() now returns a single ConnectivityResult,
    // resolving the "can't be assigned to a variable of type 'List<ConnectivityResult>'" error.
    final ConnectivityResult connectivityResult = await Connectivity().checkConnectivity();
    _updateConnectionStatus(connectivityResult);
  }

  // 2. Listener Update
  // FIX 3: Accept a single ConnectivityResult as the parameter.
  void _updateConnectionStatus(ConnectivityResult result) {
    final wasOnline = _isOnline;

    // Logic adapted for a single result:
    // The device is online if the result is anything but 'none'.
    _isOnline = result != ConnectivityResult.none;

    // Only notify listeners if the status has actually changed
    if (wasOnline != _isOnline) {
      if (kDebugMode) {
        print('Connectivity changed. Is Online: $_isOnline');
      }
      notifyListeners();
    }
  }
}