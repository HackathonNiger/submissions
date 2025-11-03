import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import '../../features/user/model/user_model.dart';


class SharedPreferencesService {
  static SharedPreferencesService? _instance;
  static SharedPreferences? _preferences;

  SharedPreferencesService._internal();

  static Future<SharedPreferencesService> getInstance() async {
    _instance ??= SharedPreferencesService._internal();
    _preferences ??= await SharedPreferences.getInstance();
    return _instance!;
  }


  // Save UserModel
  Future<void> saveUserModel(UserModel user) async {
    final userJson = jsonEncode(user.toJson());
    await _preferences?.setString("userModel", userJson);
  }

  // Get UserModel
  Future<UserModel?> getUserModel() async {
    final userJson = _preferences?.getString("userModel");
    if (userJson != null) {
      return UserModel.fromJson(jsonDecode(userJson));
    }
    return null;
  }

  //#################################################### Dark OR Light Mode ################################################################
  // Save isDarkMode
  Future<void> saveIsDarkMode(bool isDarkMode) async {
    await _preferences?.setBool("isDarkMode", isDarkMode);
  }

  // Get isDarkMode
  Future<bool> getIsDarkMode() async {
    return _preferences?.getBool("isDarkMode") ?? false;
  }

  // Clear user data
  static Future<void> clearUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('userModel');
  }
}