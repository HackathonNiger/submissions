// screens/citizen/offline_report_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../models/crime_report.dart'; // CrimeType is imported from here
import '../../services/bluetooth_service.dart';

// =======================================================================
// FIX: Extension to provide human-readable strings for the imported CrimeType
// =======================================================================
extension CrimeTypeExtension on CrimeType {
  String get displayName {
    // 1. Get the raw enum name (e.g., "DRUGABUSE")
    String name = toString().split('.').last;

    // 2. Insert a space before capital letters (e.g., "DRUG ABUSE")
    name = name.replaceAllMapped(
      RegExp(r'([A-Z])'),
          (match) => ' ${match.group(0)}',
    ).trim();

    // 3. Convert to Title Case (e.g., "Drug Abuse")
    if (name.isEmpty) return '';
    return name[0] + name.substring(1).toLowerCase();
  }
}
// =======================================================================

class OfflineReportScreen extends StatefulWidget {
  @override
  _OfflineReportScreenState createState() => _OfflineReportScreenState();
}

class _OfflineReportScreenState extends State<OfflineReportScreen> {
  final _formKey = GlobalKey<FormState>();

  // Assuming the first value of the enum is the default
  // To avoid errors, you might need to check if CrimeType.values is not empty.
  CrimeType _selectedCrimeType = CrimeType.values.first;

  final _locationController = TextEditingController();
  // FIX: Controller for the new detailed description field
  final _descriptionController = TextEditingController();

  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();
  bool _isSending = false;

  @override
  void dispose() {
    _locationController.dispose();
    _descriptionController.dispose(); // FIX: Dispose the new controller
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now().subtract(Duration(days: 30)),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
    );
    if (picked != null && picked != _selectedTime) {
      setState(() {
        _selectedTime = picked;
      });
    }
  }

  void _submitOfflineReport() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSending = true;
      });

      // Combine date and time
      final occurrenceDateTime = DateTime(
        _selectedDate.year,
        _selectedDate.month,
        _selectedDate.day,
        _selectedTime.hour,
        _selectedTime.minute,
      );

      final reportData = {
        'type': _selectedCrimeType.index.toString(),
        'loc': _locationController.text.trim(),
        'desc': _descriptionController.text.trim(), // FIX: Include description
        'time': occurrenceDateTime.millisecondsSinceEpoch.toString(),
      };

      // Assuming BleService is available via Provider
      final bluetoothService = Provider.of<BleService>(context, listen: false);

      // Start the Bluetooth relay process
      await bluetoothService.sendOfflineReport(reportData);

      setState(() {
        _isSending = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Offline report broadcasted via Bluetooth!'),
          backgroundColor: Colors.green,
        ),
      );

      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Report Crime Offline'),
        backgroundColor: Colors.red,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Emergency reports will be sent via Bluetooth to nearby users to reach the internet.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 20),

              // Crime Type Selection (FIX: Use displayName extension for spaces)
              DropdownButtonFormField<CrimeType>(
                decoration: InputDecoration(
                  labelText: 'Type of Crime*',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.category),
                ),
                value: _selectedCrimeType,
                items: CrimeType.values.map((type) {
                  return DropdownMenuItem(
                    value: type,
                    child: Text(type.displayName), // FIX: Use the extension
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedCrimeType = value!;
                  });
                },
                validator: (value) => value == null ? 'Please select a crime type' : null,
              ),
              SizedBox(height: 16),

              // Location Field
              TextFormField(
                controller: _locationController,
                decoration: InputDecoration(
                  labelText: 'Location/Landmark*',
                  hintText: 'E.g., Park Entrance, 2nd Floor Apt. B',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.location_on),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a location.';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),

              // FIX: New Detailed Description Field with Multi-line Support
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Detailed Description',
                  hintText: 'Provide details about the incident (e.g., suspects, items lost).',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.description),
                  alignLabelWithHint: true, // Aligns label to the top for multiline
                ),
                keyboardType: TextInputType.multiline,
                maxLines: 5, // Allows up to 5 lines of text to be visible
                maxLength: 250, // A comfortable limit similar to an SMS/text (160 is typical for 1 SMS)
              ),
              SizedBox(height: 16),

              // Date Selector
              ListTile(
                title: Text('Date of Occurrence'),
                subtitle: Text(DateFormat.yMMMd().format(_selectedDate)),
                trailing: Icon(Icons.calendar_today),
                onTap: () => _selectDate(context),
              ),
              Divider(),

              // Time Selector
              ListTile(
                title: Text('Time of Occurrence'),
                subtitle: Text(_selectedTime.format(context)),
                trailing: Icon(Icons.access_time),
                onTap: () => _selectTime(context),
              ),
              Divider(),

              SizedBox(height: 30),

              ElevatedButton.icon(
                onPressed: _isSending ? null : _submitOfflineReport,
                icon: _isSending
                    ? CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                    : Icon(Icons.bluetooth_searching),
                label: Text(
                  _isSending ? 'Broadcasting...' : 'Broadcast Offline Report',
                  style: TextStyle(fontSize: 18),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}