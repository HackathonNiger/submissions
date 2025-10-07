
import 'package:aidora/features/aidora_ai/screens/home/schedule/model/schedule_item_model.dart';

class ScheduleModel {
  final Map<DateTime, List<ScheduleItemModel>> schedules;

  ScheduleModel({required this.schedules});

  List<ScheduleItemModel> getEventsForDay(DateTime day) {
    final key = DateTime.utc(day.year, day.month, day.day);
    return schedules[key] ?? [];
  }
}
