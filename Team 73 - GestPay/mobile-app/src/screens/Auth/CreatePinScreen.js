import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../utils/theme'; 
import GestPayPinPad from '../../components/molecules/GestPayPinPad'; 

const CreatePinScreen = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState('enter'); // 'enter', 'confirm', 'loading', 'success', 'error'
  const [error, setError] = useState(null);
  const pinLength = 4;

  const handlePressNumber = (num) => {
    if (step === 'enter' && pin.length < pinLength) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === pinLength) {
        setStep('confirm');
      }
    } else if (step === 'confirm' && confirmPin.length < pinLength) {
      const newConfirmPin = confirmPin + num;
      setConfirmPin(newConfirmPin);
      if (newConfirmPin.length === pinLength) {
        if (newConfirmPin === pin) {
          handleSubmitPin(newConfirmPin);
        } else {
          setError('PINs do not match. Please try again.');
          setStep('enter');
          setPin('');
          setConfirmPin('');
        }
      }
    }
  };

  const handlePressBackspace = () => {
    if (step === 'enter') {
      setPin(pin.slice(0, -1));
    } else if (step === 'confirm') {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const handlePressBiometric = () => {
    // Handle biometric authentication logic
    console.log('Biometric authentication attempted');
    setError('Biometric setup not supported for PIN creation.');
  };

  const handleSubmitPin = async (pin) => {
    setStep('loading');
    try {
      // Simulate API request
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success or failure (80% success rate for demo)
          Math.random() > 0.2
            ? resolve({ success: true, message: 'PIN saved successfully' })
            : reject(new Error('Failed to save PIN'));
        }, 2000); // 2-second delay
      });
      setStep('success');
      // Optionally navigate to next screen
      setTimeout(() => navigation.navigate('NextScreen'), 1000); // Adjust 'NextScreen' as needed
    } catch (err) {
      setError(err.message);
      setStep('error');
      setPin('');
      setConfirmPin('');
    }
  };

  const handleRetry = () => {
    setError(null);
    setPin('');
    setConfirmPin('');
    setStep('enter');
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
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.titleText}>
              {step === 'enter' ? 'Create PIN' : step === 'confirm' ? 'Confirm PIN' : 'Processing'}
            </Text>
            <Text style={styles.subtitleText}>
              {step === 'enter'
                ? `Enter a ${pinLength}-digit PIN`
                : step === 'confirm'
                ? `Re-enter your ${pinLength}-digit PIN to confirm`
                : step === 'loading'
                ? 'Saving your PIN...'
                : step === 'success'
                ? 'PIN saved successfully!'
                : 'An error occurred'}
            </Text>
          </View>

          {/* PIN Display */}
          <View style={styles.pinDisplay}>
            {[...Array(pinLength)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pinDot,
                  index < (step === 'enter' ? pin.length : confirmPin.length)
                    ? styles.pinDotFilled
                    : null,
                ]}
              />
            ))}
          </View>

          {/* Error Message */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Loading or Success State */}
          {step === 'loading' && (
            <ActivityIndicator
              size="large"
              color={theme.colors.accent}
              style={styles.loader}
            />
          )}
          {step === 'success' && (
            <Text style={styles.successText}>Success! Redirecting...</Text>
          )}

          {/* PIN Pad or Retry Button */}
          {step !== 'loading' && step !== 'success' && (
            <GestPayPinPad
              onPressNumber={handlePressNumber}
              onPressBackspace={handlePressBackspace}
              onPressBiometric={handlePressBiometric}
              allowBiometrics={false} // Biometrics disabled for PIN creation
            />
          )}

          {/* Retry Button for Error State */}
          {step === 'error' && (
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <LinearGradient
                colors={[theme.colors.gradient.start, theme.colors.gradient.middle]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 48,
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
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 48,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.gray,
    marginHorizontal: 8,
  },
  pinDotFilled: {
    backgroundColor: theme.colors.accent,
  },
  errorText: {
    ...theme.typography.caption,
    fontSize: 14,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 24,
  },
  successText: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.success,
    textAlign: 'center',
    marginBottom: 24,
  },
  loader: {
    marginBottom: 24,
  },
  retryButton: {
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
  retryButtonText: {
    ...theme.typography.button,
    fontSize: 17,
    fontFamily: 'SpaceGrotesk-SemiBold',
    letterSpacing: 0.3,
  },
  backToLogin: {
    alignSelf: 'center',
    marginTop: 32,
  },
  backToLoginText: {
    ...theme.typography.body,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: theme.colors.accent,
  },
});

export default CreatePinScreen;