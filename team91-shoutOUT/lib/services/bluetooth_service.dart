// services/bluetooth_service.dart
import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
// We import the package's BluetoothService and related types with a prefix
// to avoid conflicts, just in case.
import 'package:flutter_blue_plus/flutter_blue_plus.dart' as fbp;
import 'package:http/http.dart' as http;

// Define unique BLE Service and Characteristic UUIDs
const String _serviceUuid = "44444444-0000-0000-0000-000000000000";
const String _characteristicUuid = "55555555-0000-0000-0000-000000000000";

// Renamed class to BleService to avoid conflict with the package's BluetoothService
class BleService extends ChangeNotifier {

  bool _isInternetConnected = true; // Placeholder for real connectivity check

  final List<String> _offlineReportQueue = [];

  StreamSubscription<fbp.BluetoothAdapterState>? _stateSubscription;
  StreamSubscription<List<fbp.ScanResult>>? _scanSubscription;

  BleService() {
    _startBluetoothMonitor();
  }

  // --- Monitoring and Setup ---

  Future<void> _startBluetoothMonitor() async {
    // 1. Monitor Bluetooth state (isOn, isOff, etc.)
    _stateSubscription = fbp.FlutterBluePlus.adapterState.listen((state) {
      if (state == fbp.BluetoothAdapterState.on) {
        _startBleRelay();
      } else {
        print("Bluetooth is currently: $state. Cannot start relay.");
      }
    });

    // 2. Initial check for immediate relay start
    if (await fbp.FlutterBluePlus.isSupported) {
      if (await fbp.FlutterBluePlus.adapterState.first == fbp.BluetoothAdapterState.on) {
        _startBleRelay();
      }
    }
  }

  Future<void> _startBleRelay() async {
    await fbp.FlutterBluePlus.stopScan();
    print("BLE Relay Started: Scanning for other ShoutOUT! nodes.");
    _startScanning();
  }

  // --- Scanning and Message Handling ---

  void _startScanning() {
    _scanSubscription?.cancel();

    _scanSubscription = fbp.FlutterBluePlus.scanResults.listen((results) {
      for (fbp.ScanResult r in results) {
        if (r.advertisementData.serviceUuids.any(
                (guid) => guid.str.toLowerCase().startsWith(_serviceUuid.substring(0, 8)))
        ) {
          _connectAndRelay(r.device);
        }
      }
    });

    fbp.FlutterBluePlus.startScan(timeout: const Duration(seconds: 4));
  }

  void _connectAndRelay(fbp.BluetoothDevice device) async {
    // FIX: Await the current connection state from the stream's first value
    fbp.BluetoothConnectionState connectionState = await device.connectionState.first;

    if (connectionState == fbp.BluetoothConnectionState.connected ||
        connectionState == fbp.BluetoothConnectionState.connecting) {
      return;
    }

    print("Attempting to connect to ${device.platformName}");
    try {
      await device.connect();
      print("Connected to ${device.platformName}");

      // 2. Discover services and find the characteristic
      // The return type is fbp.BluetoothService, which is why we used the prefix fbp.
      List<fbp.BluetoothService> services = await device.discoverServices();

      for (var service in services) {
        // FIX: uuid is accessed via .uuid.str
        if (service.uuid.str.toLowerCase().startsWith(_serviceUuid.substring(0, 8))) {

          for (var characteristic in service.characteristics) {
            // FIX: uuid is accessed via .uuid.str
            if (characteristic.uuid.str.toLowerCase().startsWith(_characteristicUuid.substring(0, 8))) {

              if (_offlineReportQueue.isNotEmpty) {
                String reportJson = _offlineReportQueue.removeAt(0);

                await characteristic.write(utf8.encode(reportJson), allowLongWrite: false);
                print("Relayed 1 message to ${device.platformName}");
              }
            }
          }
        }
      }
    } catch (e) {
      print("Connection or relay failed: $e");
    } finally {
      await device.disconnect();
      print("Disconnected from ${device.platformName}");
    }
  }

  // --- Public Interface and Internet Upload ---

  Future<void> sendOfflineReport(Map<String, String> reportData) async {
    final encryptedReport = jsonEncode(reportData);
    _offlineReportQueue.add(encryptedReport);

    if (_isInternetConnected) {
      _processQueueAndStopBle();
    } else {
      await _startBleRelay();
    }
  }

  void _processQueueAndStopBle() {
    fbp.FlutterBluePlus.stopScan();

    while (_offlineReportQueue.isNotEmpty) {
      String encryptedReport = _offlineReportQueue.removeAt(0);
      _sendReportToInternet(encryptedReport);
    }
  }

  Future<void> _sendReportToInternet(String encryptedReport) async {
    // Placeholder for internet API call
    try {
      await http.post(
        Uri.parse('YOUR_REPORT_API_ENDPOINT'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: encryptedReport,
      );
      print("Report successfully sent to server.");
    } catch (e) {
      print("Internet send failed. Re-queueing report: $e");
      _offlineReportQueue.add(encryptedReport);
    }
  }

  @override
  void dispose() {
    _stateSubscription?.cancel();
    _scanSubscription?.cancel();
    fbp.FlutterBluePlus.stopScan();
    super.dispose();
  }
}