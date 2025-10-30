// screens/auth/register_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../models/user.dart';

class RegisterScreen extends StatefulWidget {
  // 1. ADD const constructor
  const RegisterScreen({super.key});

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _badgeController = TextEditingController();
  final _agencyController = TextEditingController();
  UserType _selectedUserType = UserType.citizen;

  // 2. UPDATE NAVIGATION LOGIC IN _register()
  void _register() async {
    if (_formKey.currentState!.validate()) {
      // Show loading indicator is implicitly handled by the Consumer
      final authService = Provider.of<AuthService>(context, listen: false);

      bool success = await authService.register(
        _nameController.text,
        _emailController.text,
        _passwordController.text,
        _selectedUserType,
        badgeNumber: _selectedUserType == UserType.security ? _badgeController.text : null,
        agency: _selectedUserType == UserType.security ? _agencyController.text : null,
      );

      if (success) {
        // --- CRITICAL CHANGE: Navigate to the root/AuthWrapper ---
        // The AuthWrapper will detect the newly signed-in user and redirect.
        Navigator.of(context).pushReplacementNamed('/');
        // --------------------------------------------------------

      } else {
        // A generic error message, as Firebase Auth errors are detailed.
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration failed. Please check if the email is already in use.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Register'), // Added const
        backgroundColor: Colors.indigo, // Changed to indigo for consistency
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0), // Added const
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 20), // Added const

                // User Type Selection
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0), // Added const
                    child: Column(
                      children: [
                        const Text('Register as', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)), // Added const
                        const SizedBox(height: 10), // Added const
                        Row(
                          children: [
                            Expanded(
                              child: RadioListTile<UserType>(
                                title: const Text('Citizen'), // Added const
                                value: UserType.citizen,
                                groupValue: _selectedUserType,
                                onChanged: (value) {
                                  setState(() {
                                    _selectedUserType = value!;
                                  });
                                },
                              ),
                            ),
                            Expanded(
                              child: RadioListTile<UserType>(
                                title: const Text('Security Personnel'), // Added const
                                value: UserType.security,
                                groupValue: _selectedUserType,
                                onChanged: (value) {
                                  setState(() {
                                    _selectedUserType = value!;
                                  });
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 20), // Added const

                // Name Field
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration( // Added const
                    labelText: 'Full Name',
                    prefixIcon: Icon(Icons.person),
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your name';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 16), // Added const

                // Email Field
                TextFormField(
                  controller: _emailController,
                  decoration: const InputDecoration( // Added const
                    labelText: 'Email',
                    prefixIcon: Icon(Icons.email),
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your email';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 16), // Added const

                // Password Field
                TextFormField(
                  controller: _passwordController,
                  decoration: const InputDecoration( // Added const
                    labelText: 'Password',
                    prefixIcon: Icon(Icons.lock),
                    border: OutlineInputBorder(),
                  ),
                  obscureText: true,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your password';
                    }
                    if (value.length < 6) {
                      return 'Password must be at least 6 characters';
                    }
                    return null;
                  },
                ),

                // Security Personnel Additional Fields
                if (_selectedUserType == UserType.security) ...[
                  const SizedBox(height: 16), // Added const
                  TextFormField(
                    controller: _badgeController,
                    decoration: const InputDecoration( // Added const
                      labelText: 'Badge Number',
                      prefixIcon: Icon(Icons.badge),
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (_selectedUserType == UserType.security && (value == null || value.isEmpty)) {
                        return 'Please enter your badge number';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16), // Added const
                  TextFormField(
                    controller: _agencyController,
                    decoration: const InputDecoration( // Added const
                      labelText: 'Agency/Department',
                      prefixIcon: Icon(Icons.business),
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (_selectedUserType == UserType.security && (value == null || value.isEmpty)) {
                        return 'Please enter your agency or department';
                      }
                      return null;
                    },
                  ),
                ],

                const SizedBox(height: 24), // Added const

                // Register Button
                Consumer<AuthService>(
                  builder: (context, authService, child) {
                    return SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: authService.isLoading ? null : _register,
                        child: authService.isLoading
                            ? const CircularProgressIndicator(color: Colors.white) // Added const
                            : const Text('Register', style: TextStyle(fontSize: 18, color: Colors.white)), // Added const
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.indigo, // Changed to indigo
                          foregroundColor: Colors.white,
                        ),
                      ),
                    );
                  },
                ),

                const SizedBox(height: 16), // Added const

                // Login Link
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: const Text('Already have an account? Login'), // Added const
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ... (dispose method remains the same)
  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _badgeController.dispose();
    _agencyController.dispose();
    super.dispose();
  }
}