import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter/services.dart';
import '../services/auth_service.dart';
import '../services/connectivity_service.dart'; // NEW: Import connectivity service
import '../models/user.dart';
import 'auth/login_screen.dart';
import 'citizen/offline_report_screen.dart'; // NEW: Import offline report screen
import 'citizen/citizen_home.dart';
import 'security/security_home.dart';

// =======================================================================
// NEW: Screen to offer offline-only features when not logged in
// This was defined in the previous step and is added here for completeness
// =======================================================================
class OfflineLandingScreen extends StatelessWidget {
  const OfflineLandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Offline Mode'),
        backgroundColor: Colors.grey,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.signal_wifi_off, size: 80, color: Colors.grey),
              const SizedBox(height: 20),
              const Text(
                'No Internet Connection.',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              const Text(
                'You must be online to log in or register. Use the button below for emergency offline reporting.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.black54),
              ),
              const SizedBox(height: 40),
              ElevatedButton.icon(
                onPressed: () {
                  // Navigate directly to the Offline Report Screen
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => OfflineReportScreen(),
                    ),
                  );
                },
                icon: const Icon(Icons.bluetooth_searching),
                label: const Text('Access Emergency Offline Reporting'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
// =======================================================================


class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key}); // Changed to StatelessWidget

  // NEW: The core navigation logic
  void _navigateAfterInit(BuildContext context, AuthService authService, bool isOnline) {
    // Check if initialization is complete and auth status is stable
    if (!authService.isInitialized) {
      // Still initializing. Wait for the next Consumer/Selector update.
      return;
    }

    if (authService.isLoggedIn) {
      // CASE 1: LOGGED IN (Online or Offline)
      final user = authService.currentUser!;
      final routeName = user.userType == UserType.citizen
          ? '/citizen-home'
          : '/security-home';

      // Use pushReplacementNamed as in your original logic
      Navigator.of(context).pushReplacementNamed(routeName);

    } else {
      // CASE 2: NOT LOGGED IN
      if (isOnline) {
        // CASE 2a: NOT LOGGED IN, BUT ONLINE -> Must log in
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => LoginScreen()),
        );
      } else {
        // CASE 2b: NOT LOGGED IN, AND OFFLINE -> Offer offline features
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const OfflineLandingScreen()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);

    // We combine the check for Auth initialization and Connectivity status
    return Consumer<AuthService>(
      builder: (context, authService, child) {
        // Step 1: Wait for AuthService to load local state (isInitialized check)
        if (!authService.isInitialized) {
          return const Scaffold(
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 20),
                  Text(
                    '📣 ShoutOUT! 📣',
                    style: TextStyle(
                      fontSize: 40.0,
                      fontWeight: FontWeight.w900,
                      color: Colors.red,
                      fontFamily: 'Lobster',
                    ),
                  ),
                  SizedBox(height: 10),
                  Text('Loading Secure State...'),
                ],
              ),
            ),
          );
        }

        // Step 2: Once Auth is initialized, check connectivity and navigate
        return Selector<ConnectivityService, bool>(
          selector: (_, connService) => connService.isOnline,
          builder: (context, isOnline, child) {
            // This is guaranteed to run after authService is initialized.
            // Run the navigation logic immediately.
            WidgetsBinding.instance.addPostFrameCallback((_) {
              _navigateAfterInit(context, authService, isOnline);
            });

            // Return a simple loading screen while the navigation is processed
            return const Scaffold(
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 20),
                    Text('Routing...'),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}