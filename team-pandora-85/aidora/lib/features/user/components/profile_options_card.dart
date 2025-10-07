import 'package:flutter/material.dart';

class ProfileOptionsCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onClick;
  const ProfileOptionsCard({super.key, required this.icon, required this.title, required this.onClick});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 45,
      width: MediaQuery.of(context).size.width,
      decoration: BoxDecoration(),
      child: MaterialButton(
        onPressed: (){},
        child: Row(
          children: [
            Icon(icon, size: 20,),
            const SizedBox(width: 5,),
            Text(
              title,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w400
              ),
            ),
            Spacer(),
            Icon(Icons.arrow_forward_rounded, color: Colors.grey, size: 20, )
          ],
        ),
      ),
    );
  }
}
