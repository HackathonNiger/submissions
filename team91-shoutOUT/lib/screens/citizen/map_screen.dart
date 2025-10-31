// screens/citizen/map_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import 'dart:math';
import 'package:flutter_map/flutter_map.dart'; // Import flutter_map
import 'package:latlong2/latlong.dart'; // Import latlong2
import '../../services/report_service.dart';
import '../../services/notification_service.dart';
import '../../services/ai_analysis_service.dart';
import '../../models/crime_report.dart';

class MapScreen extends StatefulWidget {
  @override
  _MapScreenState createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> with TickerProviderStateMixin {
  late AnimationController _beepController;
  late AnimationController _pulseController;
  Map<String, Timer> _reportBeepTimers = {};
  final MapController _mapController = MapController(); // Controller for the map

  // Mock user location (Abuja center)
  final LatLng _userLocation = LatLng(9.0579, 7.4951);
  double _zoomLevel = 12.0;

  CrimeReport? _selectedReport;

  @override
  void initState() {
    super.initState();
    _beepController = AnimationController(
      duration: Duration(milliseconds: 300),
      vsync: this,
    );
    _pulseController = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    )..repeat();

    _startBeepingForActiveReports();
  }

  @override
  void dispose() {
    _beepController.dispose();
    _pulseController.dispose();
    _reportBeepTimers.values.forEach((timer) => timer.cancel());
    super.dispose();
  }

