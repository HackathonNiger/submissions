import 'dart:convert';

import 'package:aidora/utilities/constants/app_strings.dart';
import 'package:aidora/utilities/error_handler/show_snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ScheduleServices {
  final baseUrl = AppStrings.serverUrl;

  Future<int> createNewSchedule({
    required BuildContext context,
    required Map<String, dynamic> data,
  }) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString("Authorization");
      final response = await http.post(
        Uri.parse("$baseUrl/api/v1/aidora/ai/tasks/new-task"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: json.encode(data),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return response.statusCode;
      } else {
        final responseData = jsonDecode(response.body);
        showSnackBar(
          context: context,
          message: responseData['message'],
          title: responseData['title'],
        );
        return response.statusCode;
      }
    } catch (e) {
      showSnackBar(
        context: context,
        message: AppStrings.serverErrorMessage,
        title: "Server Error",
      );
      return -1;
    }
  }

  Future<void> getSingleSchedule({
    required BuildContext context,
    required String taskID,
  }) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString("Authorization");
      final response = await http.post(
        Uri.parse("$baseUrl/api/v1/aidora/ai/tasks/single-task/$taskID"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );
    } catch (e) {
      showSnackBar(
        context: context,
        message: AppStrings.serverErrorMessage,
        title: "Server Error",
      );
    }
  }

  Future<void> searchSchedules({
    required BuildContext context,
    required String query,
  }) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString("Authorization");
      final response = await http.post(
        Uri.parse("$baseUrl/api/v1/aidora/ai/tasks/search-task?$query"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );
    } catch (e) {
      showSnackBar(
        context: context,
        message: AppStrings.serverErrorMessage,
        title: "Server Error",
      );
    }
  }

  Future<int> deleteSchedule({
    required BuildContext context,
    required String taskID,
  }) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString("Authorization");
      final response = await http.post(
        Uri.parse("$baseUrl/api/v1/aidora/ai/tasks/delete-task"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: json.encode({"taskID": taskID}),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return response.statusCode;
      } else {
        final responseData = jsonDecode(response.body);
        showSnackBar(
          context: context,
          message: responseData['message'],
          title: responseData['title'],
        );
        return response.statusCode;
      }
    } catch (e) {
      showSnackBar(
        context: context,
        message: AppStrings.serverErrorMessage,
        title: "Server Error",
      );
      return -1;
    }
  }

  Future<int> updateSchedule({
    required BuildContext context,
    required Map<String, dynamic> data,
  }) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString("Authorization");
      final response = await http.post(
        Uri.parse("$baseUrl/api/v1/aidora/ai/tasks/update-task"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: json.encode(data),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return response.statusCode;
      } else {
        final responseData = jsonDecode(response.body);
        showSnackBar(
          context: context,
          message: responseData['message'],
          title: responseData['title'],
        );
        return response.statusCode;
      }
    } catch (e) {
      showSnackBar(
        context: context,
        message: AppStrings.serverErrorMessage,
        title: "Server Error",
      );
      return -1;
    }
  }

  Future<int> toggleScheduleStatus({
    required BuildContext context,
    required String taskID,
  }) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString("Authorization");
      final response = await http.post(
        Uri.parse("$baseUrl/api/v1/aidora/ai/tasks/task-status/toggle"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: json.encode({"taskID": taskID}),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return response.statusCode;
      } else {
        final responseData = jsonDecode(response.body);
        showSnackBar(
          context: context,
          message: responseData['message'],
          title: responseData['title'],
        );
        return response.statusCode;
      }
    } catch (e) {
      showSnackBar(
        context: context,
        message: AppStrings.serverErrorMessage,
        title: "Server Error",
      );
      return -1;
    }
  }
}
