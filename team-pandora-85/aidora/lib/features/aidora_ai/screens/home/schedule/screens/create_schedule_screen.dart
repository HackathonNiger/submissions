import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../services/schedule_services.dart';

class CreateScheduleScreen extends StatefulWidget {
  const CreateScheduleScreen({super.key});

  @override
  State<CreateScheduleScreen> createState() => _CreateScheduleScreenState();
}

class _CreateScheduleScreenState extends State<CreateScheduleScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  final _dosageController = TextEditingController();
  final _medicationNameController = TextEditingController();
  bool _isMedication = false;
  bool _isRecurring = false;
  String? _administrationRoute;
  DateTime? _dueTime;
  DateTime? _recurrenceEndDate;
  int _recurrenceDays = 1;

  final ScheduleServices _scheduleServices = ScheduleServices();

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    _dosageController.dispose();
    _medicationNameController.dispose();
    super.dispose();
  }

  Future<void> _selectDateTime(BuildContext context, bool isDueTime) async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime(2100),
    );
    if (pickedDate != null) {
      final TimeOfDay? pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.now(),
      );
      if (pickedTime != null) {
        setState(() {
          final selectedDateTime = DateTime(
            pickedDate.year,
            pickedDate.month,
            pickedDate.day,
            pickedTime.hour,
            pickedTime.minute,
          );
          if (isDueTime) {
            _dueTime = selectedDateTime;
          } else {
            _recurrenceEndDate = selectedDateTime;
          }
        });
      }
    }
  }

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      final taskData = {
        'title': _titleController.text,
        'content': [
          {
            'content': _contentController.text,
            'isMedication': _isMedication,
            if (_isMedication) ...{
              'dosage': _dosageController.text,
              'medicationName': _medicationNameController.text,
              'administrationRoute': _administrationRoute,
            }
          }
        ],
        'dueTime': _dueTime?.toIso8601String(),
        'isRecurring': _isRecurring,
        if (_isRecurring) ...{
          'recurrenceDays': _recurrenceDays,
          'recurrenceEndDate': _recurrenceEndDate?.toIso8601String(),
        }
      };

      final statusCode = await _scheduleServices.createNewSchedule(
        context: context,
        data: taskData,
      );

      if (statusCode == 201) {
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create New Task'),
        backgroundColor: Colors.blue,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Task Title',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a title';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _contentController,
                decoration: const InputDecoration(
                  labelText: 'Task Content',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter task content';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              SwitchListTile(
                title: const Text('Is this a medication task?'),
                value: _isMedication,
                onChanged: (value) {
                  setState(() {
                    _isMedication = value;
                  });
                },
              ),
              if (_isMedication) ...[
                const SizedBox(height: 16),
                TextFormField(
                  controller: _medicationNameController,
                  decoration: const InputDecoration(
                    labelText: 'Medication Name',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (_isMedication && (value == null || value.isEmpty)) {
                      return 'Please enter medication name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _dosageController,
                  decoration: const InputDecoration(
                    labelText: 'Dosage',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (_isMedication && (value == null || value.isEmpty)) {
                      return 'Please enter dosage';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(
                    labelText: 'Administration Route',
                    border: OutlineInputBorder(),
                  ),
                  value: _administrationRoute,
                  items: ['oral', 'injection', 'topical', 'inhalation', 'other']
                      .map((route) => DropdownMenuItem(
                    value: route,
                    child: Text(route.capitalize()),
                  ))
                      .toList(),
                  onChanged: (value) {
                    setState(() {
                      _administrationRoute = value;
                    });
                  },
                  validator: (value) {
                    if (_isMedication && value == null) {
                      return 'Please select administration route';
                    }
                    return null;
                  },
                ),
              ],
              const SizedBox(height: 16),
              ListTile(
                title: Text(
                  _dueTime == null
                      ? 'Select Due Time'
                      : 'Due: ${DateFormat('yyyy-MM-dd HH:mm').format(_dueTime!)}',
                ),
                trailing: const Icon(Icons.calendar_today),
                onTap: () => _selectDateTime(context, true),
              ),
              const SizedBox(height: 16),
              SwitchListTile(
                title: const Text('Is this a recurring task?'),
                value: _isRecurring,
                onChanged: (value) {
                  setState(() {
                    _isRecurring = value;
                  });
                },
              ),
              if (_isRecurring) ...[
                const SizedBox(height: 16),
                TextFormField(
                  initialValue: _recurrenceDays.toString(),
                  decoration: const InputDecoration(
                    labelText: 'Recurrence Days',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                  onChanged: (value) {
                    setState(() {
                      _recurrenceDays = int.tryParse(value) ?? 1;
                    });
                  },
                  validator: (value) {
                    if (_isRecurring && (value == null || int.tryParse(value) == null || int.parse(value) < 1)) {
                      return 'Please enter valid recurrence days';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                ListTile(
                  title: Text(
                    _recurrenceEndDate == null
                        ? 'Select Recurrence End Date'
                        : 'Ends: ${DateFormat('yyyy-MM-dd').format(_recurrenceEndDate!)}',
                  ),
                  trailing: const Icon(Icons.calendar_today),
                  onTap: () => _selectDateTime(context, false),
                ),
              ],
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _submitForm,
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                ),
                child: const Text('Create Task'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Extension to capitalize strings
extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${substring(1)}";
  }
}