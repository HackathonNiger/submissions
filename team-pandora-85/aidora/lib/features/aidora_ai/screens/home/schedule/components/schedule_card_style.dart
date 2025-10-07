import 'package:aidora/utilities/constants/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';

import '../model/schedule_item_model.dart';

class ScheduleCardStyle extends StatelessWidget {
  final ScheduleItemModel event;
  final int position;
  const ScheduleCardStyle({super.key, required this.event, required this.position});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width / 1.6,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(
          width: 1,
          color: Colors.grey.withOpacity(0.3),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.05),
            offset: const Offset(2, 2),
            spreadRadius: 2,
            blurRadius: 15,
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 11.0, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        event.title,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        event.description,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () {},
                  icon: Icon(
                    Icons.alarm,
                    color: Colors.grey[600],
                    size: 19,
                  ),
                ),
              ],
            ),

            // Divider
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Container(
                height: 1,
                width: double.infinity,
                color: Colors.grey.withOpacity(0.2),
              ),
            ),

            // Date & Time chips
            Row(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: Color(AppColors.primaryColor),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 5),
                    child: Center(
                      child: Text(
                        'Done',
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.white,
                          fontWeight: FontWeight.w500
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 5),
                    child: Row(
                      children: [
                        Icon(
                          IconlyLight.time_circle,
                          color: Colors.grey[700],
                          size: 15,
                        ),
                        const SizedBox(width: 3),
                        Text(
                          event.time,
                          style: const TextStyle(
                            fontSize: 11,
                            color: Colors.grey,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
