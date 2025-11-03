// screens/citizen/citizen_home.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../services/report_service.dart';
import '../../services/notification_service.dart';
import '../../services/ai_analysis_service.dart';
import '../../models/crime_report.dart';
import 'report_crime_screen.dart';
import '../citizen/map_screen.dart';
import '../notifications/notification_screen.dart';
import '../auth/login_screen.dart';

class CitizenHome extends StatefulWidget {
  @override
  _CitizenHomeState createState() => _CitizenHomeState();
}

class _CitizenHomeState extends State<CitizenHome> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final reportService = Provider.of<ReportService>(context, listen: false);
      final notificationService = Provider.of<NotificationService>(context, listen: false);

      // Connect services
      reportService.setNotificationService(notificationService);

      // Load reports
      reportService.loadReports();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final reportService = Provider.of<ReportService>(context);

    List<Widget> pages = [
      _buildHomeTab(reportService),
      MapScreen(),
      _buildProfileTab(authService),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text('Crime Alert - Citizen'),
        backgroundColor: Colors.blue,
        actions: [
          // Notification icon with badge
          Consumer<NotificationService>(
            builder: (context, notificationService, child) {
              return Stack(
                children: [
                  IconButton(
                    icon: Icon(Icons.notifications),
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (context) => NotificationScreen()),
                      );
                    },
                  ),
                  if (notificationService.unreadCount > 0)
                    Positioned(
                      right: 8,
                      top: 8,
                      child: Container(
                        padding: EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        constraints: BoxConstraints(
                          minWidth: 16,
                          minHeight: 16,
                        ),
                        child: Text(
                          '${notificationService.unreadCount}',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              );
            },
          ),
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () => reportService.loadReports(),
          ),
        ],
      ),
      body: pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.map),
            label: 'Map',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
      floatingActionButton: _currentIndex == 0 ? FloatingActionButton.extended(
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (context) => ReportCrimeScreen()),
          );
        },
        icon: Icon(Icons.add_alert),
        label: Text('Report Crime'),
        backgroundColor: Colors.red,
      ) : null,
    );
  }

  Widget _buildHomeTab(ReportService reportService) {
    if (reportService.isLoading) {
      return Center(child: CircularProgressIndicator());
    }

    final reports = reportService.reports;

    return RefreshIndicator(
      onRefresh: reportService.loadReports,
      child: Column(
        children: [
          // Quick Stats
          Container(
            padding: EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'Active Reports',
                    reportService.activeReports.length.toString(),
                    Colors.orange,
                    Icons.warning,
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: _buildStatCard(
                    'Total Reports',
                    reports.length.toString(),
                    Colors.blue,
                    Icons.report,
                  ),
                ),
              ],
            ),
          ),

          // Severity Legend
          Container(
            margin: EdgeInsets.symmetric(horizontal: 16),
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.grey[300]!),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('AI Severity Levels:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [1, 2, 3, 4, 5].map((level) {
                    return Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 12,
                          height: 12,
                          decoration: BoxDecoration(
                            color: AIAnalysisService.getSeverityColor(level),
                            shape: BoxShape.circle,
                          ),
                        ),
                        SizedBox(width: 2),
                        Text('$level', style: TextStyle(fontSize: 10)),
                      ],
                    );
                  }).toList(),
                ),
              ],
            ),
          ),

          SizedBox(height: 8),

          // Reports List
          Expanded(
            child: reports.isEmpty
                ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.report_off, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No reports yet', style: TextStyle(fontSize: 18, color: Colors.grey)),
                  SizedBox(height: 8),
                  Text('Tap the "Report Crime" button to report an incident', style: TextStyle(color: Colors.grey)),
                ],
              ),
            )
                : ListView.builder(
              itemCount: reports.length,
              itemBuilder: (context, index) {
                final report = reports[index];
                return _buildReportCard(report);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, Color color, IconData icon) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            Text(title, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildReportCard(CrimeReport report) {
    final notificationService = Provider.of<NotificationService>(context, listen: false);
    final distance = notificationService.getDistanceToReport(report);

    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: report.aiSeverityScore >= 4 ? 4 : 2,
      child: Column(
        children: [
          ListTile(
            leading: Stack(
              children: [
                CircleAvatar(
                  backgroundColor: AIAnalysisService.getSeverityColor(report.aiSeverityScore),
                  child: Text(
                    report.aiSeverityScore.toString(),
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
                if (report.aiSeverityScore >= 4)
                  Positioned(
                    right: -2,
                    top: -2,
                    child: Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.priority_high,
                        color: Colors.white,
                        size: 8,
                      ),
                    ),
                  ),
              ],
            ),
            title: Row(
              children: [
                Expanded(
                  child: Text(_getCrimeTypeString(report.crimeType)),
                ),
                if (distance <= 2.0)
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      'NEAR YOU',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
              ],
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(report.description, maxLines: 2, overflow: TextOverflow.ellipsis),
                SizedBox(height: 4),
                Text(
                  '${report.address} • ${distance.toStringAsFixed(1)}km away • ${_getTimeAgo(report.timestamp)}',
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
            trailing: _buildStatusChip(report.status),
            onTap: () => _showReportDetails(report),
          ),

          // Voting buttons with amplification indicator
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(Icons.thumb_up, color: Colors.green),
                  onPressed: () => _voteOnReport(report, true),
                ),
                Text(report.upvotes.toString()),
                SizedBox(width: 16),
                IconButton(
                  icon: Icon(Icons.thumb_down, color: Colors.red),
                  onPressed: () => _voteOnReport(report, false),
                ),
                Text(report.downvotes.toString()),
                SizedBox(width: 16),
                if (report.upvotes >= 5)
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.green),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.trending_up, color: Colors.green, size: 16),
                        SizedBox(width: 4),
                        Text(
                          'AMPLIFIED',
                          style: TextStyle(
                            color: Colors.green,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                Spacer(),
                Text(
                  'AI: ${report.aiSeverityScore}/5',
                  style: TextStyle(
                    fontSize: 12,
                    color: AIAnalysisService.getSeverityColor(report.aiSeverityScore),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(ReportStatus status) {
    Color color;
    String text;
    IconData icon;

    switch (status) {
      case ReportStatus.pending:
        color = Colors.orange;
        text = 'Pending';
        icon = Icons.pending;
        break;
      case ReportStatus.investigating:
        color = Colors.blue;
        text = 'Investigating';
        icon = Icons.search;
        break;
      case ReportStatus.resolved:
        color = Colors.green;
        text = 'Resolved';
        icon = Icons.check_circle;
        break;
      case ReportStatus.dismissed:
        color = Colors.grey;
        text = 'Dismissed';
        icon = Icons.cancel;
        break;
    }

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 12),
          SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(
              color: color,
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileTab(AuthService authService) {
    final user = authService.currentUser!;

    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        children: [
          // Profile Header
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: Colors.blue,
                    child: Text(
                      user.name[0].toUpperCase(),
                      style: TextStyle(fontSize: 32, color: Colors.white),
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    user.name,
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  Text(user.email, style: TextStyle(color: Colors.grey)),
                  SizedBox(height: 8),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'CITIZEN',
                      style: TextStyle(
                        color: Colors.green,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          SizedBox(height: 20),

          // Settings Options
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: Icon(Icons.notifications),
                  title: Text('Notification Settings'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (context) => NotificationScreen()),
                    );
                  },
                ),
                Divider(),
                ListTile(
                  leading: Icon(Icons.help),
                  title: Text('Help & Support'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    // Navigate to help screen
                  },
                ),
                Divider(),
                ListTile(
                  leading: Icon(Icons.info),
                  title: Text('About'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    _showAboutDialog();
                  },
                ),
              ],
            ),
          ),

          SizedBox(height: 20),

          // Logout Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                authService.logout();
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (context) => LoginScreen()),
                      (route) => false,
                );
              },
              child: Text('Logout'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _voteOnReport(CrimeReport report, bool isUpvote) {
    final reportService = Provider.of<ReportService>(context, listen: false);
    final notificationService = Provider.of<NotificationService>(context, listen: false);
    final authService = Provider.of<AuthService>(context, listen: false);

    reportService.voteOnReport(report.id, authService.currentUser!.id, isUpvote);

    // Check if report got amplified (5+ upvotes)
    if (isUpvote && report.upvotes + 1 >= 5) {
      final updatedReport = report.copyWith(upvotes: report.upvotes + 1);
      notificationService.reportAmplified(updatedReport);
    }
  }

  void _showReportDetails(CrimeReport report) {
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
                      'AI Level ${report.aiSeverityScore}',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                  SizedBox(width: 8),
                  Text(
                    _getCrimeTypeString(report.crimeType),
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
              Text('Time:', style: TextStyle(fontWeight: FontWeight.bold)),
              Text(_getTimeAgo(report.timestamp)),
              SizedBox(height: 8),
              Text('Community votes:', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('👍 ${report.upvotes} 👎 ${report.downvotes}'),
              if (report.aiAnalysisExplanation != null) ...[
                SizedBox(height: 12),
                ExpansionTile(
                  title: Text('AI Analysis', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  children: [
                    Padding(
                      padding: EdgeInsets.all(8),
                      child: Text(report.aiAnalysisExplanation!, style: TextStyle(fontSize: 12)),
                    ),
                  ],
                ),
              ],
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

  void _showAboutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('About Crime Alert'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Crime Alert helps communities report and track criminal activities in real-time.'),
            SizedBox(height: 12),
            Text('Features:', style: TextStyle(fontWeight: FontWeight.bold)),
            Text('• AI-powered severity analysis'),
            Text('• Community voting system'),
            Text('• Real-time notifications'),
            Text('• Anonymous reporting'),
            Text('• Interactive crime map'),
            SizedBox(height: 12),
            Text('Version 1.0.0'),
          ],
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

  String _getCrimeTypeString(CrimeType type) {
    switch (type) {
      case CrimeType.vandalism:
        return 'Vandalism';
      case CrimeType.theft:
        return 'Theft';
      case CrimeType.assault:
        return 'Assault';
      case CrimeType.publicDisturbance:
        return 'Public Disturbance';
      case CrimeType.drugActivity:
        return 'Drug Activity';
      case CrimeType.other:
        return 'Other';
    }
  }

  String _getTimeAgo(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

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
}