import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

import '../components/schedule_card_style.dart';
import '../model/schedule_item_model.dart';
import '../model/schedule_model.dart';


class ScheduleSection extends StatefulWidget {
  const ScheduleSection({super.key});

  @override
  State<ScheduleSection> createState() => _ScheduleSectionState();
}

class _ScheduleSectionState extends State<ScheduleSection> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  // Example medication/health schedule data
// Create an instance of ScheduleModel with your data
  final ScheduleModel scheduleModel = ScheduleModel(
    schedules: {
      DateTime.utc(2025, 9, 27): [
        ScheduleItemModel(
          time: '08:00 AM',
          title: 'Blood Pressure Check',
          description: 'Check and record your blood pressure',
        ),
        ScheduleItemModel(
          time: '09:00 AM',
          title: 'Medication: Amlodipine',
          description: 'Take 1 tablet of 5mg after breakfast',
        ),
      ],
      DateTime.utc(2025, 9, 28): [
        ScheduleItemModel(
          time: '07:30 AM',
          title: 'Morning Jog',
          description: '30 mins jog around the park',
        ),
        ScheduleItemModel(
          time: '08:30 AM',
          title: 'Vitamin D Supplement',
          description: 'Take 1 capsule',
        ),
      ],
    },
  );

// Getting events for a day:
  late final events = scheduleModel.getEventsForDay(DateTime.now());

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
  }

  @override
  Widget build(BuildContext context) {
    // final events = _getEventsForDay(_selectedDay ?? _focusedDay);

    return SingleChildScrollView(
      child: Column(
        children: [
          TableCalendar(
            firstDay: DateTime.utc(2020, 1, 1),
            lastDay: DateTime.utc(275760, 9, 13),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(day, _selectedDay),
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
            },
            calendarStyle: const CalendarStyle(
              todayDecoration: BoxDecoration(
                color: Colors.green,
                shape: BoxShape.circle,
              ),
              selectedDecoration: BoxDecoration(
                color: Colors.blueAccent,
                shape: BoxShape.circle,
              ),
            ),
            headerStyle: const HeaderStyle(
              formatButtonVisible: false,
              titleCentered: true,
            ),
          ),
          SizedBox(height: events.isEmpty ? 0 : 10),
          events.isEmpty
              ? const SizedBox.shrink()
              : Column(
            crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Today's Activities",
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w500
                          ),
                        ),
                        Text(
                          "Here ${events.length > 1 ? "are" : "is"} your pending ${events.length > 1 ? "activities" : "activity"} for today",
                          style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 5,),
                  SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      physics: BouncingScrollPhysics(),
                      child: Row(
                        children: [
                          for (int i = 0; i < events.length; i++)
                            Padding(
                              padding: EdgeInsets.only(
                                left: events.length == 0 ? 10 : 3.0,
                                right: events.length == events.length - 1 ? 10 : 3,
                              ),
                              child: ScheduleCardStyle(
                                event: events[i],
                                position: i,
                              ),
                            ),
                        ],
                      ),
                    ),
                ],
              ),
        ],
      ),
    );
  }
}
