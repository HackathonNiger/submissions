import 'package:flutter/material.dart';

import '../../../../utilities/components/custom_button_one.dart';
import '../../../../utilities/constants/app_icons.dart';
import '../login/login_screen.dart';

class RegisterSuccessScreen extends StatelessWidget {
  const RegisterSuccessScreen({super.key});

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
                  child: Image.asset(AppIcons.document3DLogo)),
              Text(
                "Registration Successful!",
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w500
                ),
              ),
              Text(
                "Your account have been successfully created, you can now enjoy the services Aidora has to offer",
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
