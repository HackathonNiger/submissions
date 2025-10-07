import 'dart:convert';

import 'package:aidora/utilities/constants/app_strings.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../utilities/components/shared_preference_services.dart';
import '../model/user_model.dart';
import '../provider/user_provider.dart';

class UserServices {
  final String baseUrl = AppStrings.serverUrl;

  Future<int> checkExistingEmail({
    required BuildContext context,
    required String email,
  }) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/api/v1/aidora/users/check-email"),
        headers: {"Content-Type": "application/json"},
        body: json.encode({"email": email}),
      );
      return response.statusCode;
    } catch (e) {
      return -1;
    }
  }

  Future<int> checkExistingPhoneNumber({
    required BuildContext context,
    required String phoneNumber,
  }) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/api/v1/aidora/users/check-phone"),
        headers: {"Content-Type": "application/json"},
        body: json.encode({"phoneNumber": phoneNumber}),
      );
      return response.statusCode;
    } catch (e) {
      return -1;
    }
  }

  Future<int> updateUserProfile({
    required BuildContext context,
    required Map<String, dynamic> data,
  }) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString("Authorization");
      final response = await http.put(
        Uri.parse("$baseUrl/api/v1/aidora/users/update-profile"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: json.encode(data),
      );
      return response.statusCode;
    } catch (e) {
      return -1;
    }
  }
  
  Future<int> deleteAccount(BuildContext context) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString("Authorization");
      final response = await http.delete(Uri.parse("$baseUrl/api/v1/aidora/users/delete-profile"), headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      });
      return response.statusCode;
    } catch (e) {
      return -1;
    }
  }

  Future<UserModel?> userProfile(BuildContext context) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString("Authorization");

      final response = await http.get(
        Uri.parse("$baseUrl/api/v1/aidora/users/user-profile"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        var responseBody = jsonDecode(response.body);
        var userJson = responseBody['data'];
        UserModel userModel = UserModel.fromJson(jsonEncode(userJson));
        SharedPreferencesService sharedPreferencesService =
        await SharedPreferencesService.getInstance();
        await sharedPreferencesService.saveUserModel(userModel);

        final userProvider = Provider.of<UserProvider>(context, listen: false);
        userProvider.setUser(jsonEncode(userJson));
        return userProvider.userModel;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
}
