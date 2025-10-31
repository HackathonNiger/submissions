import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  Octicons,
  EvilIcons,
  FontAwesome5,
  Fontisto,
} from "@expo/vector-icons";

import Gradient from "../Buttons/Gradient";
import Header from "../../component/LandingPage/Header";
import { colors } from "../../Style/Theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const scale = isWeb ? Math.min(SCREEN_WIDTH / 375, 1) : 1;

// Relative sizes
const TOP_BUTTON_WIDTH = ((SCREEN_WIDTH - 60) / 3) * scale;
const SUB_BUTTON_WIDTH = (SCREEN_WIDTH / 3.5) * scale;

export default class Menue extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <Header />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          <View style={styles.menue}>
            <Text style={styles.headerText}>
              Health care verification platform
            </Text>
            <Text style={styles.subHeaderText}>
              Protecting communities through advanced medication authentication
              technology
            </Text>

            {/* Top buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { width: TOP_BUTTON_WIDTH }]}
              >
                <View style={[styles.iconWrapper, styles.scan]}>
                  <Ionicons
                    name="scan"
                    size={SCREEN_WIDTH * 0.06 * scale}
                    color="#2ecc71"
                  />
                </View>
                <Text style={styles.buttonText}>Smart Scan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { width: TOP_BUTTON_WIDTH }]}
              >
                <View style={[styles.iconWrapper, styles.verify]}>
                  <Octicons
                    name="verified"
                    size={SCREEN_WIDTH * 0.06 * scale}
                    color="#2ecc71"
                  />
                </View>
                <Text style={styles.buttonText}>Instant Verify</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { width: TOP_BUTTON_WIDTH }]}
              >
                <View style={[styles.iconWrapper, styles.health]}>
                  <EvilIcons
                    name="heart"
                    size={SCREEN_WIDTH * 0.08 * scale}
                    color="#2ecc71"
                  />
                </View>
                <Text style={styles.buttonText}>Health First</Text>
              </TouchableOpacity>
            </View>

            {/* Sub-buttons */}
            <View style={styles.subhead}>
              {/* Protected Lives */}
              <TouchableOpacity
                style={[
                  styles.subButton,
                  {
                    width: SUB_BUTTON_WIDTH,
                    height: SUB_BUTTON_WIDTH * 0.7,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <FontAwesome5
                    name="user-friends"
                    size={SCREEN_WIDTH * 0.03 * scale}
                    color="#34495e"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.subButtonText}>Protected Lives</Text>
                </View>
              </TouchableOpacity>

              {/* Countries */}
              <TouchableOpacity
                style={[
                  styles.subButton,
                  {
                    width: SUB_BUTTON_WIDTH,
                    height: SUB_BUTTON_WIDTH * 0.7,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Fontisto
                    name="world-o"
                    size={SCREEN_WIDTH * 0.03 * scale}
                    color="rgba(12, 159, 154, 0.7)"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.subButtonText}>Countries</Text>
                </View>
                <Text style={styles.subButtonText}>45+</Text>
              </TouchableOpacity>
            </View>

            {/* Mission */}
            <View style={styles.Missioncontainer}>
              <View style={[styles.iconWrapper, styles.health]}>
                <EvilIcons
                  name="heart"
                  size={SCREEN_WIDTH * 0.08 * scale}
                  color="#2ecc71"
                />
              </View>
              <Text style={styles.MissionText}>Our Mission</Text>
              <Text style={styles.MissionParagraph}>
                Empowering healthcare communities with nature-inspired
                technology that ensures medication authenticity, promotes
                healthy practices, and creates a safer world for everyone.
              </Text>
            </View>

            {/* Gradient button with image */}
            <Gradient
              title="Begin Health Journey"
              onPress={() => this.props.navigation.navigate("RoleSelect")}
              style={{
                width: SCREEN_WIDTH * 0.9 * scale,
                height: SCREEN_HEIGHT * 0.05 * scale,
                marginVertical: SCREEN_HEIGHT * 0.02 * scale,
              }}
              Image={
                <Image
                  source={require("../../assets/trust-wallet-token.png")}
                  style={{
                    width: 15 * scale,
                    height: 15 * scale,
                  }}
                  tintColor="#fff"
                />
              }
            />

            {/* Footer */}
            <View style={styles.Downtext}>
              <Text
                style={{
                  fontSize: 10,
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                Join millions protecting medication authenticity worldwide
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  menue: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SCREEN_WIDTH * 0.05 * scale,
    maxWidth: isWeb ? 500 : "100%",
    alignSelf: "center",
  },
  headerText: {
    fontSize: SCREEN_WIDTH * 0.055 * scale,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
    opacity: 0.5,
    marginBottom: SCREEN_HEIGHT * 0.01 * scale,
  },
  subHeaderText: {
    fontSize: SCREEN_WIDTH * 0.04 * scale,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: SCREEN_HEIGHT * 0.04 * scale,
    lineHeight: SCREEN_WIDTH * 0.05 * scale,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: SCREEN_HEIGHT * 0.015 * scale,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: SCREEN_HEIGHT * 0.018 * scale,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: { elevation: 12 },
      web: { boxShadow: "0px 8px 25px rgba(0,0,0,0.35)" },
    }),
  },
  iconWrapper: {
    width: SCREEN_WIDTH * 0.14 * scale,
    height: SCREEN_WIDTH * 0.14 * scale,
    borderRadius: (SCREEN_WIDTH * 0.14 * scale) / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  scan: { backgroundColor: "rgba(220, 229, 232, 0.3)" },
  verify: { backgroundColor: "rgba(206, 242, 241, 0.3)" },
  health: { backgroundColor: "rgba(228, 237, 237, 0.3)" },
  buttonText: {
    fontSize: SCREEN_WIDTH * 0.035 * scale,
    fontWeight: "500",
    color: "#34495e",
  },
  subhead: {
    flexDirection: "row",
    gap: 15,
    flexWrap: "wrap",
    width: "100%",
    marginTop: SCREEN_HEIGHT * 0.02 * scale,
  },
  subButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.background,
    marginBottom: SCREEN_HEIGHT * 0.02 * scale,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
      web: { boxShadow: "0px 4px 30px rgba(0,0,0,0.3)" },
    }),
  },
  subButtonText: {
    fontSize: SCREEN_WIDTH * 0.03 * scale,
    fontWeight: "500",
    color: "#34495e",
    textAlign: "center",
    letterSpacing: 1,
  },
  Missioncontainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: SCREEN_WIDTH * 0.07 * scale,
    width: "100%",
    borderRadius: 20,
    margin: SCREEN_HEIGHT * 0.012 * scale,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: { elevation: 10 },
      web: { boxShadow: "0px 10px 30px rgba(0,0,0,0.3)" },
    }),
  },
  MissionText: {
    fontSize: SCREEN_WIDTH * 0.045 * scale,
    fontWeight: "600",
    marginVertical: SCREEN_HEIGHT * 0.01 * scale,
    color: "#10793cff",
  },
  MissionParagraph: {
    textAlign: "center",
    lineHeight: SCREEN_WIDTH * 0.055 * scale,
    fontSize: SCREEN_WIDTH * 0.036 * scale,
    color: "#34495e",
  },
  Downtext: {
    marginBottom: 15,
  },
});



