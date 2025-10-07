import 'package:flutter/material.dart';

import '../constants/app_colors.dart';

class CustomButtonOne extends StatelessWidget {
  final String title;
  final bool isLoading;
  final Color? color;
  final VoidCallback onClick;
  const CustomButtonOne({super.key, required this.title, required this.isLoading, required this.onClick, this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 40,
      width: MediaQuery.of(context).size.width,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: color ?? Color(AppColors.primaryColor),
      ),
      child: MaterialButton(onPressed: onClick, child: Center(
        child: isLoading ? SizedBox(
          height: 20,
            width: 20,
            child: CircularProgressIndicator(
              color: Colors.white,
              strokeCap: StrokeCap.round,
            )) : Text(
          title,
          style: TextStyle(
            fontSize: 12,
            color: Colors.white,
            fontWeight: FontWeight.w500
          ),
        ),
      ),),
    );
  }
}
