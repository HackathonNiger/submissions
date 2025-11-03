import 'dart:async';
import 'package:aidora/features/auth/screens/forgot_pasword/reset_password_screen.dart';
import 'package:aidora/features/auth/services/auth_services.dart';
import 'package:aidora/utilities/components/custom_button_one.dart';
import 'package:flutter/material.dart';

class ForgotPasswordOTPScreen extends StatefulWidget {
  final String email;
  const ForgotPasswordOTPScreen({super.key, required this.email});

  @override
  State<ForgotPasswordOTPScreen> createState() => _ForgotPasswordOTPScreenState();
}

class _ForgotPasswordOTPScreenState extends State<ForgotPasswordOTPScreen> {
  final List<TextEditingController> _controllers =
  List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());

  Timer? _timer;
  int _remainingSeconds = 120;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _remainingSeconds = 120;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 0) {
        setState(() {
          _remainingSeconds--;
        });
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    for (var c in _controllers) {
      c.dispose();
    }
    for (var f in _focusNodes) {
      f.dispose();
    }
    _timer?.cancel();
    super.dispose();
  }

  void _onChanged(String value, int index) {
    if (value.isNotEmpty && index < 3) {
      FocusScope.of(context).requestFocus(_focusNodes[index + 1]);
    } else if (value.isEmpty && index > 0) {
      FocusScope.of(context).requestFocus(_focusNodes[index - 1]);
    }
  }

  void _submitOtp() {
    final otp = _controllers.map((c) => c.text).join();
    if (otp.length == 4) {
      Navigator.of(context).push(MaterialPageRoute(builder: (context) => ResetPasswordScreen(otp: otp, email: widget.email)));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter all 4 digits')),
      );
    }
  }

  Widget _buildOtpBox(int index) {
    return SizedBox(
      width: 60,
      height: 60,
      child: TextField(
        controller: _controllers[index],
        focusNode: _focusNodes[index],
        keyboardType: TextInputType.number,
        textAlign: TextAlign.center,
        maxLength: 1,
        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w400),
        decoration: InputDecoration(
          counterText: "",
          filled: true,
          fillColor: Colors.grey[200],
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
        ),
        onChanged: (value) => _onChanged(value, index),
      ),
    );
  }

  String get _formattedTime {
    final minutes = _remainingSeconds ~/ 60;
    final seconds = _remainingSeconds % 60;
    return "${minutes.toString().padLeft(1, '0')}:${seconds.toString().padLeft(2, '0')}";
  }

  @override
  Widget build(BuildContext context) {
    final countdownColor =
    _remainingSeconds <= 10 ? Colors.red : Colors.black87;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Enter OTP", style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500
        ),),
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10.0),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 15.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: List.generate(4, (index) => _buildOtpBox(index)),
              ),
            ),
            const SizedBox(height: 5),
            const Text(
              "We’ve sent a 4-digit verification code to your provided email address.",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w400),
            ),
            const SizedBox(height: 40),
            Text(
              "Time remaining: $_formattedTime",
              style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: countdownColor),
            ),
            Spacer(),
            Padding(
              padding: const EdgeInsets.only(bottom: 10.0),
              child: CustomButtonOne(title: _remainingSeconds == 0 ? "Resend OTP": "Verify", isLoading: false, onClick: (){
                if (_remainingSeconds == 0) {
                  for (var c in _controllers) {
                    c.clear();
                  }
                  _startTimer();
                } else {
                  if (_remainingSeconds > 0) {
                    _submitOtp();
                  } else {
                    null;
                  }
                }
              }),
            ),
          ],
        ),
      ),
    );
  }
}
