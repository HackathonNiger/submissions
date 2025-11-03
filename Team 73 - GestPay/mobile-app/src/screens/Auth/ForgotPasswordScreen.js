import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowLeft, ChevronLast, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useToast } from '../../components/Toast';
import theme from '../../utils/theme';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);

  const handleResetPassword = () => {
    // Handle password reset logic
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // TODO: Implement actual password reset API call
    toast.success('If an account with this email exists, you will receive a password reset link shortly.');
    setTimeout(() => navigation.goBack(), 2000);
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
          {/* Header Section */}
          <View style={styles.headerSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft
                color={theme.colors.accent}
                size={24}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <Text style={styles.titleText}>Forgot Password</Text>
            <Text style={styles.subtitleText}>
              Enter your email to receive a password reset link
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

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleResetPassword}
            >
              <LinearGradient
                colors={[theme.colors.gradient.start, theme.colors.gradient.middle]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitButtonText}>Send Reset Link</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Back to Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Remembered your password? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Back to Login</Text>
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
  headerSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 16,
  },
  titleText: {
    ...theme.typography.heading,
    fontSize: 32,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleText: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
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
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    ...theme.typography.button,
    fontSize: 17,
    fontFamily: 'SpaceGrotesk-SemiBold',
    letterSpacing: 0.3,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...theme.typography.body,
    fontSize: 15,
    color: theme.colors.text.secondary,
  },
  loginLink: {
    ...theme.typography.body,
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.accent,
  },
});

export default ForgotPasswordScreen;