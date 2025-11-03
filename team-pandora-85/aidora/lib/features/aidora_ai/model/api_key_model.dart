class APIKeyModel {
  final String keyID;
  final String api_key;

  APIKeyModel({required this.keyID, required this.api_key});

  factory APIKeyModel.fromMap(Map<String, dynamic> map) {
    return APIKeyModel(api_key: map['api_key'] ?? '', keyID: map['keyID'] ?? '');
  }

  Map<String,dynamic> toMap() {
    return {
      'keyID': keyID,
      'key': api_key,
    };
  }
}
