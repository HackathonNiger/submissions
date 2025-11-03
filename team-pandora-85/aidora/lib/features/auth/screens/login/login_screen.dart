import 'package:aidora/features/auth/screens/forgot_pasword/forgot_password_screen.dart';
import 'package:aidora/features/auth/screens/register/register_screen.dart';
import 'package:aidora/utilities/components/custom_button_two.dart';
import 'package:aidora/utilities/components/custom_text_field.dart';
import 'package:aidora/utilities/constants/app_colors.dart';
import 'package:aidora/utilities/constants/app_icons.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';

import '../../../../utilities/error_handler/show_snack_bar.dart';
import '../../services/auth_services.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool showPassword = true;
  bool isLoading = false;
  final AuthServices _authServices = AuthServices();

  Future<void> _userLogin({required BuildContext context, required String email, required String password}) async {
    try {
      setState(() {
        isLoading = true;
      });
      await _authServices.userLogin(context: context, email: email, password: password);
      setState(() {
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      showSnackBar(
        context: context,
        message: "$e",
        title: "Something Went Wrong",
      );
    }
  }

  void _togglePasswordVisibility() {
    setState(() {
      showPassword = !showPassword;
    });
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
            automaticallyImplyLeading: false,
          ),
          body: Center(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(
                      height: 70,
                      width: 70,
                      child: Image.asset(AppIcons.appIcon),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      "Welcome Back!",
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
                    ),
                    Text(
                      "To regain access to your account, please enter your login credentials to sign in again.",
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w400),
                    ),
                    const SizedBox(height: 20),
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
                    const SizedBox(height: 5),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Password",
                          style: TextStyle(fontSize: 13, color: Colors.grey),
                        ),
                        CustomTextField(
                          hintText: "********",
                          prefixIcon: Icon(IconlyLight.lock, color: Colors.grey),
                          controller: _passwordController,
                          isObscure: showPassword,
                          suffixIcon: IconButton(
                            onPressed: _togglePasswordVisibility,
                            icon: Icon(
                              showPassword ? IconlyLight.hide : IconlyLight.show,
                              color: Colors.grey,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 5),
                    GestureDetector(
                      onTap: (){
                        Navigator.of(context).push(MaterialPageRoute(builder: (context) => const ForgotPasswordScreen()));
                      },
                      child: Align(
                        alignment: Alignment.centerRight,
                        child: Text(
                          "Forgot Password?",
                          style: TextStyle(fontSize: 13, color: Colors.grey),
                        ),
                      ),
                    ),
                    const SizedBox(height: 15),
                    CustomButtonTwo(
                      title: isLoading ? "Signing in..." : "Login",
                      isLoading: isLoading,
                      onClick: () {
                        if (_emailController.text.trim().isNotEmpty && _passwordController.text.trim().isNotEmpty) {
                          _userLogin(context: context, email: _emailController.text.trim(), password: _passwordController.text.trim());
                        } else {
                          showSnackBar(context: context, message: "Please be sure to provide your email and password", title: "Email and Password Required");
                        }
                      },
                    ),
                    const SizedBox(height: 25),
                    GestureDetector(
                      onTap: (){
                        Navigator.of(context).push(MaterialPageRoute(builder: (context) => const RegisterScreen()));
                      },
                      child: RichText(
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: "Don't have an account? ",
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w400,
                                color: Colors.grey,
                              ),
                            ),
                            TextSpan(
                              text: "Create account",
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w400,
                                color: Color(AppColors.primaryColor),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
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