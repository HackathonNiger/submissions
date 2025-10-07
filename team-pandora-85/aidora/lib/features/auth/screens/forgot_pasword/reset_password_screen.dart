import 'package:aidora/features/auth/screens/forgot_pasword/forgot_password_success_screen.dart';
import 'package:aidora/utilities/components/custom_button_two.dart';
import 'package:flutter/material.dart';
import 'package:iconly/iconly.dart';
import 'package:provider/provider.dart';
import '../../../../../utilities/components/custom_text_field.dart';
import '../../../../../utilities/components/strong_password_check.dart';
import '../../../../../utilities/constants/app_colors.dart';
import '../../../../../utilities/themes/theme_provider.dart';
import '../../../../utilities/error_handler/show_snack_bar.dart';
import '../../services/auth_services.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String otp;
  final String email;

  const ResetPasswordScreen({
    super.key,
    required this.otp,
    required this.email,
  });

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final setNewPasswordController = TextEditingController();
  final confirmSetNewPasswordController = TextEditingController();
  bool isEyeClicked = false;
  bool isLoading = false;
  final AuthServices _authServices = AuthServices();

  Future<void> _verifyAndResetPassword(
    BuildContext context,
    String email,
    String otp,
    String newPassword,
  ) async {
    try {
      setState(() {
        isLoading = true;
      });
      int statusCode = await _authServices.resetPasswordWithOTP(
        context: context,
        email: email,
        otp: otp,
        newPassword: newPassword,
      );
      if (statusCode == 200 || statusCode == 201) {
        setState(() {
          isLoading = false;
        });
        Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (context) => ForgotPasswordSuccessScreen()), (route) => false);
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
    bool hasMinLength = setNewPasswordController.text.length >= 6;
    bool hasDigits = RegExp(r'\d').hasMatch(setNewPasswordController.text);
    bool hasUpperCase = RegExp(
      r'[A-Z]',
    ).hasMatch(setNewPasswordController.text);
    bool hasLowerCase = RegExp(
      r'[a-z]',
    ).hasMatch(setNewPasswordController.text);
    bool hasSymbols = RegExp(
      r'[!@#$%^&*(),.?":{}|<>]',
    ).hasMatch(setNewPasswordController.text);

    return hasMinLength &&
        hasDigits &&
        hasUpperCase &&
        hasLowerCase &&
        hasSymbols;
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    return Scaffold(
      body: Stack(
        children: [
          Scaffold(
            backgroundColor: themeProvider.isDarkMode ? null : Colors.white,
            appBar: AppBar(
              backgroundColor: themeProvider.isDarkMode
                  ? Color(AppColors.primaryColorDarkMode)
                  : Colors.white,
              surfaceTintColor: themeProvider.isDarkMode
                  ? Color(AppColors.primaryColorDarkMode)
                  : Colors.white,
              centerTitle: true,
              title: const Text(
                "Reset Password",
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
              ),
            ),
            body: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Password",
                        style: TextStyle(fontSize: 13, color: Colors.grey),
                      ),
                      CustomTextField(
                        isObscure: isEyeClicked ? false : true,
                        controller: setNewPasswordController,
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
                    isValid: setNewPasswordController.text.length >= 6,
                  ),
                  const SizedBox(height: 5),
                  StrongPasswordCheck(
                    title: "use of number",
                    isValid: RegExp(
                      r'\d',
                    ).hasMatch(setNewPasswordController.text),
                  ),
                  const SizedBox(height: 5),
                  StrongPasswordCheck(
                    title: "use of capital letter",
                    isValid: RegExp(
                      r'[A-Z]',
                    ).hasMatch(setNewPasswordController.text),
                  ),
                  const SizedBox(height: 5),
                  StrongPasswordCheck(
                    title: "use of small letter",
                    isValid: RegExp(
                      r'[a-z]',
                    ).hasMatch(setNewPasswordController.text),
                  ),
                  const SizedBox(height: 5),
                  StrongPasswordCheck(
                    title: "use of symbol",
                    isValid: RegExp(
                      r'[!@#$%^&*(),.?":{}|<>]',
                    ).hasMatch(setNewPasswordController.text),
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
                        controller: confirmSetNewPasswordController,
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
                  const Spacer(),
                  CustomButtonTwo(
                    title: isLoading ? "Resetting Password..." : "Reset",
                    onClick: () {
                      if (setNewPasswordController.text.trim().isNotEmpty &&
                          confirmSetNewPasswordController.text
                              .trim()
                              .isNotEmpty &&
                          setNewPasswordController.text.trim().isNotEmpty ==
                              confirmSetNewPasswordController.text
                                  .trim()
                                  .isNotEmpty &&
                          isPasswordValid()) {
                        _verifyAndResetPassword(
                          context,
                          widget.email,
                          widget.otp,
                          setNewPasswordController.text.trim(),
                        );
                      } else {
                        showSnackBar(
                          context: context,
                          message:
                              "Please make sure to provide matching passwords",
                          title: "Password Required",
                        );
                      }
                    },
                    isLoading: isLoading,
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
      ),
    );
  }
}
