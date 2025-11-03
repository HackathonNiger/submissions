import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Phone, ArrowRight } from 'lucide-react-native';
import GestPayInput from '../components/molecules/GestPayInput';
import BottomSheet from '../components/molecules/BottomSheet';
import GestPayPinPad from '../components/molecules/GestPayPinPad';
import Header from '../components/molecules/Header';
import theme from '../utils/theme';
import ScreenWrapper from '../components/layout/ScreenWrapper';

const SendMoneyScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSendMoney = () => {
    if (!phoneNumber || !amount) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setIsSummaryVisible(true);
  };

  const handleProceed = () => {
    setIsSummaryVisible(false);
    setIsPinVisible(true);
  };

  const handlePinComplete = async () => {
    if (pin.length === 4) {
      try {
        // Simulate API call for payment processing
        const response = await mockApiCall({ phoneNumber, amount, note, pin });
        console.log('Payment Response:', response);
        setIsPinVisible(false);
        setPin('');
        navigation.navigate('SendMoneySuccess', { phoneNumber, amount, note });
      } catch (error) {
        setError('Payment failed. Please try again.');
      }
    } else {
      setError('Please enter a 4-digit PIN');
    }
  };

  const handlePinNumber = (num) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handlePinBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const mockApiCall = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: 'Payment processed successfully' };
  };

  return (
    <ScreenWrapper>
      <Header variant="back" navigation={navigation} title="Send Money" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerSection}>
          <Text style={styles.titleText}>Send Money</Text>
          <Text style={styles.subtitleText}>
            Send money instantly to other GestPay users
          </Text>
        </View>

        <View style={styles.formContainer}>
          <GestPayInput
            label="Phone Number"
            placeholder="Enter recipient's phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            leftIcon={<Phone color={theme.colors.text.muted} size={20} />}
            required
          />

          <GestPayInput
            label="Amount"
            placeholder="Enter amount to send"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            required
          />

          <GestPayInput
            label="Note (Optional)"
            placeholder="Add a note for the recipient"
            value={note}
            onChangeText={setNote}
            maxLength={100}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.sendButton} onPress={handleSendMoney}>
            <View style={styles.buttonContainer}>
              <View style={styles.finTechPattern} />
              <Text style={styles.sendButtonText}>Send Money</Text>
              <ArrowRight color="#fff" size={20} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomSheet
        isVisible={isSummaryVisible}
        onClose={() => setIsSummaryVisible(false)}
        height="50%"
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.finTechPattern} />
          <Text style={styles.summaryTitle}>Transaction Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Recipient</Text>
            <Text style={styles.summaryValue}>{phoneNumber || 'N/A'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={styles.summaryValue}>₦{amount || '0.00'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Note</Text>
            <Text style={styles.summaryValue}>{note || 'None'}</Text>
          </View>
          <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
            <View style={styles.buttonContainer}>
              <View style={styles.finTechPattern} />
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </View>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      <BottomSheet
        isVisible={isPinVisible}
        onClose={() => {
          setIsPinVisible(false);
          setPin('');
        }}
        height="90%"
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.finTechPattern} />
          <Text style={styles.pinTitle}>Enter PIN</Text>
          <Text style={styles.pinSubtitle}>
            Enter your 4-digit PIN to confirm transfer
          </Text>
          <View style={styles.pinDisplay}>
            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pinDot,
                  index < pin.length ? styles.pinDotFilled : null,
                ]}
              />
            ))}
          </View>
          <GestPayPinPad
            onPressNumber={handlePinNumber}
            onPressBackspace={handlePinBackspace}
            allowBiometrics={true}
            onPressBiometric={() => {
              console.log('Biometric authentication attempted');
              // Handle biometric authentication
            }}
          />
        </View>
      </BottomSheet>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 32,
  },
  titleText: {
    ...theme.typography.heading,
    fontSize: 32,
    marginBottom: 8,
    letterSpacing: -0.5,
    color: theme.colors.text.primary,
  },
  subtitleText: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  formContainer: {
    marginTop: 16,
  },
  errorText: {
    ...theme.typography.caption,
    fontSize: 14,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 24,
  },
  sendButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    backgroundColor: theme.colors.primary,
    position: 'relative',
  },
  finTechPattern: {
    ...StyleSheet.absoluteFill,
    opacity: 0.05,
    backgroundColor: theme.colors.gray,
    backgroundImage: `linear-gradient(45deg, ${theme.colors.text.muted} 25%, transparent 25%, transparent 50%, ${theme.colors.text.muted} 50%, ${theme.colors.text.muted} 75%, transparent 75%, transparent)`,
    backgroundSize: 20,
  },
  sendButtonText: {
    ...theme.typography.button,
    fontSize: 17,
    color: "#fff",
    marginRight: 8,
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
    position: 'relative',
  },
  summaryTitle: {
    ...theme.typography.heading,
    fontSize: 24,
    marginBottom: 24,
    color: theme.colors.text.primary,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  summaryLabel: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  proceedButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 24,
    width: '100%',
  },
  proceedButtonText: {
    ...theme.typography.button,
    fontSize: 16,
    color: "#fff",
  },
  pinTitle: {
    ...theme.typography.heading,
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  pinSubtitle: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
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
});

export default SendMoneyScreen;