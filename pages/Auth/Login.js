import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  PixelRatio
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../component/LandingPage/Header';
import { colors, fonts } from '../../Style/Theme';
import { Ionicons, Feather } from '@expo/vector-icons';
import { handleLogin, handleBiometricLogin, handlePasskeyLogin } from '../../Utils/AuthUtils';

const { width, height } = Dimensions.get('window');
const scale = width / 375;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: false,
    };
  }

  togglePasswordVisibility = () => {
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  render() {
    const { email, password, showPassword } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <Header
            showText={true}
            headerText="Secure access to your health verification platform"
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.centerContainer}>
              <View style={styles.LoginContainer}>
                <View>
                  <Text style={[styles.TextTittle, fonts.bold]}>Welcome Back</Text>
                  <Text style={[styles.TextTittle, fonts.regular]}>
                    Access your health verification tools
                  </Text>
                </View>

                {/* Email Field */}
                <View>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.textLight}
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={email}
                      onChangeText={(text) => this.setState({ email: text })}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="patient@example.com"
                      placeholderTextColor={colors.placeHolder}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                </View>

                {/* Password Field */}
                <View>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={colors.textLight}
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={password}
                      onChangeText={(text) => this.setState({ password: text })}
                      secureTextEntry={!showPassword}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.placeHolder}
                      underlineColorAndroid="transparent"
                    />
                    <TouchableOpacity
                      onPress={this.togglePasswordVisibility}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={colors.textLight}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLogin({
                    email: email,
                    password: password,
                    navigation: this.props.navigation
                  })}
                >
                  <Text style={[styles.buttonText, styles.sign]}>Sign in</Text>
                </TouchableOpacity>

                {/* Separator */}
                <View style={styles.separatorContainer}>
                  <View style={styles.line} />
                  <Text style={styles.separatorText}>OR CONTINUE WITH</Text>
                  <View style={styles.line} />
                </View>

                {/* Scanning & PassKey Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleBiometricLogin(this.props.navigation)}
                  >
                    <Ionicons name="finger-print-outline" size={24} color={colors.textLight} />
                    <Text style={styles.buttonText}>Scanning</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handlePasskeyLogin(this.props.navigation)}
                  >
                    <Feather name="key" size={24} color={colors.textLight} />
                    <Text style={styles.buttonText}>PassKey</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.DemoText}>
                  <Text style={styles.Demo}>Demo: patient@example.com / password 123</Text>
                </View>

                {/* Signup Link */}
                <TouchableOpacity
                  style={styles.RegisterButton}
                  onPress={() => this.props.navigation.navigate("Signup")}
                >
                  <Text style={styles.buttonText}>Don't have account? </Text>
                  <Text style={styles.DownBtn}>Signup</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerWrapper: {
    width: '100%',
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: height * 0.25,
    paddingBottom: height * 0.05,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  LoginContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.background,
    padding: 20 * scale,
    borderRadius: 20,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.45, shadowRadius: 15 },
      android: { elevation: 35 },
      web: { boxShadow: "0px 20px 50px rgba(0,0,0,0.6)" },
    }),
  },
  TextTittle: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: PixelRatio.getFontScale() * 18,
  },
  label: { fontSize: PixelRatio.getFontScale() * 14, marginBottom: 5 },
  
  // ⬇️ Updated input field styles to match Signup page
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: 50,
  },
  textInput: {
    flex: 1,
    fontSize: PixelRatio.getFontScale() * 14,
    color: colors.textLight,
  },
  icon: { marginRight: 10 },
  eyeIcon: { marginLeft: 10 },

  button: {
    borderWidth: 0.5,
    borderColor: colors.textLight,
    borderRadius: 20,
    paddingVertical: 12,
    marginVertical: 10,
    backgroundColor: colors.logButton,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.textLight,
    fontSize: PixelRatio.getFontScale() * 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 10,
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sign: { color: colors.background, letterSpacing: 2 },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: '#ccc' },
  separatorText: {
    marginHorizontal: 10,
    color: '#888',
    fontWeight: 'bold',
    fontSize: PixelRatio.getFontScale() * 13,
  },
  DemoText: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  Demo: {
    fontSize: PixelRatio.getFontScale() * 12,
    letterSpacing: 0.5,
    fontFamily: "sans-serif",
    color: "#737a73ff",
  },
  RegisterButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: 'wrap',
  },
  DownBtn: {
    color: "#A0C491",
    letterSpacing: 1,
    fontSize: PixelRatio.getFontScale() * 14,
  }
});
