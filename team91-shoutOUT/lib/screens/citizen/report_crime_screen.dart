// screens/citizen/report_crime_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:latlong2/latlong.dart';
import 'package:camera/camera.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';
import '../../services/auth_service.dart';
import '../../services/report_service.dart';
import '../../models/crime_report.dart';
import '../../models/user.dart';
import 'location_picker_screen.dart';

class ReportCrimeScreen extends StatefulWidget {
  @override
  _ReportCrimeScreenState createState() => _ReportCrimeScreenState();
}

class _ReportCrimeScreenState extends State<ReportCrimeScreen> {
  final _formKey = GlobalKey<FormState>();
  final _descriptionController = TextEditingController();
  final _addressController = TextEditingController();

  CrimeType _selectedCrimeType = CrimeType.other;
  bool _isAnonymous = false;
  bool _isSubmitting = false;

  LatLng? _selectedLocation;

  // Camera-related variables
  CameraController? _cameraController;
  XFile? _capturedMedia;
  bool _isRecording = false;
  int _upvotes = 0;
  int _downvotes = 0;

  @override
  void initState() {
    super.initState();
    _initCamera();
  }

  Future<void> _initCamera() async {
    try {
      final cameras = await availableCameras();
      if (cameras.isNotEmpty) {
        _cameraController = CameraController(
          cameras[0],
          ResolutionPreset.high,
        );
        await _cameraController!.initialize();
      }
    } on CameraException catch (e) {
      print('Camera error: $e');
    }
  }

  @override
  void dispose() {
    _descriptionController.dispose();
    _addressController.dispose();
    _cameraController?.dispose();
    super.dispose();
  }

