import 'package:aidora/features/settings/model/custom_response_settings_model.dart';
import 'package:aidora/features/settings/model/personalization_settings_model.dart';
import 'package:aidora/features/settings/model/security_settings_model.dart';

class UserSettingsModel {
  final SecuritySettingsModel security;
  final PersonalizationSettingsModel personalization;
  final CustomResponseSettingsModel customResponse;

  UserSettingsModel({
    required this.security,
    required this.personalization,
    required this.customResponse,
  });

  factory UserSettingsModel.fromMap(Map<String, dynamic> map) {
    SecuritySettingsModel security;
    if (map['security'] != null && map['security'] is Map) {
      try {
        security = SecuritySettingsModel.fromMap(map['security']);
      } catch (e) {
        security = SecuritySettingsModel.fromMap({});
      }
    } else {
      security = SecuritySettingsModel.fromMap({});
    }

    PersonalizationSettingsModel personalization;
    if (map['personalization'] != null && map['personalization'] is Map) {
      try {
        personalization = PersonalizationSettingsModel.fromMap(
          map['personalization'],
        );
      } catch (e) {
        personalization = PersonalizationSettingsModel.fromMap({});
      }
    } else {
      personalization = PersonalizationSettingsModel.fromMap({});
    }

    CustomResponseSettingsModel customResponse;
    if (map['customResponse'] != null && map['customResponse'] is Map) {
      try {
        customResponse = CustomResponseSettingsModel.fromMap(
          map['customResponse'],
        );
      } catch (e) {
        customResponse = CustomResponseSettingsModel.fromMap({});
      }
    } else {
      customResponse = CustomResponseSettingsModel.fromMap({});
    }

    return UserSettingsModel(
      security: security,
      personalization: personalization,
      customResponse: customResponse,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'security': security.toMap(),
      'personalization': personalization.toMap(),
      'customResponse': customResponse.toMap(),
    };
  }
}
