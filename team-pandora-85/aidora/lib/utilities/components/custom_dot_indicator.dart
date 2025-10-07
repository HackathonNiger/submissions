import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class CustomDotIndicator extends StatelessWidget {
  final bool isCurrent;
  final double? height;
  final double? width;
  final double? shape;

  const CustomDotIndicator({
    super.key,
    required this.isCurrent,
    this.height,
    this.width,
    this.shape,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 2.0),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        height: height ?? 6,
        width: width ?? (isCurrent ? 30 : 10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(shape ?? 360),
          color: isCurrent
              ? Color(AppColors.primaryColor) : Colors.grey[200],
        ),
      ),
    );
  }
}