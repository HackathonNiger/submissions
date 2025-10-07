import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../features/user/model/user_model.dart';

class ThemeProvider with ChangeNotifier, WidgetsBindingObserver {
  bool _isDarkMode = false;
  bool _useSystemDefault = true;

  bool get isDarkMode => _isDarkMode;
  bool get useSystemDefault => _useSystemDefault;

  static const String _themeKey = 'isDarkMode';
  static const String _systemDefaultKey = 'useSystemDefault';

  ThemeProvider() {
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangePlatformBrightness() {
    if (_useSystemDefault) {
      _isDarkMode = WidgetsBinding.instance.window.platformBrightness == Brightness.dark;
      _updateSystemOverlayStyle();
      notifyListeners();
    }
  }

  Future<void> _saveThemeMode(bool isDarkMode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_themeKey, isDarkMode);
  }

  Future<void> _saveSystemDefault(bool useSystemDefault) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_systemDefaultKey, useSystemDefault);
  }

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;

    // Automatically set system default to false when dark mode is enabled
    if (_isDarkMode) {
      _useSystemDefault = false;
      _saveSystemDefault(false);
    } else {
      // Automatically set system default to true when dark mode is disabled
      _useSystemDefault = true;
      _saveSystemDefault(true);
    }

    _updateSystemOverlayStyle();
    _saveThemeMode(_isDarkMode);
    notifyListeners();
  }

  void setSystemDefault(bool value) {
    _useSystemDefault = value;
    _saveSystemDefault(value);
    if (value) {
      _isDarkMode = WidgetsBinding.instance.window.platformBrightness == Brightness.dark;
    }
    _updateSystemOverlayStyle();
    notifyListeners();
  }

  void setThemeMode(bool isDarkMode) {
    _isDarkMode = isDarkMode;
    if (_isDarkMode) {
      _useSystemDefault = false;
      _saveSystemDefault(false);
    } else {
      _useSystemDefault = true;
      _saveSystemDefault(true);
    }

    _updateSystemOverlayStyle();
    _saveThemeMode(_isDarkMode);
    notifyListeners();
  }

  ThemeData getTheme() {
    if (_useSystemDefault) {
      return WidgetsBinding.instance.window.platformBrightness == Brightness.dark
          ? ThemeData.dark()
          : ThemeData.light();
    } else {
      return _isDarkMode ? ThemeData.dark() : ThemeData.light();
    }
  }

  void _updateSystemOverlayStyle() {
    SystemChrome.setSystemUIOverlayStyle(
      _isDarkMode
          ? SystemUiOverlayStyle(
        systemNavigationBarColor: ThemeData.dark().canvasColor,
        systemNavigationBarIconBrightness: Brightness.light,
      )
          : SystemUiOverlayStyle(
        systemNavigationBarColor: Colors.white,
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
    );
  }
}