import 'package:aidora/utilities/constants/app_colors.dart';
import 'package:flutter/material.dart';

class CustomButtonTwo extends StatelessWidget {
  final String title;
  final Color? color;
  final Color? titleColor;
  final Color? progressColor;
  final bool isLoading;
  final VoidCallback onClick;
  const CustomButtonTwo({super.key, required this.title, this.color, required this.isLoading, required this.onClick, this.titleColor, this.progressColor});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 40,
      width: MediaQuery.of(context).size.width,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: Color(AppColors.primaryColor),
        borderRadius: BorderRadius.circular(8)
      ),
      child: MaterialButton(
        onPressed: onClick,
        padding: EdgeInsets.zero,
        child: Row(
          children: [
            Spacer(),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                color: titleColor ?? Colors.white
              ),
            ),
            Spacer(),
            isLoading ? Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10.0),
              child: SizedBox(
                height: 15,
                width: 15,
                child: CircularProgressIndicator(
                  color: progressColor ?? Colors.white,
                  strokeCap: StrokeCap.round,
                  strokeWidth: 2,
                ),
              ),
            ) : const SizedBox.shrink()
          ],
        ),
      ),
    );
  }
}
