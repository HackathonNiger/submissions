import 'package:flutter/material.dart';

import 'ai_seek_model_bottom_sheet.dart';

class ReasoningFormatBottomSheet extends StatelessWidget {
  final String selectedOption;
  final ValueChanged<String> onOptionSelected;
  const ReasoningFormatBottomSheet({super.key, required this.selectedOption, required this.onOptionSelected});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 20),
        child: Container(
          height: 227,
          width: MediaQuery.of(context).size.width,
          decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20)
          ),
          child: Padding(
            padding: const EdgeInsets.all(10.0),
            child: Column(
              children: [
                Text(
                  "Preferred Reasoning Format",
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w400
                  ),
                ),
                Text(
                  "Select how you want Aidora to reasoning while on your seek task",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey
                  ),
                ),
                const SizedBox(height: 5,),
                AISeekBottomSheetOptionCard(
                  title: "parsed",
                  onTap: () => onOptionSelected("parsed"),
                  icon: Icons.pedal_bike,
                  isSelected: selectedOption == "parsed",
                ),
                AISeekBottomSheetOptionCard(
                  title: "raw",
                  onTap: () => onOptionSelected("raw"),
                  icon: Icons.directions_car_filled,
                  isSelected: selectedOption == "raw",
                ),
                AISeekBottomSheetOptionCard(
                  title: "hidden",
                  onTap: () => onOptionSelected("hidden"),
                  icon: Icons.directions_car_filled,
                  isSelected: selectedOption == "hidden",
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
