import 'dart:convert';

import 'package:aidora/features/aidora_ai/conversations/model/conversation_model.dart';
import 'package:aidora/utilities/constants/app_strings.dart';
import 'package:aidora/utilities/error_handler/show_snack_bar.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ConversationServices {
  final baseUrl = AppStrings.serverUrl;

    Future<int> createNewConversation(BuildContext context, String title) async {
      try {
        final SharedPreferences prefs = await SharedPreferences.getInstance();
        String? token = prefs.getString("Authorization");
        final response = await http.post(Uri.parse("$baseUrl/api/v1/aidora/ai/conversations/new-conversation"), headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token"
        }, body: json.encode({
          "title": title
        }));
        print(response.body);
        return response.statusCode;
      } catch (e) {
        return -1;
      }
    }

  Future<List<ConversationModel>> allConversations(BuildContext context) async {
    List<ConversationModel> conversations = [];
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString("Authorization");
      final response = await http.get(
        Uri.parse("$baseUrl/api/v1/aidora/ai/conversations/all-conversations"),
        headers: {
          "Content-Type": "applications/json",
          "Authorization": "Bearer $token",
        },
      );
      print(response.body);
      if (response.statusCode == 200 || response.statusCode == 201) {
        final List<dynamic> responseData = jsonDecode(response.body)['data'];
        for (var categoryData in responseData) {
          conversations.add(ConversationModel.fromMap(categoryData));
        }
      } else {
        throw Exception('Failed to fetch products');
      }
    } catch (e) {
      showSnackBar(
        context: context,
        message: AppStrings.serverErrorMessage,
        title: "Server Error",
      );
    }
    return conversations;
  }

  Future<int> deleteConversation(BuildContext context, String conversationId) async {
      try {
        final SharedPreferences prefs = await SharedPreferences.getInstance();
        String? token = prefs.getString("Authorization");
        final response = await http.delete(Uri.parse("$baseUrl/api/v1/aidora/ai/conversations/delete-conversation"), headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token"
        }, body: json.encode({
          "conversationId": conversationId
        }));
        print(response.body);
        return response.statusCode;
      } catch (e) {
        return -1;
      }
  }
}
