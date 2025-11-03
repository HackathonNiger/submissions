import 'dart:convert';

import 'package:aidora/utilities/constants/app_colors.dart';
import 'package:aidora/utilities/constants/app_icons.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../utilities/components/shared_preference_services.dart';
import '../../aidora_ai/screens/home/screens/home_screen.dart';
import '../../user/provider/user_provider.dart';
import 'onboarding_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ));
    _checkUserAndNavigate();
  }

  Future<void> _checkUserAndNavigate() async {
    try {
      final sharedPrefsService = await SharedPreferencesService.getInstance();
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      final userModel = await sharedPrefsService.getUserModel();
      final token = prefs.getString("Authorization");
      if (userModel != null) {
        final userJson = userModel.toJson();
        Provider.of<UserProvider>(context, listen: false).setUser(userJson);
      } else {
      }
      Future.delayed(const Duration(seconds: 2), () {
        if (userModel != null || token != null) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const HomeScreen()),
          );
        } else {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const OnboardingScreen()),
          );
        }
      });
    } catch (e) {
      Future.delayed(const Duration(seconds: 2), () {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const OnboardingScreen()),
        );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(backgroundColor: Colors.white, elevation: 0),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Spacer(),
          Center(
            child: SizedBox(
              height: 100,
              width: 100,
              child: Image.asset(AppIcons.appIcon),
            ),
          ),
          const Spacer(),
          Padding(
            padding: const EdgeInsets.only(bottom: 10.0),
            child: Column(
              children: [
                Text(
                  "from",
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  "Team Pandora",
                  style: TextStyle(
                    fontSize: 13,
                    color: Color(AppColors.primaryColor),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}