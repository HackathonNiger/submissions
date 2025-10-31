import React, { Component } from "react";
import { View, TouchableOpacity, Platform, StyleSheet, Text, Image,  PixelRatio } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from '../../Style/Theme';

export default class Header extends Component {
  render() {
    const { showBackButton, onBackPress, showText, headerText } = this.props;

    const defaultText =
      "Select your role to personalize your medication verification experience";

    return (
      <View style={styles.head}>
        {/* Back Button */}
        {showBackButton && onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textColor} />
          </TouchableOpacity>
        )}

        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/trust-wallet-token.png")}
            style={{ width: 50, height: 50 }}
            tintColor="#AFD18B" 
          />
        </View>

        {/* Conditional Text */}
        {showText && (
          <Text style={styles.headerText}>
            {headerText || defaultText}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  head: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 20,
    backgroundColor: "#F3FEF3",
    justifyContent: "flex-start",
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 12 },
      android: { elevation: 12 },
      web: { boxShadow: "0px 8px 25px rgba(0,0,0,0.35)" },
    }),
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: Platform.OS === "ios" ? 50 : 25,
    zIndex: 20,
  },
  headerText: {
    textAlign: "center",
    fontSize: PixelRatio.getFontScale() * 12,
    marginTop: 15,
    ...fonts.regular,
    color: colors.textLight,
    numberOfLines: 1,           // 🚫 Doesn't go here (style prop doesn’t support it)
    includeFontPadding: false,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 60,
    backgroundColor: "#ecffecff",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
      android: { elevation: 6 },
      web: { boxShadow: "0px 4px 15px rgba(0,0,0,0.25)" },
    }),
  },
});
