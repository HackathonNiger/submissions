import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants/app_colors.dart';
import '../themes/theme_provider.dart';

class StrongPasswordCheck extends StatelessWidget {
  final String title;
  final bool isValid;
  const StrongPasswordCheck({super.key, required this.title, required this.isValid});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    return Row(
      children: [
        Container(
          height: 18,
          width: 18,
          decoration: BoxDecoration(
            color: isValid ? Color(AppColors.primaryColor) : Colors.grey.withOpacity(0.3),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Icon(
              isValid ? Icons.check : Icons.close,
              size: 9,
              color: isValid ? Colors.white : Colors.black.withOpacity(0.2),
            ),
          ),
        ),
        const SizedBox(
          width: 6,
        ),
        Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.w400,
            color: isValid && themeProvider.isDarkMode ? Color(AppColors.primaryColor) : isValid && !themeProvider.isDarkMode ? Colors.black : Colors.grey[300],
          ),
        )
      ],
    );
  }
}
