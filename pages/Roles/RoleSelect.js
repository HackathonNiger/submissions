import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import Header from "../../component/LandingPage/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Fontisto, Feather } from "@expo/vector-icons";
import { colors, fonts } from "../../Style/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ add this

const SCREEN_WIDTH = Dimensions.get("window").width;

export default class RoleSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerHeight: Platform.OS === "ios" ? 130 : 110,
      user: null, // ✅ store user here
    };
  }

  async componentDidMount() {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        this.setState({ user: JSON.parse(storedUser) });
      }
    } catch (error) {
      console.warn("Failed to load user data:", error);
    }
  }

  onHeaderLayout = (e) => {
    const { height } = e.nativeEvent.layout;
    if (height && height !== this.state.headerHeight) {
      this.setState({ headerHeight: height });
    }
  };

  handleRoleSelect = (role, description, iconType) => {
    const { navigation } = this.props;
    const { user } = this.state;

    navigation.navigate("Scan", {
      role,
      description,
      iconType,
      user, // ✅ pass stored user
    });
  };

  render() {
    const { headerHeight } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        {/* Fixed Header */}
        <View style={styles.headerWrapper} onLayout={this.onHeaderLayout}>
          <Header
            showBackButton={true}
            onBackPress={() => this.props.navigation.goBack()}
            showText={true}
          />
        </View>

        {/* Scrollable content */}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingTop: headerHeight + 8 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.MainContainer}>
            {/* Personal Role */}
            <TouchableOpacity
              style={styles.childContainer}
              onPress={() =>
                this.handleRoleSelect(
                  "Personal",
                  "Verify medication for personal use, track your health journey, and contribute to medication safety.",
                  "personal"
                )
              }
            >
              <View style={styles.innerContainer}>
                <View style={styles.wrapperIcon}>
                  <Ionicons
                    name="person-outline"
                    size={SCREEN_WIDTH * 0.09}
                    color="#AFD18B"
                  />
                </View>

                <Text style={[styles.Text, fonts.regular]}>
                  Verify medication for personal use, track your health journey,
                  and contribute to medication safety.
                </Text>

                <View style={styles.child}>
                  <View style={styles.childContent}>
                    <View
                      style={[
                        styles.Iconcategories,
                        { backgroundColor: "#dff7e98e" },
                      ]}
                    >
                      <Image
                        source={require("../../assets/pill (3).png")}
                        style={{ width: 20, height: 20, tintColor: "#2ecc71" }}
                      />
                    </View>
                    <Text style={styles.TextCategories}>Quick Verify</Text>
                  </View>

                  <View style={styles.childContent}>
                    <View style={[
                      
                      styles.Iconcategories,
                      { backgroundColor: "#f8fcf2c0" },
                    ]} 
                    
                    >
                      <Fontisto
                        name="stethoscope"
                        size={SCREEN_WIDTH * 0.06}
                        color="#9feb11c0"
                      />
                    </View>
                    <Text style={styles.TextCategories}>Health Tracking</Text>
                  </View>

                  <View style={styles.childContent}>
                    <View
                      style={[
                        styles.Iconcategories,
                        { backgroundColor: "#f7f3f3dc" },
                      ]}
                    >
                      <Image
                        source={require("../../assets/trust-wallet-token.png")}
                        style={{ width: 25, height: 25, tintColor: "#F2C0BD" }}
                      />
                    </View>
                    <Text style={styles.TextCategories}>Safety First</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Pharmacy Role */}
            <TouchableOpacity
              style={styles.childContainer}
              onPress={() =>
                this.handleRoleSelect(
                  "Pharmacist",
                  "Professional verification tools, batch scanning, audit logs, and comprehensive reporting features.",
                  "pharmacy"
                )
              }
            >
              <View style={styles.innerContainer}>
                <View style={styles.wrapperIcon}>
                  <Ionicons
                    name="scan"
                    size={SCREEN_WIDTH * 0.06}
                    color="#2ecc71"
                  />
                </View>

                <Text style={styles.HeadText}>I'm a Pharmacist</Text>

                <Text style={[styles.Text, fonts.regular]}>
                  Professional verification tools, batch scanning, audit logs,
                  and comprehensive reporting features.
                </Text>

                <View style={styles.child}>
                  <View style={styles.childContent}>
                    <View
                      style={[
                        styles.Iconcategories,
                        { backgroundColor: "#d9e6cc6b" },
                      ]}
                    >
                      <Feather
                        name="users"
                        size={SCREEN_WIDTH * 0.06}
                        color="#548A54"
                      />
                    </View>
                    <Text style={styles.TextCategories}>Batch Scan</Text>
                  </View>

                  <View  >
                    <View
                      style={[
                        styles.Iconcategories,
                        { backgroundColor: "#dee9d26b" },
                      ]}
                    >
                      <Image
                        source={require("../../assets/trust-wallet-token.png")}
                        style={{ width: 25, height: 25, tintColor: "#AFD18B" }}
                      />
                    </View>
                    <Text style={styles.TextCategories}>Audit Logs</Text>
                  </View>

                  <View style={styles.childContent}>
                    <View style={styles.Iconcategories}>
                      <Image
                        source={require("../../assets/trust-wallet-token.png")}
                        style={{ width: 25, height: 25, tintColor: "#AFD18B" }}
                      />
                    </View>
                    <Text style={styles.TextCategories}>Pro Tools</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// ✅ All your original styles stay the same
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
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
    justifyContent: "flex-start",
  },
  MainContainer: { width: "90%", gap: 9 },
  childContainer: {
    width: "100%",
    backgroundColor: colors.background,
    marginVertical: 10,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 10 },
      web: { boxShadow: "0px 10px 30px rgba(0,0,0,0.3)" },
    }),
  },
  TextCategories: {
    fontFamily: "sans-serif",
    fontSize: 11,
    color: "#7f8c8d",
    letterSpacing: 0.5,
  },
  innerContainer: { alignItems: "center", justifyContent: "center", gap: 10 },
  wrapperIcon: { width: 60, height: 60, borderRadius: 60, backgroundColor: "#dbe4d280", justifyContent: "center", alignItems: "center" },
  HeadText: { marginVertical: 5, fontFamily: "sans-serif", fontSize: 15, color: "#38da38ff", textAlign: "center" },
  Text: { textAlign: "center", lineHeight: 20 },
  child: { width: "90%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  childContent: { justifyContent: "center", alignItems: "center", gap: 10 },
  Iconcategories: { width: 40, height: 40, borderRadius: 60, justifyContent: "center", alignItems: "center" },
});
