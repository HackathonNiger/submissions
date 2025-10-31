import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../models/user.dart';
import '../screens/citizen/citizen_home.dart';
import '../screens/security/security_home.dart';
import '../screens/auth/login_screen.dart';
import '../screens/splash_screen.dart'; // We use this for initial loading state

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    // We listen to the AuthService to check two things:
    // 1. Is the service fully initialized (i.e., has it checked the Firebase auth state)?
    // 2. Is there a current logged-in user?
    final authService = Provider.of<AuthService>(context);

    // 1. Show Splash Screen while Firebase/AuthService is initializing
    if (!authService.isInitialized || authService.isLoading) {
      // Re-using your existing SplashScreen widget
      return SplashScreen();
    }

    // 2. Check for a current user
    final user = authService.currentUser;

    if (user == null) {
      // No user is logged in -> show the login screen
      return LoginScreen();
    } else {
      // User is logged in -> navigate to the appropriate home screen
      // based on their UserType stored in Firestore and fetched into the User object.
      switch (user.userType) {
        case UserType.citizen:
          return CitizenHome();
        case UserType.security:
          return SecurityHome();
        default:
        // Fallback to citizen home or a generic error screen
          return CitizenHome();
      }
    }
  }
}