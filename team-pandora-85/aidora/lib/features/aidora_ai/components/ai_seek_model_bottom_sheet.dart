import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';

import '../../../utilities/constants/app_colors.dart';

class AiSeekModelBottomSheet extends StatelessWidget {
  final String selectedOption;
  final ValueChanged<String> onOptionSelected;
  const AiSeekModelBottomSheet({super.key, required this.selectedOption, required this.onOptionSelected});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 20),
        child: Container(
          height: 181,
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
                  "Preferred AI Model",
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w400
                  ),
                ),
                Text(
                  "Please select one among the AI model provided for you.",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey
                  ),
                ),
                const SizedBox(height: 5,),
                AISeekBottomSheetOptionCard(
                  title: "deepseek-r1-distill-llama-70b",
                  onTap: () => onOptionSelected("deepseek-r1-distill-llama-70b"),
                  icon: Icons.pedal_bike,
                  isSelected: selectedOption == "deepseek-r1-distill-llama-70b",
                ),
                AISeekBottomSheetOptionCard(
                  title: "qwen-qwq-32b",
                  onTap: () => onOptionSelected("qwen-qwq-32b"),
                  icon: Icons.directions_car_filled,
                  isSelected: selectedOption == "qwen-qwq-32b",
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class AISeekBottomSheetOptionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final bool isSelected;
  final VoidCallback onTap;

  const AISeekBottomSheetOptionCard({
    super.key,
    required this.title,
    required this.onTap,
    required this.icon,
    required this.isSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3.0),
      child: Container(
        height: 40,
        width: MediaQuery.of(context).size.width,
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
            color: isSelected ? Color(AppColors.primaryColor).withOpacity(0.1) : Colors.transparent,
            borderRadius: BorderRadius.circular(10)
        ),
        child: MaterialButton(
          onPressed: onTap,
          child: Row(
            children: [
              // Icon(icon, color: isSelected ? Color(AppColors.primaryColor) : Colors.grey),
              // const SizedBox(width: 5),
              Text(
                title,
                style: TextStyle(
                    color: isSelected ? Color(AppColors.primaryColor) : Colors.grey,
                    fontWeight: FontWeight.w400
                ),
              ),
              const Spacer(),
              Container(
                height: 20,
                width: 20,
                decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.transparent,
                    border: Border.all(
                        width: 1,
                        color: isSelected ? Color(AppColors.primaryColor) : Colors.grey.withOpacity(0.5)
                    )
                ),
                child: Center(
                  child: Container(
                    height: 13,
                    width: 13,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isSelected ? Color(AppColors.primaryColor) : Colors.transparent,
                    ),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
