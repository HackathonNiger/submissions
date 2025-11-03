// LoginScreen.js
import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, Scan } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import theme from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/authService';
import { selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice';
import { useToast } from '../../components/Toast';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const authLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Clear error when component mounts or when user starts typing
  React.useEffect(() => {
    if (authError) {
      dispatch(clearError());
    }
  }, [email, password]);

  const validateForm = () => {
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!password.trim()) {
      toast.error('Please enter your password');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await authService.login(email.trim().toLowerCase(), password);
      
      if (result.success) {
        // Navigation will be handled by the AuthNavigator based on auth state
        toast.success('Welcome back! Login successful');
      } else {
        toast.error(result.error || 'Please check your credentials and try again');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceLogin = () => {
    // Navigate to face login setup/authentication
    navigation.navigate('FaceSetupScreen');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              source={require('../../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitleText}>
              Sign in to continue your journey
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                ]}
              >
                <Mail
                  color={emailFocused ? theme.colors.accent : theme.colors.text.muted}
                  size={20}
                  strokeWidth={2}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.text.muted}
                  value={email}
                  onChangeText={setEmail}
                 // onFocus={() => setEmailFocused(true)}
                 // onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused,
                ]}
              >
                <Lock
                  color={passwordFocused ? theme.colors.accent : theme.colors.text.muted}
                  size={20}
                  strokeWidth={2}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.text.muted}
                  value={password}
                  onChangeText={setPassword}
                 // onFocus={() => setPasswordFocused(true)}
                 // onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff color={theme.colors.text.muted} size={20} strokeWidth={2} />
                  ) : (
                    <Eye color={theme.colors.text.muted} size={20} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity 
              style={[styles.loginButton, (isLoading || authLoading) && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading || authLoading}
            >
              <LinearGradient
                colors={[theme.colors.gradient.start, theme.colors.gradient.middle]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginButtonText}>
                  {(isLoading || authLoading) ? 'Signing In...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* FacePay Button */}
            <TouchableOpacity
              style={styles.facePayButton}
              onPress={handleFaceLogin}
            >
              <LinearGradient
                colors={[theme.colors.gradient.middle, theme.colors.gradient.end]}
                style={styles.facePayGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Scan color={theme.colors.surface} size={24} strokeWidth={2} />
                <Text style={styles.facePayText}>Sign in with FacePay</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupLink}>Create Account</Text>
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
    alignItems: 'center',
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
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...theme.typography.body,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.gray,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: theme.colors.accent,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    ...theme.typography.button,
    fontSize: 17,
    fontFamily: 'SpaceGrotesk-SemiBold',
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray,
  },
  dividerText: {
    ...theme.typography.caption,
    fontSize: 13,
    color: theme.colors.text.muted,
    marginHorizontal: 16,
  },
  facePayButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 32,
  },
  facePayGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  facePayText: {
    ...theme.typography.button,
    fontSize: 17,
    fontFamily: 'SpaceGrotesk-SemiBold',
    letterSpacing: 0.3,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    ...theme.typography.body,
    fontSize: 15,
    color: theme.colors.text.secondary,
  },
  signupLink: {
    ...theme.typography.body,
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.accent,
  },
});

export default LoginScreen;