// services/notification_service.dart
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'dart:math';
import '../models/crime_report.dart';
import '../models/user.dart';

class NotificationItem {
  final String id;
  final String title;
  final String message;
  final DateTime timestamp;
  final CrimeReport? relatedReport;
  final bool isRead;

  NotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.timestamp,
    this.relatedReport,
    this.isRead = false,
  });

  NotificationItem copyWith({
    String? id,
    String? title,
    String? message,
    DateTime? timestamp,
    CrimeReport? relatedReport,
    bool? isRead,
  }) {
    return NotificationItem(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      timestamp: timestamp ?? this.timestamp,
      relatedReport: relatedReport ?? this.relatedReport,
      isRead: isRead ?? this.isRead,
    );
  }
}

class NotificationService with ChangeNotifier {
  List<NotificationItem> _notifications = [];
  double _currentUserLat = 9.0579; // Default to Abuja coordinates
  double _currentUserLng = 7.4951;
  double _notificationRadius = 2.0; // 2km radius for notifications

  List<NotificationItem> get notifications => _notifications;
  List<NotificationItem> get unreadNotifications =>
      _notifications.where((n) => !n.isRead).toList();

  int get unreadCount => unreadNotifications.length;

  void updateUserLocation(double lat, double lng) {
    _currentUserLat = lat;
    _currentUserLng = lng;
    notifyListeners();
  }

  void setNotificationRadius(double radiusKm) {
    _notificationRadius = radiusKm;
    notifyListeners();
  }

  /// Check if a report is within notification radius
  bool _isWithinRadius(CrimeReport report) {
    double distance = _calculateDistance(
      _currentUserLat,
      _currentUserLng,
      report.latitude,
      report.longitude,
    );
    return distance <= _notificationRadius;
  }

  /// Calculate distance between two points in kilometers
  double _calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    const double earthRadius = 6371; // Earth's radius in kilometers

    double dLat = _toRadians(lat2 - lat1);
    double dLon = _toRadians(lon2 - lon1);

    double a = sin(dLat / 2) * sin(dLat / 2) +
        cos(_toRadians(lat1)) * cos(_toRadians(lat2)) * sin(dLon / 2) * sin(dLon / 2);

