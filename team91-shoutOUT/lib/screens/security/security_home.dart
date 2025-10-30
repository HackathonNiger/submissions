// screens/security/security_home.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../services/report_service.dart';
import '../../services/notification_service.dart';
import '../../services/ai_analysis_service.dart';
import '../../models/crime_report.dart';
import '../../models/user.dart';
import '../citizen/map_screen.dart';
import '../notifications/notification_screen.dart';
import '../auth/login_screen.dart';

class SecurityHome extends StatefulWidget {
  @override
  _SecurityHomeState createState() => _SecurityHomeState();
}

class _SecurityHomeState extends State<SecurityHome> with SingleTickerProviderStateMixin {
  int _currentIndex = 0;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final reportService = Provider.of<ReportService>(context, listen: false);
      final notificationService = Provider.of<NotificationService>(context, listen: false);

      reportService.setNotificationService(notificationService);
      reportService.loadReports();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final user = authService.currentUser!;

    List<Widget> pages = [
      _buildDashboard(),
      MapScreen(),
      _buildProfileTab(authService),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Security Dashboard'),
            Text(
              '${user.agency}',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.normal),
            ),
          ],
        ),
        backgroundColor: Colors.indigo,
        actions: [
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
            onPressed: () {
              Provider.of<ReportService>(context, listen: false).loadReports();
            },
          ),
        ],
      ),
      body: pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.map),
            label: 'Live Map',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildDashboard() {
    return Consumer<ReportService>(
      builder: (context, reportService, child) {
        if (reportService.isLoading) {
          return Center(child: CircularProgressIndicator());
        }

        final reports = reportService.reports;
        final pendingReports = reportService.pendingReports;
        final assignedReports = reportService.getReportsByOfficerId(
          Provider.of<AuthService>(context, listen: false).currentUser!.id,
        );
        final criticalReports = reports.where((r) => r.aiSeverityScore >= 4).toList();

        return SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Stats Overview
              Container(
                padding: EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        'Pending',
                        pendingReports.length.toString(),
                        Colors.orange,
                        Icons.pending_actions,
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: _buildStatCard(
                        'Critical',
                        criticalReports.length.toString(),
                        Colors.red,
                        Icons.error_outline,
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: _buildStatCard(
                        'Assigned',
                        assignedReports.length.toString(),
                        Colors.blue,
                        Icons.assignment_ind,
                      ),
                    ),
                  ],
                ),
              ),
              Divider(height: 1),

              // TabBar and TabBarView
              DefaultTabController(
                length: 2,
                child: Column(
                  children: [
                    TabBar(
                      controller: _tabController,
                      labelColor: Colors.indigo,
                      unselectedLabelColor: Colors.grey,
                      indicatorColor: Colors.indigo,
                      tabs: [
                        Tab(text: 'All Reports'),
                        Tab(text: 'My Assignments'),
                      ],
                    ),
                    SizedBox(
                      height: 500, // Adjust height as needed
                      child: TabBarView(
                        controller: _tabController,
                        children: [
                          _buildReportsList(reports, reportService),
                          _buildReportsList(assignedReports, reportService),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildReportsList(List<CrimeReport> reports, ReportService reportService) {
    if (reports.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.assignment_turned_in, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              'No reports in this category',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
          ],
        ),
      );
    }
    return ListView.builder(
      itemCount: reports.length,
      itemBuilder: (context, index) {
        final report = reports[index];
        return _buildReportCard(report, reportService);
      },
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

  Widget _buildReportCard(CrimeReport report, ReportService reportService) {
    final user = Provider.of<AuthService>(context, listen: false).currentUser!;
    final isAssigned = report.assignedOfficerId == user.id;

    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: report.aiSeverityScore >= 4 ? 4 : 2,
      child: ExpansionTile(
        tilePadding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        leading: CircleAvatar(
          backgroundColor: AIAnalysisService.getSeverityColor(report.aiSeverityScore),
          child: Text(
            report.aiSeverityScore.toString(),
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        title: Text(
          _getCrimeTypeString(report.crimeType),
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(report.description, maxLines: 1, overflow: TextOverflow.ellipsis),
            SizedBox(height: 4),
            Text(
              '${report.address} • ${_getTimeAgo(report.timestamp)}',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
        ),
        trailing: _buildStatusChip(report.status),
        children: [
          Divider(height: 1),
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Details:', style: TextStyle(fontWeight: FontWeight.bold)),
                SizedBox(height: 8),
                Text('Reported by: ${report.isAnonymous ? 'Anonymous' : report.reporterName}'),
                Text('Community Votes: 👍 ${report.upvotes} 👎 ${report.downvotes}'),
                SizedBox(height: 8),
                if (report.aiAnalysisExplanation != null)
                  Text(
                    'AI Analysis: ${report.aiAnalysisExplanation!}',
                    style: TextStyle(fontStyle: FontStyle.italic),
                  ),
                SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    if (!isAssigned)
                      ElevatedButton.icon(
                        onPressed: () => _showAssignDialog(report, reportService, user),
                        icon: Icon(Icons.assignment_ind),
                        label: Text('Assign to me'),
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
                      ),
                    if (isAssigned)
                      ElevatedButton.icon(
                        onPressed: () => _showChangeStatusDialog(report, reportService),
                        icon: Icon(Icons.track_changes),
                        label: Text('Change Status'),
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                      ),
                    ElevatedButton.icon(
                      onPressed: () {
                        // Logic to open on map
                      },
                      icon: Icon(Icons.map),
                      label: Text('View on Map'),
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
                    ),
                  ],
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
                    backgroundColor: Colors.indigo,
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
                  if (user.badgeNumber != null)
                    Text('Badge: ${user.badgeNumber}', style: TextStyle(color: Colors.grey)),
                  SizedBox(height: 8),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.indigo.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'SECURITY PERSONNEL',
                      style: TextStyle(
                        color: Colors.indigo,
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

  void _showAssignDialog(CrimeReport report, ReportService reportService, User user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Assign Report?'),
        content: Text('Do you want to assign this report to yourself? This will change its status to "Investigating".'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              reportService.assignReport(report.id, user.id);
              Navigator.of(context).pop();
            },
            child: Text('Assign'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
          ),
        ],
      ),
    );
  }

  void _showChangeStatusDialog(CrimeReport report, ReportService reportService) {
    ReportStatus selectedStatus = report.status;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Update Report Status'),
        content: StatefulBuilder(
          builder: (context, setState) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Select the new status for this report:'),
                SizedBox(height: 16),
                DropdownButton<ReportStatus>(
                  value: selectedStatus,
                  items: ReportStatus.values.map((status) {
                    return DropdownMenuItem(
                      value: status,
                      child: Text(_getReportStatusString(status)),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      selectedStatus = value!;
                    });
                  },
                ),
              ],
            );
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              reportService.updateReportStatus(report.id, selectedStatus);
              Navigator.of(context).pop();
            },
            child: Text('Update'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
          ),
        ],
      ),
    );
  }

  String _getReportStatusString(ReportStatus status) {
    switch (status) {
      case ReportStatus.pending: return 'Pending';
      case ReportStatus.investigating: return 'Investigating';
      case ReportStatus.resolved: return 'Resolved';
      case ReportStatus.dismissed: return 'Dismissed';
    }
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