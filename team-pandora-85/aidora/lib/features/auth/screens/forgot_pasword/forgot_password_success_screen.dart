import 'package:aidora/features/auth/screens/login/login_screen.dart';
import 'package:aidora/utilities/components/custom_button_one.dart';
import 'package:aidora/utilities/constants/app_icons.dart';
import 'package:flutter/material.dart';

class ForgotPasswordSuccessScreen extends StatelessWidget {
  const ForgotPasswordSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        automaticallyImplyLeading: false,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10.0),
          child: Column(
            children: [
              SizedBox(
                height: 130,
                  width: 130,
                  child: Image.asset(AppIcons.securityShieldOne)),
              Text(
                "Perfect!",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500
                ),
              ),
              Text(
                "Your password have been successfully changed",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: Colors.grey
                ),
              ),
              Spacer(),
              CustomButtonOne(title: "Login", isLoading: false, onClick: (){
                Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (context) => LoginScreen()), (route) => false);
              })
            ],
          ),
        ),
      ),
    );
  }
}
