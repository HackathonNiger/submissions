class CustomResponseSettingsModel {
  final String customName;
  final String instructions;
  final String occupation;
  final String bio;

  CustomResponseSettingsModel({
    required this.customName,
    required this.instructions,
    required this.occupation,
    required this.bio,
  });

  factory CustomResponseSettingsModel.fromMap(Map<String, dynamic> map) {
    return CustomResponseSettingsModel(
      customName: map['customName'] ?? '',
      instructions: map['instructions'] ?? '',
      occupation: map['occupation'] ?? '',
      bio: map['bio'] ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'customName': customName,
      'instructions': instructions,
      'occupation': occupation,
      'bio': bio,
    };
  }
}
