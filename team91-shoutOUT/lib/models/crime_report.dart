// models/crime_report.dart
import 'package:flutter/foundation.dart';
import 'package:latlong2/latlong.dart';

enum CrimeType {
  vandalism,
  theft,
  assault,
  publicDisturbance,
  drugActivity,
  other
}

enum ReportStatus {
  pending,
  investigating,
  resolved,
  dismissed
}

class CrimeReport {
  final String id;
  final String? reporterId; // Made nullable
  final String? reporterName; // Made nullable
  final bool isAnonymous;
  final CrimeType crimeType;
  final String description;
  final double latitude;
  final double longitude;
  final String address;
  final DateTime timestamp;
  final ReportStatus status;
  final List<String> images;
  final int upvotes;
  final int downvotes;
  final Map<String, bool> userVotes;
  final String? assignedOfficerId;
  final int aiSeverityScore;
  final String? aiAnalysisExplanation;
  final String? mediaUrl;

  CrimeReport({
    required this.id,
    this.reporterId, // Removed 'required'
    this.reporterName, // Removed 'required'
    required this.isAnonymous,
    required this.crimeType,
    required this.description,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.timestamp,
    this.mediaUrl,
    this.status = ReportStatus.pending,
    this.images = const [],
    this.upvotes = 0,
    this.downvotes = 0,
    this.userVotes = const {},
    this.assignedOfficerId,
    this.aiSeverityScore = 3,
    this.aiAnalysisExplanation,
  });

  factory CrimeReport.fromJson(Map<String, dynamic> json) {
    return CrimeReport(
      id: json['id'],
      reporterId: json['reporterId'],
      reporterName: json['reporterName'],
      isAnonymous: json['isAnonymous'],
      crimeType: CrimeType.values[json['crimeType']],
      description: json['description'],
      latitude: json['latitude'],
      longitude: json['longitude'],
      address: json['address'],
      timestamp: DateTime.parse(json['timestamp']),
      status: ReportStatus.values[json['status']],
      images: List<String>.from(json['images'] ?? []),
      upvotes: json['upvotes'] ?? 0,
      downvotes: json['downvotes'] ?? 0,
      userVotes: Map<String, bool>.from(json['userVotes'] ?? {}),
      assignedOfficerId: json['assignedOfficerId'],
      aiSeverityScore: json['aiSeverityScore'] ?? 3,
      aiAnalysisExplanation: json['aiAnalysisExplanation'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'reporterId': reporterId,
      'reporterName': reporterName,
      'isAnonymous': isAnonymous,
      'crimeType': crimeType.index,
      'description': description,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'timestamp': timestamp.toIso8601String(),
      'status': status.index,
      'images': images,
      'upvotes': upvotes,
      'downvotes': downvotes,
      'userVotes': userVotes,
      'assignedOfficerId': assignedOfficerId,
      'aiSeverityScore': aiSeverityScore,
      'aiAnalysisExplanation': aiAnalysisExplanation,
    };
  }

  CrimeReport copyWith({
    String? id,
    String? reporterId,
    String? reporterName,
    bool? isAnonymous,
    CrimeType? crimeType,
    String? description,
    double? latitude,
    double? longitude,
    String? address,
    DateTime? timestamp,
    ReportStatus? status,
    List<String>? images,
    int? upvotes,
    int? downvotes,
    Map<String, bool>? userVotes,
    String? assignedOfficerId,
    int? aiSeverityScore,
    String? aiAnalysisExplanation,
  }) {
    return CrimeReport(
      id: id ?? this.id,
      reporterId: reporterId ?? this.reporterId,
      reporterName: reporterName ?? this.reporterName,
      isAnonymous: isAnonymous ?? this.isAnonymous,
      crimeType: crimeType ?? this.crimeType,
      description: description ?? this.description,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      address: address ?? this.address,
      timestamp: timestamp ?? this.timestamp,
      status: status ?? this.status,
      images: images ?? this.images,
      upvotes: upvotes ?? this.upvotes,
      downvotes: downvotes ?? this.downvotes,
      userVotes: userVotes ?? this.userVotes,
      assignedOfficerId: assignedOfficerId ?? this.assignedOfficerId,
      aiSeverityScore: aiSeverityScore ?? this.aiSeverityScore,
      aiAnalysisExplanation: aiAnalysisExplanation ?? this.aiAnalysisExplanation,
    );
  }
}