import 'package:aidora/features/settings/model/custom_response_settings_model.dart';
import 'package:aidora/features/settings/model/personalization_settings_model.dart';
import 'package:aidora/features/settings/model/security_settings_model.dart';
import 'package:aidora/features/user/model/user_model.dart';
import 'package:flutter/material.dart';
import '../../settings/model/user_settings_model.dart';

class UserProvider extends ChangeNotifier {
  UserModel _userModel = UserModel(
    id: '',
    userID: '',
    firstName: '',
    lastName: '',
    otherNames: '',
    phoneNumber: '',
    gender: '',
    image: '',
    dob: '',
    email: '',
    token: '',
    settings: UserSettingsModel(
      security: SecuritySettingsModel(
        password: '',
        pin: '',
        alwaysLogin: false,
        loginWithAccountPIN: false,
        enableBiometrics: false,
        isEmailVerified: false,
      ),
      personalization: PersonalizationSettingsModel(theme: ''),
      customResponse: CustomResponseSettingsModel(
        customName: '',
        instructions: '',
        occupation: '',
        bio: '',
      ),
    ),
  );

  String? _loggedInUserId;

  UserModel get userModel => _userModel;

  String? get loggedInUserId => _loggedInUserId;

  void setUser(String user) {
    _userModel = UserModel.fromJson(user);
    _loggedInUserId = _userModel.id;
    notifyListeners();
  }

  void setUserFromModel(UserModel userModel) {
    _userModel = userModel;
    _loggedInUserId = userModel.id;
    notifyListeners();
  }

  void updateUser(UserModel newUser) {
    _userModel = newUser;
    notifyListeners();
  }
}
