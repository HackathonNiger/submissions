// services/report_service.dart
import 'package:flutter/foundation.dart';
import '../models/crime_report.dart';
import '../models/user.dart';
import 'ai_analysis_service.dart';
import 'notification_service.dart';

class ReportService with ChangeNotifier {
  List<CrimeReport> _reports = [];
  bool _isLoading = false;
  NotificationService? _notificationService;

  List<CrimeReport> get reports => _reports;
  bool get isLoading => _isLoading;

  void setNotificationService(NotificationService notificationService) {
    _notificationService = notificationService;
  }

  List<CrimeReport> get pendingReports =>
      _reports.where((r) => r.status == ReportStatus.pending).toList();

  List<CrimeReport> get activeReports => _reports
      .where((r) =>
  r.status == ReportStatus.pending ||
      r.status == ReportStatus.investigating)
      .toList();

  // New method to get reports assigned to a specific officer
  List<CrimeReport> getReportsByOfficerId(String officerId) {
    return _reports.where((r) => r.assignedOfficerId == officerId).toList();
  }

  Future<void> loadReports() async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(Duration(seconds: 1));

    // Mock data - replace with actual API calls
    _reports = [
      CrimeReport(
        id: 'report_1',
        reporterId: 'citizen_1',
        reporterName: 'Anonymous',
        isAnonymous: true,
        crimeType: CrimeType.vandalism,
        description: 'Graffiti on public building',
        latitude: 9.0579,
        longitude: 7.4951,
        address: 'Central Business District, Abuja',
        timestamp: DateTime.now().subtract(Duration(hours: 2)),
        upvotes: 5,
        downvotes: 1,
        aiSeverityScore: 2,
        aiAnalysisExplanation: 'AI Analysis: Low priority\n\nFactors considered:\n• Crime type: vandalism\n• Anonymous report',
      ),
      CrimeReport(
        id: 'report_2',
        reporterId: 'citizen_2',
        reporterName: 'Mary Johnson',
        isAnonymous: false,
        crimeType: CrimeType.theft,
        description: 'Someone stealing from parked cars with a weapon, happening right now near the school',
        latitude: 9.0765,
        longitude: 7.3986,
        address: 'Garki Area, Abuja',
        timestamp: DateTime.now().subtract(Duration(minutes: 30)),
        status: ReportStatus.investigating,
        upvotes: 8,
        downvotes: 0,
        aiSeverityScore: 5,
        aiAnalysisExplanation: 'AI Analysis: Critical priority\n\nFactors considered:\n• Crime type: theft\n• High priority keywords detected: weapon, right now, school\n• Recent report (within 1 hour)\n• High community confidence',
      ),
    ];

    _isLoading = false;
    notifyListeners();
  }

  Future<void> submitReport(CrimeReport report) async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(Duration(seconds: 1));

    // Run AI analysis on the report
    int aiScore = AIAnalysisService.analyzeSeverity(report);
    String aiExplanation = AIAnalysisService.getAnalysisExplanation(report, aiScore);

    // Update report with AI analysis
    CrimeReport analyzedReport = report.copyWith(
      aiSeverityScore: aiScore,
      aiAnalysisExplanation: aiExplanation,
    );

    _reports.add(analyzedReport);

    // Sort reports by AI severity score (highest first) and timestamp
    _reports.sort((a, b) {
      int scoreComparison = b.aiSeverityScore.compareTo(a.aiSeverityScore);
      if (scoreComparison != 0) return scoreComparison;
      return b.timestamp.compareTo(a.timestamp);
    });

    _isLoading = false;
    notifyListeners();
  }

  Future<void> updateReportStatus(String reportId, ReportStatus status) async {
    final index = _reports.indexWhere((r) => r.id == reportId);
    if (index != -1) {
      _reports[index] = _reports[index].copyWith(status: status);
      notifyListeners();
    }
  }

  Future<void> assignReport(String reportId, String officerId) async {
    final index = _reports.indexWhere((r) => r.id == reportId);
    if (index != -1) {
      _reports[index] = _reports[index].copyWith(
        assignedOfficerId: officerId,
        status: ReportStatus.investigating,
      );
      notifyListeners();
    }
  }

  Future<void> voteOnReport(String reportId, String userId, bool isUpvote) async {
    final index = _reports.indexWhere((r) => r.id == reportId);
    if (index == -1) return;

    final report = _reports[index];
    final userVotes = Map<String, bool>.from(report.userVotes);
    final previousVote = userVotes[userId];

    int upvotes = report.upvotes;
    int downvotes = report.downvotes;

    // Remove previous vote if exists
    if (previousVote != null) {
      if (previousVote) {
        upvotes--;
      } else {
        downvotes--;
      }
    }

    // Add new vote
    userVotes[userId] = isUpvote;
    if (isUpvote) {
      upvotes++;
    } else {
      downvotes++;
    }

    _reports[index] = report.copyWith(
      upvotes: upvotes,
      downvotes: downvotes,
      userVotes: userVotes,
    );

    notifyListeners();
  }
}