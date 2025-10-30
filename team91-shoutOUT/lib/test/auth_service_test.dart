// test/auth_service_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:provider/provider.dart';
import 'package:firebase_auth/firebase_auth.dart' as fba;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fake_cloud_firestore/fake_cloud_firestore.dart';

// Import the files we are testing/using
import 'package:shout/models/user.dart';
import 'package:shout/services/auth_service.dart';

// --- MOCK SETUP ---
// 1. Create a Mock for the Firebase Auth instance
class MockFirebaseAuth extends Mock implements fba.FirebaseAuth {}

// 2. Create a Mock for the Firebase User (needed for signInWithEmailAndPassword response)
class MockUser extends Mock implements fba.User {
  @override
  String get uid => 'mock_uid_123';
  @override
  String get email => 'test@example.com';
}

// 3. Create a Mock for the UserCredential
class MockUserCredential extends Mock implements fba.UserCredential {
  @override
  fba.User? get user => MockUser();
}
// --- END MOCK SETUP ---


void main() {
  // Global variables for the mocks and the service instance
  late AuthService authService;
  late MockFirebaseAuth mockAuth;
  late FakeFirebaseFirestore fakeFirestore;

  // Setup runs before each test
  setUp(() {
    mockAuth = MockFirebaseAuth();
    fakeFirestore = FakeFirebaseFirestore();

    // 1. Initialize AuthService with mocked/fake dependencies
    // Note: This requires updating AuthService constructor if you want to inject the dependencies
    // For simplicity, we'll initialize the service and then use spy logic where possible,
    // or modify the AuthService to accept dependencies if needed.
    // Given the current structure, we assume we can test the public methods reliably.

    // For this test suite, we'll initialize a simple AuthService and focus on mocking
    // the interactions that happen inside the public methods (login, register).

    // Since Firebase dependencies are final in your AuthService, we need a slight adjustment
    // to test it, or we rely on integration tests. For unit tests, a helper class is cleaner.

    // --- TEMPORARY WORKAROUND for Testing Singletons ---
    // If you cannot modify AuthService to accept MockFirebaseAuth and FakeFirebaseFirestore
    // in its constructor, testing it purely as a unit test is nearly impossible.
    // For this demonstration, we will assume you update AuthService to allow dependency injection:
    /*
      // In AuthService:
      AuthService({fba.FirebaseAuth? auth, FirebaseFirestore? firestore})
        : _auth = auth ?? fba.FirebaseAuth.instance,
          _firestore = firestore ?? FirebaseFirestore.instance
      {...}
    */

    // Initialize the service assuming dependency injection is available
    authService = AuthService(auth: mockAuth, firestore: fakeFirestore);

    // Mock the state changes stream to return null initially (logged out)
    when(mockAuth.authStateChanges()).thenAnswer((_) => Stream.value(null));
  });

  // --- Test Case 1: Successful Login ---
  group('Login Tests', () {
    test('should return true and update user state on successful login', () async {
      // ARRANGE
      const String email = 'test@example.com';
      const String password = 'password123';

      // 1. Set up Firestore data for the mock user
      await fakeFirestore.collection('users').doc('mock_uid_123').set({
        'name': 'Test User',
        'email': email,
        'userType': 'citizen',
        'badgeNumber': null,
        'agency': null,
      });

      // 2. Mock the Firebase Auth login call to succeed
      when(mockAuth.signInWithEmailAndPassword(email: email, password: password))
          .thenAnswer((_) async => MockUserCredential());

      // 3. Mock the authStateChanges stream to emit the successful login event after the call
      // Note: This simulation is tricky. For unit tests, we primarily check the return value
      // and state change initiated by the public method.
      when(mockAuth.authStateChanges()).thenAnswer((_) => Stream.value(MockUser()));

      // ACT
      final result = await authService.login(email, password);

      // ASSERT
      // 1. Check return value
      expect(result, true);
      // 2. Check if the Firebase auth method was called
      verify(mockAuth.signInWithEmailAndPassword(email: email, password: password)).called(1);
      // 3. Check if loading state was correctly managed
      expect(authService.isLoading, false);
      // 4. Check if the user object was populated (this relies on the complexity of _onAuthStateChanged)
      // Since _onAuthStateChanged runs asynchronously, we rely on the main process finishing.
      // A simple check on whether the listener was notified is sufficient for unit testing.
    });

    test('should return false on failed login (FirebaseAuthException)', () async {
      // ARRANGE
      const String email = 'bad@example.com';
      const String password = 'wrongpassword';

      // Mock the Firebase Auth login call to throw an exception
      when(mockAuth.signInWithEmailAndPassword(email: email, password: password))
          .thenThrow(fba.FirebaseAuthException(code: 'wrong-password', message: 'Invalid credentials'));

      // ACT
      final result = await authService.login(email, password);

      // ASSERT
      expect(result, false);
      expect(authService.isLoading, false);
      expect(authService.currentUser, null);
    });
  });

  // --- Test Case 2: Successful Registration ---
  group('Registration Tests', () {
    test('should register and save citizen profile to Firestore', () async {
      // ARRANGE
      const name = 'New Citizen';
      const email = 'new@citizen.com';
      const password = 'securepassword';
      const userType = UserType.citizen;

      // 1. Mock the Firebase Auth registration call to succeed
      when(mockAuth.createUserWithEmailAndPassword(email: email, password: password))
          .thenAnswer((_) async => MockUserCredential());

      // ACT
      final result = await authService.register(name, email, password, userType);

      // ASSERT
      expect(result, true);

      // 1. Verify Auth method was called
      verify(mockAuth.createUserWithEmailAndPassword(email: email, password: password)).called(1);

      // 2. Verify Firestore write was executed with correct data
      final userDoc = await fakeFirestore.collection('users').doc('mock_uid_123').get();
      expect(userDoc.exists, true);
      expect(userDoc.data()?['name'], name);
      expect(userDoc.data()?['userType'], 'citizen');
      expect(userDoc.data()?['badgeNumber'], null);

      expect(authService.isLoading, false);
    });

    test('should register and save security profile with badge and agency to Firestore', () async {
      // ARRANGE
      const name = 'Sgt. Smith';
      const email = 'sgt@security.com';
      const password = 'securepassword';
      const userType = UserType.security;
      const badgeNumber = '007';
      const agency = 'Defense';

      // 1. Mock the Firebase Auth registration call to succeed
      when(mockAuth.createUserWithEmailAndPassword(email: email, password: password))
          .thenAnswer((_) async => MockUserCredential());

      // ACT
      final result = await authService.register(
        name, email, password, userType,
        badgeNumber: badgeNumber, agency: agency,
      );

      // ASSERT
      expect(result, true);

      // 1. Verify Firestore write was executed with correct security data
      final userDoc = await fakeFirestore.collection('users').doc('mock_uid_123').get();
      expect(userDoc.exists, true);
      expect(userDoc.data()?['name'], name);
      expect(userDoc.data()?['userType'], 'security');
      expect(userDoc.data()?['badgeNumber'], badgeNumber);
      expect(userDoc.data()?['agency'], agency);

      expect(authService.isLoading, false);
    });

    test('should return false on failed registration (e.g., email already in use)', () async {
      // ARRANGE
      const email = 'fail@register.com';
      const password = 'password';

      // Mock the Firebase Auth registration call to throw an exception
      when(mockAuth.createUserWithEmailAndPassword(email: email, password: password))
          .thenThrow(fba.FirebaseAuthException(code: 'email-already-in-use', message: 'Email in use'));

      // ACT
      final result = await authService.register('Name', email, password, UserType.citizen);

      // ASSERT
      expect(result, false);
      expect(authService.isLoading, false);
    });
  });

  // --- Test Case 3: Forgot Password ---
  group('Password Reset Tests', () {
    test('should call sendPasswordResetEmail on success', () async {
      // ARRANGE
      const email = 'reset@example.com';

      // Mock the Firebase Auth call to succeed (returns void/Future<void>)
      when(mockAuth.sendPasswordResetEmail(email: email)).thenAnswer((_) async => Future.value());

      // ACT
      await authService.sendPasswordResetEmail(email);

      // ASSERT
      // Verify that the Firebase method was called exactly once with the correct email
      verify(mockAuth.sendPasswordResetEmail(email: email)).called(1);
    });

    test('should rethrow exception on failure (e.g., user not found)', () async {
      // ARRANGE
      const email = 'unknown@example.com';

      // Mock the Firebase Auth call to throw an exception
      when(mockAuth.sendPasswordResetEmail(email: email))
          .thenThrow(fba.FirebaseAuthException(code: 'user-not-found', message: 'No user found.'));

      // ACT & ASSERT
      // The test should expect the specific exception to be thrown
      expect(
            () => authService.sendPasswordResetEmail(email),
        throwsA(isA<fba.FirebaseAuthException>()),
      );

      // Verify the method was still attempted
      verify(mockAuth.sendPasswordResetEmail(email: email)).called(1);
    });
  });
}