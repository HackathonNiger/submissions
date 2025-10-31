import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../component/LandingPage/Header";
import { handleSignup } from "../../Utils/AuthUtils";
import { colors } from "../../Style/Theme";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerHeight: Platform.OS === "ios" ? 130 : 110,
      name: "",
      email: "",
      password: "",
      showPassword: false,
      errors: {},
    };
  }

  onHeaderLayout = (e) => {
    const { height } = e.nativeEvent.layout;
    if (height && height !== this.state.headerHeight) {
      this.setState({ headerHeight: height });
    }
  };

  validateFields = () => {
    const { name, email, password } = this.state;
    const errors = {};

    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email format";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSignupPress = () => {
    if (!this.validateFields()) return;
    const { name, email, password } = this.state;
    handleSignup({ name, email, password, navigation: this.props.navigation });
  };

  render() {
    const {
      headerHeight,
      name,
      email,
      password,
      showPassword,
      errors,
    } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        {/* Fixed Header */}
        <View style={styles.headerWrapper} onLayout={this.onHeaderLayout}>
          <Header
            showBackButton={true}
            onBackPress={() => this.props.navigation.goBack()}
            title="Sign Up"
          />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingTop: headerHeight + 8 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.text}>Create Your Account</Text>
            <Text style={styles.subText}>
              Register below to start your journey.
            </Text>

            {/* Name Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  errors.name && { borderColor: "#ff6b6b" },
                ]}
                placeholder="Full Name"
                placeholderTextColor="#A0C491"
                value={name}
                onChangeText={(text) => this.setState({ name: text })}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  errors.email && { borderColor: "#ff6b6b" },
                ]}
                placeholder="Email Address"
                placeholderTextColor="#A0C491"
                value={email}
                onChangeText={(text) => this.setState({ email: text })}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    errors.password && { borderColor: "#ff6b6b" },
                  ]}
                  placeholder="Password"
                   placeholderTextColor="#A0C491"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => this.setState({ password: text })}
                />
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ showPassword: !showPassword })
                  }
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleSignupPress}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Login Redirect */}
            <TouchableOpacity
              onPress={() => this.props.navigation.replace("Login")}
            >
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text style={styles.linkText}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    width: "100%",
    backgroundColor: colors.background,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    elevation: 50,
  },
  scrollContainer: {
    paddingBottom: 50,
    alignItems: "center",
  },
  content: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    marginVertical: 80,
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.45, shadowRadius: 15 },
      android: { elevation: 35 },
      web: { boxShadow: "0px 20px 50px rgba(0,0,0,0.6)" },
    }),
  },
  text: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1e8b4cff",
    textAlign: "center",
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1e8b4cff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 13,
    marginTop: 4,
  },
  loginText: {
    color: "#555",
    fontSize: 14,
    marginTop: 15,
  },
  linkText: {
    color: "#A0C491",
    fontWeight: "bold",
  },
});
