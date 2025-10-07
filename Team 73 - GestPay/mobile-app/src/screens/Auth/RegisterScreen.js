// RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react-native";
import { useSelector, useDispatch } from 'react-redux';
import theme from "../../utils/theme";
import { useNavigation } from "@react-navigation/native";
import { authService } from '../../services/authService';
import { selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice';
import { useToast } from '../../components/Toast';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const authLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Clear error when user starts typing
  React.useEffect(() => {
    if (authError) {
      dispatch(clearError());
    }
  }, [firstName, lastName, username, phoneNumber, email, password, confirmPassword]);

  const validateForm = () => {
    if (!firstName.trim()) {
      toast.error('Please enter your first name');
      return false;
    }
    if (!lastName.trim()) {
      toast.error('Please enter your last name');
      return false;
    }
    if (!username.trim()) {
      toast.error('Please enter a username');
      return false;
    }
    if (username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return false;
    }
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!password.trim()) {
      toast.error('Please enter a password');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password: password,
        phone_number: phoneNumber.trim(),
        latitude: "6.5244", // Default Lagos coordinates
        longitude: "3.3792",
        role: "user"
      };

      const result = await authService.register(userData);
      
      if (result.success) {
        toast.success('Account created successfully! Welcome to GestPay');
      } else {
        toast.error(result.error || 'Please check your information and try again');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.background}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoSection}>
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>
              Join GestPay and experience the future of payments
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* First Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.inputWrapper}>
                <User
                  color={theme.colors.text.muted}
                  size={20}
                  strokeWidth={2}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  placeholderTextColor={theme.colors.text.muted}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Last Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputWrapper}>
                <User
                  color={theme.colors.text.muted}
                  size={20}
                  strokeWidth={2}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your last name"
                  placeholderTextColor={theme.colors.text.muted}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrapper}>
                <User
                  color={theme.colors.text.muted}
                  size={20}
                  strokeWidth={2}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Choose a username"
                  placeholderTextColor={theme.colors.text.muted}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Phone
                  color={theme.colors.text.muted}
                  size={20}
                  strokeWidth={2}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={theme.colors.text.muted}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail
                  color={theme.colors.text.muted}
                  size={20}
                  strokeWidth={2}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.text.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock
                  color={theme.colors.text.muted}
                  size={20}
                  strokeWidth={2}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor={theme.colors.text.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff
                      color={theme.colors.text.muted}
                      size={20}
                      strokeWidth={2}
                    />
                  ) : (
                    <Eye
                      color={theme.colors.text.muted}
                      size={20}
                      strokeWidth={2}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Lock
                  color={theme.colors.text.muted}
                  size={20}
                  strokeWidth={2}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.colors.text.muted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      color={theme.colors.text.muted}
                      size={20}
                      strokeWidth={2}
                    />
                  ) : (
                    <Eye
                      color={theme.colors.text.muted}
                      size={20}
                      strokeWidth={2}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Conditions */}
            <Text style={styles.termsText}>
              By creating a GestPay account, you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, (isLoading || authLoading) && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading || authLoading}
            >
              <LinearGradient
                colors={[
                  theme.colors.gradient.start,
                  theme.colors.gradient.middle,
                ]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.registerButtonText}>
                  {(isLoading || authLoading) ? 'Creating Account...' : 'Create Account'}
                </Text>
                {!(isLoading || authLoading) && (
                  <ArrowRight
                    color={theme.colors.surface}
                    size={20}
                    strokeWidth={2.5}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.signinLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    width: 140,
    height: 48,
    marginBottom: 24,
    borderRadius: 4,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginBottom: 24,
  },
  welcomeText: {
    ...theme.typography.heading,
    fontSize: 32,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleText: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    ...theme.typography.body,
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.gray,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  termsText: {
    ...theme.typography.caption,
    fontSize: 13,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  termsLink: {
    color: theme.colors.accent,
    fontFamily: "Inter-Medium",
  },
  registerButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: "row",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  registerButtonText: {
    ...theme.typography.button,
    fontSize: 17,
    fontFamily: "SpaceGrotesk-SemiBold",
    letterSpacing: 0.3,
  },
  signinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signinText: {
    ...theme.typography.body,
    fontSize: 15,
    color: theme.colors.text.secondary,
  },
  signinLink: {
    ...theme.typography.body,
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    color: theme.colors.accent,
  },
});

export default RegisterScreen;