    double c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return earthRadius * c;
  }

  double _toRadians(double degree) {
    return degree * (pi / 180);
  }

  /// Add notification for new crime report
  void checkNewReport(CrimeReport report) {
    if (_isWithinRadius(report)) {
      String title = _getSeverityTitle(report.aiSeverityScore);
      String crimeType = report.crimeType.toString().split('.').last.toUpperCase();

      double distance = _calculateDistance(
        _currentUserLat,
        _currentUserLng,
        report.latitude,
        report.longitude,
      );

      String message = '$crimeType reported ${distance.toStringAsFixed(1)}km away at ${report.address}';

      NotificationItem notification = NotificationItem(
        id: 'notif_${report.id}_${DateTime.now().millisecondsSinceEpoch}',
        title: title,
        message: message,
        timestamp: DateTime.now(),
        relatedReport: report,
      );

      _notifications.insert(0, notification);

      // Play beep based on severity
      _playBeep(report.aiSeverityScore);

      // Vibrate device
      _vibrate(report.aiSeverityScore);

      notifyListeners();
    }
  }

  /// Add notification for report status updates
  void reportStatusUpdated(CrimeReport report, String statusMessage) {
    if (_isWithinRadius(report)) {
      double distance = _calculateDistance(
        _currentUserLat,
        _currentUserLng,
        report.latitude,
        report.longitude,
      );

      NotificationItem notification = NotificationItem(
        id: 'status_${report.id}_${DateTime.now().millisecondsSinceEpoch}',
        title: 'Report Update',
        message: '$statusMessage (${distance.toStringAsFixed(1)}km away)',
        timestamp: DateTime.now(),
        relatedReport: report,
      );

      _notifications.insert(0, notification);
      notifyListeners();
    }
  }

  /// Add notification when a report gets amplified (many upvotes)
  void reportAmplified(CrimeReport report) {
    if (_isWithinRadius(report) && report.upvotes >= 5) {
      String crimeType = report.crimeType.toString().split('.').last.toUpperCase();
      double distance = _calculateDistance(
        _currentUserLat,
        _currentUserLng,
        report.latitude,
        report.longitude,
      );

      NotificationItem notification = NotificationItem(
        id: 'amplified_${report.id}_${DateTime.now().millisecondsSinceEpoch}',
        title: 'Crime Alert Amplified',
        message: '$crimeType verified by community (${report.upvotes} upvotes) - ${distance.toStringAsFixed(1)}km away',
        timestamp: DateTime.now(),
        relatedReport: report,
      );

      _notifications.insert(0, notification);

      // Play amplified beep (slightly longer)
      _playAmplifiedBeep(report.aiSeverityScore);

      notifyListeners();
    }
  }

  String _getSeverityTitle(int severityScore) {
    switch (severityScore) {
      case 1:
        return '🟢 Low Priority Alert';
      case 2:
        return '🟡 Minor Crime Alert';
      case 3:
        return '🟠 Crime Alert';
      case 4:
        return '🔴 High Priority Alert';
      case 5:
        return '🚨 CRITICAL ALERT';
      default:
        return '📢 Crime Alert';
    }
  }

  /// Play beep sound based on severity (1-5)
  void _playBeep(int severity) {
    // Simulate different beep intensities
    // In a real app, you'd use audio packages like audioplayers
    switch (severity) {
      case 1:
        _systemBeep(); // Single short beep
        break;
      case 2:
        _systemBeep();
        Future.delayed(Duration(milliseconds: 200), () => _systemBeep());
        break;
      case 3:
        for (int i = 0; i < 3; i++) {
          Future.delayed(Duration(milliseconds: i * 150), () => _systemBeep());
        }
        break;
      case 4:
        for (int i = 0; i < 4; i++) {
          Future.delayed(Duration(milliseconds: i * 120), () => _systemBeep());
        }
        break;
      case 5:
      // Rapid beeping for critical alerts
        for (int i = 0; i < 6; i++) {
          Future.delayed(Duration(milliseconds: i * 100), () => _systemBeep());
        }
        break;
    }
  }

  /// Play amplified beep when crime gets many upvotes
  void _playAmplifiedBeep(int severity) {
    // Extended beeping pattern for amplified crimes
    int beepCount = severity + 2; // More beeps for amplified reports
    for (int i = 0; i < beepCount; i++) {
      Future.delayed(Duration(milliseconds: i * 80), () => _systemBeep());
    }
  }

  /// System beep using platform channel
  void _systemBeep() {
    try {
      SystemSound.play(SystemSoundType.click);
    } catch (e) {
      print('Could not play system sound: $e');
    }
  }

  /// Vibrate device based on severity
  void _vibrate(int severity) {
    try {
      switch (severity) {
        case 1:
          HapticFeedback.lightImpact();
          break;
        case 2:
          HapticFeedback.mediumImpact();
          break;
        case 3:
          HapticFeedback.heavyImpact();
          Future.delayed(Duration(milliseconds: 100), () => HapticFeedback.mediumImpact());
          break;
        case 4:
          HapticFeedback.heavyImpact();
          Future.delayed(Duration(milliseconds: 100), () => HapticFeedback.heavyImpact());
          break;
        case 5:
        // Intense vibration pattern for critical alerts
          for (int i = 0; i < 3; i++) {
            Future.delayed(Duration(milliseconds: i * 200), () => HapticFeedback.heavyImpact());
          }
          break;
      }
    } catch (e) {
      print('Could not vibrate device: $e');
    }
  }

  /// Public method to play a single sound/haptic pattern
  void playAlertPattern(int severity) {
    _playBeep(severity);
    _vibrate(severity);
  }

  /// Mark notification as read
  void markAsRead(String notificationId) {
    int index = _notifications.indexWhere((n) => n.id == notificationId);
    if (index != -1) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
      notifyListeners();
    }
  }

  /// Mark all notifications as read
  void markAllAsRead() {
    _notifications = _notifications.map((n) => n.copyWith(isRead: true)).toList();
    notifyListeners();
  }

  /// Clear all notifications
  void clearAll() {
    _notifications.clear();
    notifyListeners();
  }

  /// Remove specific notification
  void removeNotification(String notificationId) {
    _notifications.removeWhere((n) => n.id == notificationId);
    notifyListeners();
  }

  /// Get distance to a report
  double getDistanceToReport(CrimeReport report) {
    return _calculateDistance(
      _currentUserLat,
      _currentUserLng,
      report.latitude,
      report.longitude,
    );
  }

  /// Test notification (for development)
  void addTestNotification() {
    NotificationItem notification = NotificationItem(
      id: 'test_${DateTime.now().millisecondsSinceEpoch}',
      title: '🔴 Test Alert',
      message: 'This is a test notification',
      timestamp: DateTime.now(),
    );

    _notifications.insert(0, notification);
    _playBeep(3);
    notifyListeners();
  }
}