  void _startBeepingForActiveReports() {
    Timer.periodic(Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      final reportService = Provider.of<ReportService>(context, listen: false);
      final activeReports = reportService.activeReports;

      for (final report in activeReports) {
        _scheduleReportBeep(report);
      }
    });
  }

  void _scheduleReportBeep(CrimeReport report) {
    _reportBeepTimers[report.id]?.cancel();

    int beepInterval = _getBeepInterval(report.aiSeverityScore);

    _reportBeepTimers[report.id] = Timer.periodic(
      Duration(seconds: beepInterval),
          (timer) {
        if (mounted) {
          _playMapBeepForReport(report.aiSeverityScore);
          _triggerBeepAnimation();
        } else {
          timer.cancel();
        }
      },
    );
  }

  void _playMapBeepForReport(int severity) {
    Provider.of<NotificationService>(context, listen: false).playAlertPattern(severity);
  }

  int _getBeepInterval(int severity) {
    switch (severity) {
      case 1: return 30; // Every 30 seconds
      case 2: return 20; // Every 20 seconds
      case 3: return 15; // Every 15 seconds
      case 4: return 10; // Every 10 seconds
      case 5: return 5;  // Every 5 seconds (critical)
      default: return 20;
    }
  }

  void _triggerBeepAnimation() {
    _beepController.forward().then((_) {
      _beepController.reverse();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<ReportService>(
        builder: (context, reportService, child) {
          final reports = reportService.activeReports;

          // Map all reports to FlutterMap Markers
          List<Marker> crimeMarkers = reports.map((report) {
            return Marker(
              width: 50.0,
              height: 50.0,
              point: LatLng(report.latitude, report.longitude),
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedReport = report;
                  });
                  _showReportPopup(report);
                },
                child: Icon(
                  Icons.location_on,
                  color: AIAnalysisService.getSeverityColor(report.aiSeverityScore),
                  size: 40,
                ),
              ),
            );
          }).toList();

          return Stack(
            children: [
              // Flutter Map Widget
              FlutterMap(
                mapController: _mapController,
                options: MapOptions(
                  initialCenter: _userLocation,
                  initialZoom: _zoomLevel,
                  onTap: (tapPosition, point) {
                    setState(() {
                      _selectedReport = null;
                    });
                  },
                ),
                children: [
                  TileLayer(
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'com.example.crimealert', // Replace with your package name
                  ),
                  MarkerLayer(
                    markers: [
                      // User location marker
                      Marker(
                        width: 30.0,
                        height: 30.0,
                        point: _userLocation,
                        child: Icon(
                          Icons.my_location,
                          color: Colors.blue,
                          size: 30,
                        ),
                      ),
                      ...crimeMarkers,
                    ],
                  ),
                ],
              ),

              // Map Controls
              Positioned(
                top: 50,
                right: 16,
                child: Column(
                  children: [
                    _buildMapButton(
                      icon: Icons.add,
                      onPressed: () {
                        _mapController.move(_mapController.center, _mapController.zoom + 1);
                      },
                    ),
                    SizedBox(height: 8),
                    _buildMapButton(
                      icon: Icons.remove,
                      onPressed: () {
                        _mapController.move(_mapController.center, _mapController.zoom - 1);
                      },
                    ),
                    SizedBox(height: 8),
                    _buildMapButton(
                      icon: Icons.my_location,
                      onPressed: () {
                        _mapController.move(_userLocation, _zoomLevel);
                      },
                    ),
                  ],
                ),
              ),

              // Legend
              Positioned(
                top: 50,
                left: 16,
                child: Card(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Crime Severity',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                        SizedBox(height: 8),
                        ...List.generate(5, (index) {
                          int level = index + 1;
                          return Padding(
                            padding: EdgeInsets.only(bottom: 4),
                            child: Row(
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
                                SizedBox(width: 6),
                                Text(
                                  'Level $level',
                                  style: TextStyle(fontSize: 10),
                                ),
                              ],
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                ),
              ),

              // Active Reports Counter
              Positioned(
                bottom: 100,
                left: 16,
                right: 16,
                child: Card(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Row(
                      children: [
                        AnimatedBuilder(
                          animation: _beepController,
                          builder: (context, child) {
                            return Transform.scale(
                              scale: 1.0 + (_beepController.value * 0.2),
                              child: Icon(
                                Icons.volume_up,
                                color: Colors.red,
                                size: 24,
                              ),
                            );
                          },
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                '${reports.length} Active Crime Alert${reports.length == 1 ? '' : 's'}',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              if (reports.isNotEmpty)
                                Text(
                                  'Beeping intensity varies by severity level',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[600],
                                  ),
                                ),
                            ],
                          ),
                        ),
                        Switch(
                          value: true, // Sound enabled
                          onChanged: (value) {
                            // Toggle sound on/off
                            if (value) {
                              _startBeepingForActiveReports();
                            } else {
                              _reportBeepTimers.values.forEach((timer) => timer.cancel());
                              _reportBeepTimers.clear();
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Report Details Popup
              if (_selectedReport != null)
                Positioned(
                  bottom: 200,
                  left: 16,
                  right: 16,
                  child: _buildReportCard(_selectedReport!),
                ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildMapButton({required IconData icon, required VoidCallback onPressed}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: IconButton(
        icon: Icon(icon),
        onPressed: onPressed,
        padding: EdgeInsets.all(8),
      ),
    );
  }

  Widget _buildReportCard(CrimeReport report) {
    return Card(
      elevation: 8,
      child: Padding(
        padding: EdgeInsets.all(16),
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
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    _getCrimeTypeString(report.crimeType),
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () {
                    setState(() {
                      _selectedReport = null;
                    });
                  },
                  padding: EdgeInsets.zero,
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              report.description,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.location_on, size: 16, color: Colors.grey),
                SizedBox(width: 4),
                Expanded(
                  child: Text(
                    report.address,
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.access_time, size: 16, color: Colors.grey),
                SizedBox(width: 4),
                Text(
                  _getTimeAgo(report.timestamp),
                  style: TextStyle(color: Colors.grey[600], fontSize: 12),
                ),
                Spacer(),
                Text('👍 ${report.upvotes}'),
                SizedBox(width: 8),
                Text('👎 ${report.downvotes}'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showReportPopup(CrimeReport report) {
    Provider.of<NotificationService>(context, listen: false).playAlertPattern(report.aiSeverityScore);
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