  Future<void> _useCurrentLocation() async {
    setState(() {
      _isSubmitting = true;
    });

    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Location permissions are denied.')),
          );
          return;
        }
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      _selectedLocation = LatLng(position.latitude, position.longitude);

      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      if (placemarks.isNotEmpty) {
        final placemark = placemarks.first;
        _addressController.text = placemark.street ?? 'Current Location';
      } else {
        _addressController.text = 'Current Location';
      }
    } catch (e) {
      _addressController.text = 'Error getting location';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not get current location: $e')),
      );
    } finally {
      setState(() {
        _isSubmitting = false;
      });
    }
  }

  Future<void> _selectOnMap() async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(
        builder: (context) => LocationPickerScreen(
          initialLocation: _selectedLocation ?? LatLng(9.0579, 7.4951),
        ),
      ),
    );

    if (result != null) {
      _selectedLocation = result['location'];
      _addressController.text = result['address'];
    }
  }

  Future<void> _takePicture() async {
    if (_cameraController == null || !_cameraController!.value.isInitialized) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Camera not initialized.')),
      );
      return;
    }
    try {
      final image = await _cameraController!.takePicture();
      setState(() {
        _capturedMedia = image;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Photo captured!')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to take picture.')),
      );
    }
  }

  Future<void> _startVideoRecording() async {
    if (_cameraController == null || !_cameraController!.value.isInitialized) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Camera not initialized.')),
      );
      return;
    }
    if (_cameraController!.value.isRecordingVideo) {
      return;
    }
    try {
      await _cameraController!.startVideoRecording();
      setState(() {
        _isRecording = true;
        _capturedMedia = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Recording started!')),
      );
    } on CameraException catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to start recording.')),
      );
    }
  }

  Future<void> _stopVideoRecording() async {
    if (!_cameraController!.value.isRecordingVideo) {
      return;
    }
    try {
      final video = await _cameraController!.stopVideoRecording();
      setState(() {
        _isRecording = false;
        _capturedMedia = video;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Video saved!')),
      );
    } on CameraException catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to stop recording.')),
      );
    }
  }

  void _submitReport() async {
    final reportService = Provider.of<ReportService>(context, listen: false);
    final authService = Provider.of<AuthService>(context, listen: false);
    final user = authService.currentUser;

    if (_formKey.currentState!.validate() && user != null) {
      if (_selectedLocation == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Please select a location for the report.'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }

      setState(() {
        _isSubmitting = true;
      });

      final newReport = CrimeReport(
        id: 'report_${DateTime.now().millisecondsSinceEpoch}',
        reporterId: _isAnonymous ? 'anonymous' : user.id,
        reporterName: _isAnonymous ? 'Anonymous' : user.name,
        isAnonymous: _isAnonymous,
        crimeType: _selectedCrimeType,
        description: _descriptionController.text.trim(),
        latitude: _selectedLocation!.latitude,
        longitude: _selectedLocation!.longitude,
        address: _addressController.text.trim(),
        timestamp: DateTime.now(),
        mediaUrl: _capturedMedia?.path,
        upvotes: _upvotes,
        downvotes: _downvotes,
        status: ReportStatus.pending,
        aiSeverityScore: 0,
        aiAnalysisExplanation: null,
      );

      await reportService.submitReport(newReport);

      setState(() {
        _isSubmitting = false;
        _descriptionController.clear();
        _addressController.clear();
        _selectedCrimeType = CrimeType.other;
        _isAnonymous = false;
        _selectedLocation = null;
        _capturedMedia = null;
        _upvotes = 0;
        _downvotes = 0;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Report submitted successfully!'),
          backgroundColor: Colors.green,
        ),
      );
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

  IconData _getCrimeTypeIcon(CrimeType type) {
    switch (type) {
      case CrimeType.vandalism:
        return Icons.format_paint;
      case CrimeType.theft:
        return Icons.shopping_bag;
      case CrimeType.assault:
        return Icons.gavel;
      case CrimeType.publicDisturbance:
        return Icons.group_off;
      case CrimeType.drugActivity:
        return Icons.local_pharmacy;
      case CrimeType.other:
        return Icons.help_outline;
    }
  }

  Widget _buildMediaPreview() {
    if (_capturedMedia == null) {
      return SizedBox.shrink();
    }
    final file = File(_capturedMedia!.path);
    final isVideo = _capturedMedia!.path.endsWith('.mp4');

    return Column(
      children: [
        SizedBox(height: 20),
        Text(
          'Media Preview',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 10),
        Stack(
          children: [
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8),
              ),
              child: isVideo
                  ? Center(child: Icon(Icons.videocam, size: 80, color: Colors.grey))
                  : Image.file(file, fit: BoxFit.cover),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: IconButton(
                icon: Icon(Icons.cancel, color: Colors.red),
                onPressed: () {
                  setState(() {
                    _capturedMedia = null;
                    _upvotes = 0;
                    _downvotes = 0;
                  });
                },
              ),
            ),
          ],
        ),
        SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
              icon: Icon(Icons.thumb_up, color: Colors.green),
              onPressed: () {
                setState(() {
                  _upvotes++;
                });
              },
            ),
            Text('$_upvotes'),
            SizedBox(width: 20),
            IconButton(
              icon: Icon(Icons.thumb_down, color: Colors.red),
              onPressed: () {
                setState(() {
                  _downvotes++;
                });
              },
            ),
            Text('$_downvotes'),
          ],
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Report Crime'),
        backgroundColor: Colors.red,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.blue),
                ),
                child: Row(
                  children: [
                    Icon(Icons.info, color: Colors.blue),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Your report will be analyzed by AI and sent to nearby law enforcement agencies.',
                        style: TextStyle(color: Colors.blue[800]),
                      ),
                    ),
                  ],
                ),
              ),

              SizedBox(height: 20),

              Text(
                'Type of Crime*',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<CrimeType>(
                    value: _selectedCrimeType,
                    isExpanded: true,
                    items: CrimeType.values.map((type) {
                      return DropdownMenuItem(
                        value: type,
                        child: Row(
                          children: [
                            Icon(_getCrimeTypeIcon(type), size: 20),
                            SizedBox(width: 8),
                            Text(_getCrimeTypeString(type)),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedCrimeType = value!;
                      });
                    },
                  ),
                ),
              ),

              SizedBox(height: 20),

              Text(
                'Description*',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              TextFormField(
                controller: _descriptionController,
                maxLines: 4,
                decoration: InputDecoration(
                  hintText: 'Describe what you witnessed in detail...',
                  border: OutlineInputBorder(),
                  alignLabelWithHint: true,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please provide a description';
                  }
                  if (value.trim().length < 10) {
                    return 'Description must be at least 10 characters';
                  }
                  return null;
                },
              ),

              SizedBox(height: 20),

              Text(
                'Location*',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              TextFormField(
                controller: _addressController,
                decoration: InputDecoration(
                  hintText: 'Enter the address or select on map',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.location_on),
                ),
                readOnly: true,
                validator: (value) {
                  if (_selectedLocation == null) {
                    return 'Please select a location.';
                  }
                  return null;
                },
              ),

              SizedBox(height: 8),

              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _isSubmitting ? null : _useCurrentLocation,
                      icon: _isSubmitting ? SizedBox(
                          height: 16,
                          width: 16,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)
                      ) : Icon(Icons.my_location, size: 16),
                      label: Text('Use Current Location'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                  SizedBox(width: 8),
                  Expanded(
                    child: TextButton.icon(
                      onPressed: _isSubmitting ? null : _selectOnMap,
                      icon: Icon(Icons.map, size: 16),
                      label: Text('Select on Map'),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 20),

              // New Media Attachment Section
              Text(
                'Attach Media*',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _takePicture,
                      icon: Icon(Icons.camera_alt),
                      label: Text('Photo'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey[200],
                        foregroundColor: Colors.black,
                      ),
                    ),
                  ),
                  SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _isRecording ? _stopVideoRecording : _startVideoRecording,
                      icon: Icon(_isRecording ? Icons.stop : Icons.videocam),
                      label: Text(_isRecording ? 'Stop' : 'Video'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _isRecording ? Colors.red : Colors.grey[200],
                        foregroundColor: _isRecording ? Colors.white : Colors.black,
                      ),
                    ),
                  ),
                ],
              ),

              _buildMediaPreview(),

              SizedBox(height: 20),

              Card(
                child: CheckboxListTile(
                  title: Text('Report Anonymously'),
                  subtitle: Text('Your identity will be protected'),
                  value: _isAnonymous,
                  onChanged: (value) {
                    setState(() {
                      _isAnonymous = value!;
                    });
                  },
                  secondary: Icon(Icons.visibility_off),
                ),
              ),

              SizedBox(height: 20),

              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red),
                ),
                child: Row(
                  children: [
                    Icon(Icons.warning, color: Colors.red),
                    SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Emergency?',
                            style: TextStyle(
                              color: Colors.red[800],
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'If this is an emergency, call 199 immediately!',
                            style: TextStyle(color: Colors.red[800]),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              SizedBox(height: 30),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _submitReport,
                  child: _isSubmitting
                      ? CircularProgressIndicator(color: Colors.white)
                      : Text(
                    'Submit Report',
                    style: TextStyle(fontSize: 18),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}