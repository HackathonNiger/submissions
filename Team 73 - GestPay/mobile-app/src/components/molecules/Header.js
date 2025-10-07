import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { ArrowLeft, Bell, ChevronLeft, User } from "lucide-react-native";
import theme from "../../utils/theme"; // Adjust path if necessary
import { useNavigation } from "@react-navigation/native";

const Header = ({
  variant = "default", // 'default', 'back', 'custom', 'logo-actions'
  title,

  customContent,
  onBackPress,
  onNotificationPress,
  onUserPress,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {variant === "back" && navigation && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress || (() => navigation.goBack())}
          >
            <ChevronLeft
              color={theme.colors.text.primary}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
        )}
        {variant === "logo-actions" && (
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/logo.png")} // Adjust path to your logo
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>GestPay</Text>
          </View>
        )}
        {variant === "default" && title && (
          <Text style={styles.title}>{title}</Text>
        )}
        {variant === "custom" && customContent && (
          <View style={styles.customContent}>{customContent}</View>
        )}
        {variant === "logo-actions" && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={()=> navigation.navigate('Notifications')}
            >
              <Bell
                color={theme.colors.text.primary}
                size={24}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={()=> navigation.navigate('Settings')}>
              <User
                color={theme.colors.text.primary}
                size={24}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface, // Light background for Material Design
    paddingTop: Platform.OS === "ios" ? 44 : 29, // Account for status bar
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray + "33", // Subtle border
    shadowColor: theme.colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
  logoText: {
    ...theme.typography.heading,
    fontSize: 24,
    letterSpacing: -0.5,
  },
  title: {
    ...theme.typography.heading,
    fontSize: 20,
    color: theme.colors.primary,
    flex: 1,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  customContent: {
    flex: 1,
    alignItems: "center",
  },
});

export default Header;
