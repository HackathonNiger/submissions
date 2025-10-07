class PersonalizationSettingsModel {
  final String theme;

  PersonalizationSettingsModel({required this.theme});

  factory PersonalizationSettingsModel.fromMap(Map<String, dynamic> map) {
    return PersonalizationSettingsModel(theme: map['theme'] ?? 'Light');
  }

  Map<String, dynamic> toMap() {
    return {'theme': theme};
  }
}