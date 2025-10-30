// models/user.dart
enum UserType { citizen, security }

class User {
  final String id;
  final String email;
  final String name;
  final UserType userType;
  final String? badgeNumber; // For security personnel
  final String? agency; // For security personnel

  User({
    required this.id,
    required this.email,
    required this.name,
    required this.userType,
    this.badgeNumber,
    this.agency,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    // Define a map to convert string values to UserType enum
    final Map<String, UserType> userTypeMap = {
      'citizen': UserType.citizen,
      'security': UserType.security,
    };

    return User(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      // Correctly parse the userType from a string
      userType: userTypeMap[json['userType']] ?? UserType.citizen,
      badgeNumber: json['badgeNumber'],
      agency: json['agency'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'userType': userType.toString().split('.').last, // Store enum as a string
      'badgeNumber': badgeNumber,
      'agency': agency,
    };
  }
}