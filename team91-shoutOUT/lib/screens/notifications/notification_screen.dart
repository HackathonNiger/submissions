// screens/notifications/notification_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/notification_service.dart';
import '../../services/ai_analysis_service.dart';
import '../../models/crime_report.dart';

class NotificationScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notifications'),
        backgroundColor: Colors.blue,
        actions: [
          Consumer<NotificationService>(
            builder: (context, notificationService, child) {
              return PopupMenuButton<String>(
                onSelected: (value) {
                  switch (value) {
                    case 'mark_all_read':
                      notificationService.markAllAsRead();
                      break;
                    case 'clear_all':
                      _showClearDialog(context, notificationService);
                      break;
                    case 'test':
                      notificationService.addTestNotification();
                      break;
                  }
                },
                itemBuilder: (context) => [
                  PopupMenuItem(
                    value: 'mark_all_read',
                    child: Row(
                      children: [
                        Icon(Icons.done_all, size: 20),
                        SizedBox(width: 8),
                        Text('Mark all as read'),
                      ],
                    ),
                  ),
                  PopupMenuItem(
                    value: 'clear_all',
                    child: Row(
                      children: [
                        Icon(Icons.clear_all, size: 20),
                        SizedBox(width: 8),
                        Text('Clear all'),
                      ],
                    ),
                  ),
                  PopupMenuItem(
                    value: 'test',
                    child: Row(
                      children: [
                        Icon(Icons.bug_report, size: 20),
                        SizedBox(width: 8),
                        Text('Test notification'),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
      body: Consumer<NotificationService>(
        builder: (context, notificationService, child) {
          final notifications = notificationService.notifications;

          if (notifications.isEmpty) {
            return _buildEmptyState();
          }

          return Column(
            children: [
              // Notification settings bar
              _buildSettingsBar(context, notificationService),

              // Notifications list
              Expanded(
                child: ListView.builder(
                  itemCount: notifications.length,
                  itemBuilder: (context, index) {
                    final notification = notifications[index];
                    return _buildNotificationCard(
                      context,
                      notification,
                      notificationService,
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_none,
            size: 80,
            color: Colors.grey[400],
          ),
          SizedBox(height: 16),
          Text(
            'No notifications',
            style: TextStyle(
              fontSize: 20,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(height: 8),
          Text(
            'You\'ll receive alerts when crimes are reported near you',
            style: TextStyle(
              color: Colors.grey[500],
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsBar(BuildContext context, NotificationService service) {
    return Container(
      padding: EdgeInsets.all(16),
      color: Colors.grey[100],
      child: Row(
        children: [
          Icon(Icons.location_on, color: Colors.blue, size: 20),
          SizedBox(width: 8),
          Text(
            'Alert radius: 2.0km',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          Spacer(),
          TextButton.icon(
            onPressed: () => _showRadiusDialog(context, service),
            icon: Icon(Icons.settings, size: 16),
            label: Text('Adjust', style: TextStyle(fontSize: 12)),
            style: TextButton.styleFrom(
              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard(
      BuildContext context,
      NotificationItem notification,
      NotificationService service,
      ) {
    final isUnread = !notification.isRead;
    final hasReport = notification.relatedReport != null;

    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      elevation: isUnread ? 3 : 1,
      child: ListTile(
        leading: _buildNotificationIcon(notification),
        title: Text(
          notification.title,
          style: TextStyle(
            fontWeight: isUnread ? FontWeight.bold : FontWeight.normal,
            fontSize: 16,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 4),
            Text(
              notification.message,
              style: TextStyle(
                fontSize: 14,
                color: isUnread ? Colors.black87 : Colors.grey[600],
              ),
            ),
            SizedBox(height: 4),
            Row(
              children: [
                Icon(Icons.access_time, size: 12, color: Colors.grey[500]),
                SizedBox(width: 4),
                Text(
                  _formatTimestamp(notification.timestamp),
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
                if (hasReport) ...[
                  Spacer(),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AIAnalysisService.getSeverityColor(
                        notification.relatedReport!.aiSeverityScore,
                      ).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: AIAnalysisService.getSeverityColor(
                          notification.relatedReport!.aiSeverityScore,
                        ),
                        width: 1,
                      ),
                    ),
                    child: Text(
                      'Level ${notification.relatedReport!.aiSeverityScore}',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: AIAnalysisService.getSeverityColor(
                          notification.relatedReport!.aiSeverityScore,
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (isUnread)
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: Colors.red,
                  shape: BoxShape.circle,
                ),
              ),
            PopupMenuButton<String>(
              onSelected: (value) {
                switch (value) {
                  case 'mark_read':
                    service.markAsRead(notification.id);
                    break;
                  case 'remove':
                    service.removeNotification(notification.id);
                    break;
                }
              },
              itemBuilder: (context) => [
                if (isUnread)
                  PopupMenuItem(
                    value: 'mark_read',
                    child: Row(
                      children: [
                        Icon(Icons.done, size: 18),
                        SizedBox(width: 8),
                        Text('Mark as read'),
                      ],
                    ),
                  ),
                PopupMenuItem(
                  value: 'remove',
                  child: Row(
                    children: [
                      Icon(Icons.delete, size: 18),
                      SizedBox(width: 8),
                      Text('Remove'),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
        onTap: () {
          if (isUnread) {
            service.markAsRead(notification.id);
          }

          if (hasReport) {
            _showReportDetails(context, notification.relatedReport!);
          }
        },
      ),
    );
  }

  Widget _buildNotificationIcon(NotificationItem notification) {
    if (notification.relatedReport != null) {
      final severity = notification.relatedReport!.aiSeverityScore;
      return CircleAvatar(
        backgroundColor: AIAnalysisService.getSeverityColor(severity),
        radius: 20,
        child: Icon(
          _getSeverityIcon(severity),
          color: Colors.white,
          size: 20,
        ),
      );
    }

    return CircleAvatar(
      backgroundColor: Colors.blue,
      child: Icon(Icons.notifications, color: Colors.white),
    );
  }

  IconData _getSeverityIcon(int severity) {
    switch (severity) {
      case 1:
        return Icons.info;
      case 2:
        return Icons.warning_amber;
      case 3:
        return Icons.warning;
      case 4:
        return Icons.error;
      case 5:
        return Icons.crisis_alert;
      default:
        return Icons.report;
    }
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }

  void _showRadiusDialog(BuildContext context, NotificationService service) {
    double currentRadius = 2.0; // Default radius

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Notification Radius'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Set the radius for crime alerts around your location'),
            SizedBox(height: 16),
            StatefulBuilder(
              builder: (context, setState) => Column(
                children: [
                  Slider(
                    value: currentRadius,
                    min: 0.5,
                    max: 10.0,
                    divisions: 19,
                    label: '${currentRadius.toStringAsFixed(1)}km',
                    onChanged: (value) {
                      setState(() => currentRadius = value);
                    },
                  ),
                  Text('${currentRadius.toStringAsFixed(1)} kilometers'),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              service.setNotificationRadius(currentRadius);
              Navigator.of(context).pop();
            },
            child: Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showClearDialog(BuildContext context, NotificationService service) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Clear All Notifications'),
        content: Text('Are you sure you want to clear all notifications? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              service.clearAll();
              Navigator.of(context).pop();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: Text('Clear All'),
          ),
        ],
      ),
    );
  }

  void _showReportDetails(BuildContext context, CrimeReport report) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Crime Report Details'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AIAnalysisService.getSeverityColor(report.aiSeverityScore),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'Level ${report.aiSeverityScore}',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                  SizedBox(width: 8),
                  Text(
                    report.crimeType.toString().split('.').last.toUpperCase(),
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              SizedBox(height: 12),
              Text('Description:', style: TextStyle(fontWeight: FontWeight.bold)),
              Text(report.description),
              SizedBox(height: 8),
              Text('Location:', style: TextStyle(fontWeight: FontWeight.bold)),
              Text(report.address),
              SizedBox(height: 8),
              Text('Reported by:', style: TextStyle(fontWeight: FontWeight.bold)),
              Text(report.isAnonymous ? 'Anonymous' : report.reporterName ?? 'Unknown'),
              SizedBox(height: 8),
              Text('Community votes:', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('👍 ${report.upvotes} 👎 ${report.downvotes}'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Close'),
          ),
        ],
      ),
    );
  }
}