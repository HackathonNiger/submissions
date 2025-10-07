import 'package:flutter/material.dart';

class CustomFab extends StatelessWidget {
  final IconData iconData;
  final Color color;
  final VoidCallback onClick;
  const CustomFab({super.key, required this.iconData, required this.color, required this.onClick});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onClick,
      child: Container(
        height: 45,
        width: 45,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: color,
        ),
        child: Center(
          child: Icon(iconData, color: Colors.white, size: 20,),
        ),
      ),
    );
  }
}
