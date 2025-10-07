import 'package:aidora/features/auth/screens/register/register_success_screen.dart';
import 'package:aidora/features/auth/services/auth_services.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';

import '../../../../utilities/components/custom_button_two.dart';
import '../../../../utilities/components/custom_text_field.dart';
import '../../../../utilities/components/strong_password_check.dart';
import '../../../../utilities/constants/app_colors.dart';
import '../../../../utilities/error_handler/show_snack_bar.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _otherNamesController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _conPasswordController = TextEditingController();

  final AuthServices _authServices = AuthServices();

  bool isEyeClicked = false;
  bool isLoading = false;

  Future<void> _registerUserAccount({
    required BuildContext context,
    required String firstName,
    required String lastName,
    required String otherNames,
    required String email,
    required String password,
  }) async {
    try {
      setState(() {
        isLoading = true;
      });
      int statusCode = await _authServices.registerUser(
        context: context,
        firstName: firstName,
        lastName: lastName,
        otherNames: otherNames,
        email: email,
        password: password,
      );
      if (statusCode == 200 || statusCode == 201) {
        setState(() {
          isLoading = false;
        });
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(
            builder: (context) => const RegisterSuccessScreen(),
          ),
          (route) => false,
        );
      } else {
        setState(() {
          isLoading = false;
        });
      }
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

  bool isPasswordValid() {
    bool hasMinLength = _passwordController.text.length >= 6;
    bool hasDigits = RegExp(r'\d').hasMatch(_passwordController.text);
    bool hasUpperCase = RegExp(r'[A-Z]').hasMatch(_passwordController.text);
    bool hasLowerCase = RegExp(r'[a-z]').hasMatch(_passwordController.text);
    bool hasSymbols = RegExp(
      r'[!@#$%^&*(),.?":{}|<>]',
    ).hasMatch(_passwordController.text);

    return hasMinLength &&
        hasDigits &&
        hasUpperCase &&
        hasLowerCase &&
        hasSymbols;
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
          ),
          body: SingleChildScrollView(
            physics: BouncingScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10.0),
              child: Column(
                children: [
                  RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: "Welcome To ",
                          style: TextStyle(
                            fontSize: 25,
                            fontWeight: FontWeight.w400,
                            color: Colors.black,
                          ),
                        ),
                        TextSpan(
                          text: "Aidora",
                          style: TextStyle(
                            fontSize: 25,
                            fontWeight: FontWeight.w400,
                            color: Color(AppColors.primaryColor),
                          ),
                        ),
                        TextSpan(
                          text: ", New Here?",
                          style: TextStyle(
                            fontSize: 25,
                            fontWeight: FontWeight.w400,
                            color: Colors.black,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    "You being here means you don't have an account with us yet, please fill out the form before to setup your account within minutes",
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "First Name",
                              style: TextStyle(fontSize: 13, color: Colors.grey),
                            ),
                            CustomTextField(
                              hintText: "John",
                              prefixIcon: Icon(
                                IconlyLight.profile,
                                color: Colors.grey,
                              ),
                              controller: _firstNameController,
                              isObscure: false,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Last Name",
                              style: TextStyle(fontSize: 13, color: Colors.grey),
                            ),
                            CustomTextField(
                              hintText: "Doe",
                              prefixIcon: Icon(
                                IconlyLight.profile,
                                color: Colors.grey,
                              ),
                              controller: _lastNameController,
                              isObscure: false,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Other Names (optional)",
                        style: TextStyle(fontSize: 13, color: Colors.grey),
                      ),
                      CustomTextField(
                        hintText: "clara",
                        prefixIcon: Icon(IconlyLight.profile, color: Colors.grey),
                        controller: _otherNamesController,
                        isObscure: false,
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
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
                  const SizedBox(height: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Password",
                        style: TextStyle(fontSize: 13, color: Colors.grey),
                      ),
                      CustomTextField(
                        isObscure: isEyeClicked ? false : true,
                        controller: _passwordController,
                        onChange: (value) {
                          setState(() {});
                        },
                        hintText: "e.g *******",
                        prefixIcon: Icon(IconlyLight.lock, color: Colors.grey),
                        suffixIcon: IconButton(
                          onPressed: () {
                            setState(() {
                              isEyeClicked = !isEyeClicked;
                            });
                          },
                          icon: Icon(
                            isEyeClicked ? IconlyLight.hide : IconlyLight.show,
                            color: Colors.grey,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  StrongPasswordCheck(
                    title: "6 characters and above",
                    isValid: _passwordController.text.length >= 6,
                  ),
                  const SizedBox(height: 5),
                  StrongPasswordCheck(
                    title: "use of number",
                    isValid: RegExp(r'\d').hasMatch(_passwordController.text),
                  ),
                  const SizedBox(height: 5),
                  StrongPasswordCheck(
                    title: "use of capital letter",
                    isValid: RegExp(r'[A-Z]').hasMatch(_passwordController.text),
                  ),
                  const SizedBox(height: 5),
                  StrongPasswordCheck(
                    title: "use of small letter",
                    isValid: RegExp(r'[a-z]').hasMatch(_passwordController.text),
                  ),
                  const SizedBox(height: 5),
                  StrongPasswordCheck(
                    title: "use of symbol",
                    isValid: RegExp(
                      r'[!@#$%^&*(),.?":{}|<>]',
                    ).hasMatch(_passwordController.text),
                  ),
                  const SizedBox(height: 15),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Confirm Password",
                        style: TextStyle(fontSize: 13, color: Colors.grey),
                      ),
                      CustomTextField(
                        isObscure: isEyeClicked ? false : true,
                        controller: _conPasswordController,
                        onChange: (value) {
                          setState(() {});
                        },
                        hintText: "e.g ********",
                        prefixIcon: Icon(IconlyLight.lock, color: Colors.grey),
                        suffixIcon: IconButton(
                          onPressed: () {
                            setState(() {
                              isEyeClicked = !isEyeClicked;
                            });
                          },
                          icon: Icon(
                            isEyeClicked ? IconlyLight.hide : IconlyLight.show,
                            color: Colors.grey,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Text(
                    "password must be unique from those previously used.",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  const SizedBox(height: 20),
                  CustomButtonTwo(
                    title: isLoading ? "Registering..." : "Register",
                    onClick: () {
                      if (_firstNameController.text.trim().isNotEmpty &&
                          _lastNameController.text.trim().isNotEmpty &&
                          _emailController.text.trim().isNotEmpty &&
                          _passwordController.text.trim().isNotEmpty &&
                          _conPasswordController.text.trim().isNotEmpty &&
                          _passwordController.text.trim().isNotEmpty ==
                              _conPasswordController.text.trim().isNotEmpty &&
                          isPasswordValid()) {
                        _registerUserAccount(
                          context: context,
                          firstName: _firstNameController.text.trim(),
                          lastName: _lastNameController.text.trim(),
                          otherNames: _otherNamesController.text.trim(),
                          email: _emailController.text.trim(),
                          password: _passwordController.text.trim(),
                        );
                      } else {
                        showSnackBar(
                          context: context,
                          message: "Please make sure to provide all required fields",
                          title: "Missing Required Fields",
                        );
                      }
                    },
                    isLoading: isLoading,
                  ),
                ],
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
