import 'dart:convert';

import 'package:aidora/features/aidora_ai/screens/home/screens/home_screen.dart';
import 'package:aidora/utilities/constants/app_strings.dart';
import 'package:aidora/utilities/error_handler/show_snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../utilities/components/shared_preference_services.dart';
import '../../user/model/user_model.dart';
import '../../user/provider/user_provider.dart';

class AuthServices extends ChangeNotifier {
  final String baseUrl = AppStrings.serverUrl;

  Future<int> registerUser({
    required BuildContext context,
    required String firstName,
    required String lastName,
    required String otherNames,
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/api/v1/aidora/users/auth/register-user"),
        headers: {"Content-Type": "application/json"},
        body: json.encode({
          "firstName": firstName,
          "lastName": lastName,
          "otherNames": otherNames,
          "email": email,
          "password": password,
        }),
      );
      return response.statusCode;
    } catch (e) {
      showSnackBar(context: context, message: AppStrings.serverErrorMessage, title: "Server Error");
      return -1;
    }
  }

  Future<void> userLogin({
    required BuildContext context,
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/api/v1/aidora/users/auth/user-login"),
        headers: {"Content-Type": "application/json"},
        body: json.encode({
          "email": email,
          "password": password,
        })
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        var responseBody = jsonDecode(response.body);
        var userJson = responseBody['user'];
        Provider.of<UserProvider>(
          context,
          listen: false,
        ).setUser(jsonEncode(userJson));
        String? token = userJson['token'];
        String? userID = userJson['userID'];
        if (token != null && userID != null) {
          await prefs.setString('Authorization', token);
          await prefs.setString('user', userID);
          // Save the UserModel to SharedPreferences
          UserModel userModel = UserModel.fromJson(jsonEncode(userJson));
          SharedPreferencesService sharedPreferencesService =
              await SharedPreferencesService.getInstance();
          await sharedPreferencesService.saveUserModel(userModel);
          Navigator.of(
            context,
          ).push(MaterialPageRoute(builder: (context) => const HomeScreen()));
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Login failed. Please try again.")),
          );
        }
      } else {
        final responseData = jsonDecode(response.body);
        showSnackBar(context: context, message: responseData['message'], title: responseData['title']);
      }
    } catch (e) {
      print(e);
      showSnackBar(context: context, message: AppStrings.serverErrorMessage, title: "Server Error");
    }
  }

  Future<int> sendForgotPasswordOTP({required BuildContext context, required String email}) async {
    try {
      final response = await http.post(Uri.parse("$baseUrl/api/v1/aidora/users/auth/send-forgot-password-otp"), headers: {
        "Content-Type": "application/json",
      }, body: json.encode({
        "email": email
      }));
      if (response.statusCode == 200 || response.statusCode == 201) {
        return response.statusCode;
      } else {
        final responseData = jsonDecode(response.body);
        showSnackBar(context: context, message: responseData['message'], title: responseData['title']);
        return response.statusCode;
      }
    } catch (e) {
      showSnackBar(context: context, message: AppStrings.serverErrorMessage, title: "Server Error");
      return -1;
    }
  }

  Future<int> resetPasswordWithOTP({required BuildContext context, required String email, required String otp, required String newPassword}) async {
    try {
      final response = await http.post(Uri.parse("$baseUrl/api/v1/aidora/users/auth/reset-password-with-otp"), headers: {
        "Content-Type": "application/json",
      }, body: json.encode({
        "email": email,
        "otp": otp,
        "newPassword": newPassword
      }));
      if (response.statusCode == 200 || response.statusCode == 201) {
        return response.statusCode;
      } else {
        final responseData = jsonDecode(response.body);
        showSnackBar(context: context, message: responseData['message'], title: responseData['title']);
        return response.statusCode;
      }
    } catch (e) {
      showSnackBar(context: context, message: AppStrings.serverErrorMessage, title: "Server Error");
      return -1;
    }
  }

}
