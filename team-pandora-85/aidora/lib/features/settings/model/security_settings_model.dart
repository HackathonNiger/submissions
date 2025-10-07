class SecuritySettingsModel {
  final String password;
  final String pin;
  final bool alwaysLogin;
  final bool loginWithAccountPIN;
  final bool enableBiometrics;
  final bool isEmailVerified;

  SecuritySettingsModel({
    required this.password,
    required this.pin,
    required this.alwaysLogin,
    required this.loginWithAccountPIN,
    required this.enableBiometrics,
    required this.isEmailVerified,
  });

  factory SecuritySettingsModel.fromMap(Map<String, dynamic> map) {
    return SecuritySettingsModel(
      password: map['password'] ?? '',
      pin: map['pin'] ?? '',
      alwaysLogin: map['alwaysLogin'] ?? false,
      loginWithAccountPIN: map['loginWithAccountPIN'] ?? false,
      enableBiometrics: map['enableBiometrics'] ?? false,
      isEmailVerified: map['isEmailVerified'] ?? false,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'password': password,
      'pin': pin,
      'alwaysLogin': alwaysLogin,
      'loginWithAccountPIN': loginWithAccountPIN,
      'enableBiometrics': enableBiometrics,
      'isEmailVerified': isEmailVerified,
    };
  }
}