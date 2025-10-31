import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart' as fba; // Alias for clarity
import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/user.dart';
import '../models/crime_report.dart'; // Keep if UserType/CrimeType are defined here

// Note: Removed the unused shared_preferences import entirely.

class AuthService with ChangeNotifier {
  // Firebase Instances
  // 1. REMOVE INITIAL ASSIGNMENT (fba.FirebaseAuth.instance)
  final fba.FirebaseAuth _auth;
  final FirebaseFirestore _firestore;

  User? _currentUser;
  bool _isLoading = false;
  bool _isInitialized = false;

  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _currentUser != null;
  bool get isInitialized => _isInitialized;

  // 2. MODIFIED CONSTRUCTOR: Initialize with optional dependencies
  AuthService({
    fba.FirebaseAuth? auth,
    FirebaseFirestore? firestore,
  })  : _auth = auth ?? fba.FirebaseAuth.instance,     // Use provided 'auth' or default instance
        _firestore = firestore ?? FirebaseFirestore.instance // Use provided 'firestore' or default instance
  {
    // The listener uses the initialized _auth instance (mock or real)
    _auth.authStateChanges().listen(_onAuthStateChanged);
  }

  // CORE LISTENER: Handles login/logout events from Firebase
  void _onAuthStateChanged(fba.User? firebaseUser) async {
    _isLoading = true;
    notifyListeners();

    if (firebaseUser == null) {
      // User is logged out
      _currentUser = null;
      _isLoading = false;
      _isInitialized = true;
      if (kDebugMode) print('Auth: User signed out.');
    } else {
      // User is logged in, fetch their full profile from Firestore
      await _fetchUserData(firebaseUser.uid, firebaseUser.email!);
      _isLoading = false;
      if (kDebugMode) print('Auth: User signed in, profile loaded: ${_currentUser?.name}');
    }

    _isInitialized = true;
    notifyListeners();
  }

  // Helper function to fetch the full user profile from Firestore
  Future<void> _fetchUserData(String uid, String email) async {
    try {
      final userDoc = await _firestore.collection('users').doc(uid).get();

      if (userDoc.exists && userDoc.data() != null) {
        // Map Firestore data to your local User model
        final data = userDoc.data()!;
        _currentUser = User(
          id: uid,
          email: email, // Use email from Firebase Auth/Firestore
          name: data['name'] ?? 'No Name',
          userType: UserType.values.firstWhere(
                (e) => e.toString() == 'UserType.${data['userType']}',
            orElse: () => UserType.citizen, // Default to citizen
          ),
          badgeNumber: data['badgeNumber'],
          agency: data['agency'],
        );
      } else {
        // Handle case where Auth user exists but Firestore profile is missing
        _currentUser = null;
        if (kDebugMode) print('Error: Firestore profile missing for UID $uid');
      }
    } catch (e) {
      if (kDebugMode) print('Error fetching user data: $e');
      _currentUser = null;
    }
  }


  // LOGIN: Replace mock logic with Firebase sign-in
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);
      // The _onAuthStateChanged listener will handle fetching data and setting _currentUser
      return true;
    } on fba.FirebaseAuthException catch (e) {
      _isLoading = false;
      notifyListeners();
      // You should present 'e.message' to the user in the UI (e.g., "Invalid credentials")
      if (kDebugMode) print('Login failed: ${e.message}');
      return false;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      if (kDebugMode) print('An unexpected error occurred: $e');
      return false;
    }
  }

  // REGISTER: Replace mock logic with Firebase sign-up and Firestore data saving
  Future<bool> register(
      String name,
      String email,
      String password,
      UserType userType, {
        String? badgeNumber,
        String? agency,
      }) async {
    _isLoading = true;
    notifyListeners();

    try {
      // 1. Create user in Firebase Auth
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      final uid = userCredential.user!.uid;

      // 2. Save additional user details to Firestore
      await _firestore.collection('users').doc(uid).set({
        'name': name,
        'email': email,
        'userType': userType.toString().split('.').last, // Store as string (e.g., 'citizen', 'security')
        'badgeNumber': badgeNumber,
        'agency': agency,
      });

      // The _onAuthStateChanged listener will now fetch this new data and set _currentUser
      return true;
    } on fba.FirebaseAuthException catch (e) {
      _isLoading = false;
      notifyListeners();
      // Handle errors like weak password, email already in use
      if (kDebugMode) print('Registration failed: ${e.message}');
      return false;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      if (kDebugMode) print('An unexpected error occurred: $e');
      return false;
    }
  }

  // -------------------------------------------------------------------
  // PASSWORD RESET IMPLEMENTATION
  // -------------------------------------------------------------------
  /// Sends a password reset email to the given email address.
  Future<void> sendPasswordResetEmail(String email) async {
    try {
      // Firebase's built-in method to send the reset link
      await _auth.sendPasswordResetEmail(email: email);
    } on fba.FirebaseAuthException catch (e) {
      if (kDebugMode) print('Password reset failed: ${e.code} / ${e.message}');
      // Rethrow the error so the ForgotPasswordScreen can show a message
      rethrow;
    } catch (e) {
      if (kDebugMode) print('An unexpected error occurred during password reset: $e');
      rethrow;
    }
  }
  // -------------------------------------------------------------------

  // LOGOUT: Implement Firebase sign-out
  @override
  void logout() async {
    await _auth.signOut();
    // The _onAuthStateChanged listener handles clearing _currentUser and notifying listeners
  }
}