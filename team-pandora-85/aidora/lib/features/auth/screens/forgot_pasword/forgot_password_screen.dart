import 'package:aidora/features/auth/screens/forgot_pasword/forgot_password_otp_screen.dart';
import 'package:aidora/features/auth/services/auth_services.dart';
import 'package:aidora/utilities/components/custom_text_field.dart';
import 'package:aidora/utilities/error_handler/show_snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';

import '../../../../utilities/components/custom_button_two.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final TextEditingController _emailController = TextEditingController();
  bool isLoading = false;
  final AuthServices _authServices = AuthServices();

  Future<void> _sendForgotPasswordOTP({required BuildContext context, required String email}) async {
    try {
      setState(() {
        isLoading = true;
      });
      final statusCode = await _authServices.sendForgotPasswordOTP(context: context, email: email);
      if (statusCode == 200 || statusCode == 201) {
        setState(() {
          isLoading = false;
        });
        Navigator.of(context).push(MaterialPageRoute(builder: (context) => ForgotPasswordOTPScreen(email: email,)));
      } else {
        setState(() {
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        isLoading = true;
      });
      print(e);
    }
  }
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          backgroundColor: Colors.white,
          appBar: AppBar(
            backgroundColor: Colors.white,
            surfaceTintColor: Colors.white,
            centerTitle: true,
            title: Text(
              "Forgot Password",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500
              ),
            ),
          ),
          body: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            child: Column(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Email",
                      style: TextStyle(fontSize: 13, color: Colors.grey),
                    ),
                    CustomTextField(
                      hintText: "example@gmail.com",
                      prefixIcon: Icon(IconlyLight.message, color: Colors.grey),
                      controller: _emailController,
                      isObscure: false,
                    ),
                  ],
                ),
                Text("Please provide us the email linked to your account, so as to receive the OTP to reset your password with.", style: TextStyle(
                  fontSize: 11,
                  color: Colors.grey,
                  fontWeight: FontWeight.w400
                ),),
                Spacer(),
                Padding(
                  padding: const EdgeInsets.only(bottom: 10.0),
                  child: CustomButtonTwo(
                    title: isLoading ? "Sending OTP..." : "Get OTP",
                    isLoading: isLoading,
                    onClick: () {
                      if (_emailController.text.trim().isNotEmpty) {
                        _sendForgotPasswordOTP(context: context, email: _emailController.text.trim());
                      } else {
                        showSnackBar(context: context, message: "Please be sure to provide your email, before trying to proceed", title: "Email Required");
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
        if (isLoading)
          Container(
            height: MediaQuery.of(context).size.height,
            width: MediaQuery.of(context).size.width,
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.0)),
          ),
      ],
    );
  }
}
