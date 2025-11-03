import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../utils/theme"; // Adjust path if necessary
import GestPayPinPad from "../../components/molecules/GestPayPinPad";
import ScreenWrapper from "../../components/layout/ScreenWrapper";

const PinEntryScreen = ({ navigation }) => {
  const [pin, setPin] = useState("");
  const pinLength = 4; // Or 6, configurable

  const handlePressNumber = (num) => {
    if (pin.length < pinLength) {
      setPin(pin + num);
    }
    if (pin.length + 1 === pinLength) {
      // Handle PIN submission logic
      console.log("PIN entered:", pin + num);
      // e.g., navigation.navigate('NextScreen');
    }
  };

  const handlePressBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handlePressBiometric = () => {
    // Handle biometric authentication logic
    console.log("Biometric authentication");
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              <Text style={styles.titleText}>Enter PIN</Text>
              <Text style={styles.subtitleText}>
                Please enter your {pinLength}-digit PIN to continue
              </Text>
            </View>

            {/* PIN Display */}
            <View style={styles.pinDisplay}>
              {[...Array(pinLength)].map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.pinDot,
                    index < pin.length ? styles.pinDotFilled : null,
                  ]}
                />
              ))}
            </View>

            {/* PIN Pad */}
            <GestPayPinPad
              onPressNumber={handlePressNumber}
              onPressBackspace={handlePressBackspace}
              onPressBiometric={handlePressBiometric}
              allowBiometrics={true} // Set to false to disable
            />

            {/* Forgot PIN */}
            <TouchableOpacity style={styles.forgotPin}>
              <Text style={styles.forgotPinText}>Forgot PIN?</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </ScreenWrapper>
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
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
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
    textAlign: "center",
  },
  pinDisplay: {
    flexDirection: "row",
    justifyContent: "center",
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
  forgotPin: {
    alignSelf: "center",
    marginTop: 32,
  },
  forgotPinText: {
    ...theme.typography.body,
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: theme.colors.accent,
  },
});

export default PinEntryScreen;
