import 'dart:convert';

import '../../settings/model/user_settings_model.dart';

class UserModel {
  final String id;
  final String userID;
  final String firstName;
  final String lastName;
  final String otherNames;
  final String phoneNumber;
  final String gender;
  final String image;
  final String dob;
  final String email;
  final String token;
  final UserSettingsModel settings;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  UserModel({
    required this.id,
    required this.userID,
    required this.firstName,
    required this.lastName,
    required this.otherNames,
    required this.phoneNumber,
    required this.gender,
    required this.image,
    required this.dob,
    required this.email,
    required this.token,
    required this.settings,
    this.createdAt,
    this.updatedAt,
  });

  factory UserModel.fromMap(Map<String, dynamic> map) {
    UserSettingsModel settings;
    if (map['settings'] != null && map['settings'] is Map) {
      try {
        settings = UserSettingsModel.fromMap(map['settings']);
      } catch (e) {
        settings = UserSettingsModel.fromMap({});
      }
    } else {
      settings = UserSettingsModel.fromMap({});
    }
    return UserModel(
      id: map['_id'] ?? '',
      userID: map['userID'] ?? '',
      firstName: map['firstName'] ?? '',
      lastName: map['lastName'] ?? '',
      otherNames: map['otherNames'] ?? '',
      phoneNumber: map['phoneNumber'] ?? '',
      gender: map['gender'] ?? '',
      image: map['image'] ?? '',
      dob: map['dob'] ?? '',
      email: map['email'] ?? '',
      token: map['token'] ?? '',
      settings: settings,
      createdAt: map['createdAt'] != null
          ? DateTime.tryParse(map['createdAt'].toString())
          : null,
      updatedAt: map['updatedAt'] != null
          ? DateTime.tryParse(map['updatedAt'].toString())
          : null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      '_id': id,
      'userID': userID,
      'firstName': firstName,
      'lastName': lastName,
      'otherNames': otherNames,
      'phoneNumber': phoneNumber,
      'gender': gender,
      'image': image,
      'dob': dob,
      'email': email,
      'token': token,
      'settings': settings.toMap(),
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  String toJson() => json.encode(toMap());

  factory UserModel.fromJson(String source) => UserModel.fromMap(json.decode(source));

  UserModel copyWith({
    String? id,
    String? userID,
    String? firstName,
    String? lastName,
    String? otherNames,
    String? image,
    String? phoneNumber,
    String? gender,
    String? dob,
    String? email,
    String? token,
    bool? isEmailVerified,
    DateTime? createdAt,
    DateTime? updatedAt,
    UserSettingsModel? settings,
  }) {
    return UserModel(
      id: id ?? this.id,
      userID: userID ?? this.userID,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      otherNames: otherNames ?? this.otherNames,
      image: image ?? this.image,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      gender: gender ?? this.gender,
      dob: dob ?? this.dob,
      email: email ?? this.email,
      token: token ?? this.token,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      settings: settings ?? this.settings,
    );
  }
}


