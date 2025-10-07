import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { fonts } from "../../Style/Theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ✅ Set your backend base URL here
const BASE_URL = "https://your-backend.com";

let QrReader;
if (Platform.OS === "web") {
  QrReader = require("react-qr-reader").QrReader;
}

export default class ScanningScreen extends Component {
  state = {
    hasPermission: null,
    scanning: false,
    qrData: null,
    verifying: false,
    result: null,
  };

  cameraRef = null;
  scanLineAnim = new Animated.Value(0);

  async componentDidMount() {
    if (Platform.OS !== "web") {
      const { status } = await Camera.requestCameraPermissionsAsync();
      this.setState({ hasPermission: status === "granted" });
    }
  }

  startScan = () => {
    if (Platform.OS !== "web" && this.state.hasPermission === null) return;
    this.setState({ scanning: true, qrData: null, result: null }, () => {
      if (Platform.OS !== "web") this.startScanAnimation();
    });
  };

  stopScan = () => {
    this.setState({ scanning: false });
  };

  startScanAnimation = () => {
    this.scanLineAnim.setValue(0);
    Animated.loop(
      Animated.timing(this.scanLineAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  verifyDrug = async (code) => {
    this.setState({ verifying: true, scanning: false });

    try {
      const response = await fetch(`${BASE_URL}/api/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      this.setState({ verifying: false, result });

      // ✅ Send result back to Scan screen
      this.props.navigation.navigate("Scan", { scannedResult: result });
    } catch (error) {
      console.error("Verification error:", error);
      this.setState({
        verifying: false,
        result: { valid: false, message: "Network or server error." },
      });
      this.props.navigation.navigate("Scan", {
        scannedResult: { valid: false, message: "Network or server error." },
      });
    }
  };

  handleScanWeb = (data) => {
    if (data) {
      this.setState({ qrData: data, scanning: false });
      this.verifyDrug(data);
    }
  };

  handleMobileScan = ({ data }) => {
    this.stopScan();
    this.setState({ qrData: data });
    this.verifyDrug(data);
  };

  handleUploadImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageData = e.target.result;

          try {
            const response = await fetch(`${BASE_URL}/api/decode`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ image: imageData }),
            });

            const result = await response.json();

            if (result.code) {
              this.verifyDrug(result.code);
            } else {
              alert("No QR code detected in the image.");
            }
          } catch (error) {
            console.error(error);
            alert("Error uploading image.");
          }
        };
        reader.readAsDataURL(file);
      };

      input.click();
    } else {
      alert("Image upload is currently supported only on web.");
    }
  };

  render() {
    const { hasPermission, scanning, verifying } = this.state;
    const scanLineTranslate = this.scanLineAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 250],
    });

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={20} color="#075f5f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.contentHeadText, fonts.bold]}>
            Position QR Code
          </Text>
          <Text style={[styles.contentDescriptionText, fonts.bold]}>
            Align the QR code within the frame to verify the drug
          </Text>

          {Platform.OS === "web" && scanning && (
            <View style={styles.cameraContainer}>
              <QrReader
                onResult={(result) => this.handleScanWeb(result?.text)}
                constraints={{ facingMode: "environment" }}
                style={{ width: "100%", height: 300 }}
              />
              <Text style={styles.scanningText}>Scanning...</Text>
            </View>
          )}

          {Platform.OS !== "web" && scanning && hasPermission && (
            <View style={styles.cameraContainer}>
              <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                ref={(ref) => (this.cameraRef = ref)}
                onBarCodeScanned={this.handleMobileScan}
              />
              <View style={styles.overlay}>
                <View style={styles.frameOuter} />
                <View style={styles.scanFrame}>
                  <Animated.View
                    style={[
                      styles.scanLine,
                      { transform: [{ translateY: scanLineTranslate }] },
                    ]}
                  />
                  <View style={styles.centerIconContainer}>
                    <MaterialIcons
                      name="qr-code-scanner"
                      size={70}
                      color="#00FF00"
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.scanInstruction}>
                Align QR code inside the frame
              </Text>
            </View>
          )}

          {!scanning && !verifying && (
            <>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={this.startScan}
              >
                <Ionicons
                  name="scan"
                  size={SCREEN_WIDTH * 0.04}
                  color="#eaf7efff"
                />
                <Text style={styles.scanButtonText}>Start Scan</Text>
              </TouchableOpacity>

              <Text style={styles.choose}>Or</Text>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={this.handleUploadImage}
              >
                <Text style={styles.uploadButtonText}>Upload QR Image</Text>
              </TouchableOpacity>
            </>
          )}

          {verifying && (
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator size="large" color="#075f5f" />
              <Text style={styles.scanningText}>Verifying drug...</Text>
            </View>
          )}
        </View>

        {/* Scanning Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>📸 Scanning Tips</Text>
          <Text style={styles.tipsText}>
            • Ensure the QR code is clear and well-lit.
          </Text>
          <Text style={styles.tipsText}>
            • Hold your device steady while scanning.
          </Text>
          <Text style={styles.tipsText}>
            • Avoid glare or reflection on the code.
          </Text>
          <Text style={styles.tipsText}>
            • Make sure the QR code fits entirely in the frame.
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#f0fcfcff",
  },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 15, fontWeight: "bold", color: "#075f5f" },
  content: { marginTop: 20, alignItems: "center", flex: 1 },
  contentHeadText: {
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1,
    color: "#012e12ff",
  },
  contentDescriptionText: {
    textAlign: "center",
    letterSpacing: 1,
    fontSize: 12,
    color: "#046868ff",
    marginBottom: 20,
  },
  cameraContainer: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    position: "relative",
  },
  camera: { flex: 1, borderRadius: 10, overflow: "hidden" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  frameOuter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#075f5f",
    borderRadius: 12,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    overflow: "hidden",
    zIndex: 2,
  },
  scanLine: { width: "100%", height: 2, backgroundColor: "#00FF00" },
  centerIconContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -35 }, { translateY: -35 }],
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  scanInstruction: {
    marginTop: 10,
    color: "#075f5f",
    fontWeight: "bold",
    textAlign: "center",
  },
  scanningText: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
    color: "#075f5f",
  },
  scanButton: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: "#0fa3a3ff",
    borderRadius: 15,
  },
  scanButtonText: { color: "#eaf7efff", fontWeight: "bold" },
  uploadButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0fcfc",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#bbf0f0ff",
  },
  uploadButtonText: { color: "#075f5f", fontWeight: "bold" },
  choose: { marginTop: 20 },
  tipsContainer: {
    backgroundColor: "#f0fcfcff",
    borderWidth: 1,
    borderColor: "#cceaea",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 25,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#075f5f",
    marginBottom: 8,
  },
  tipsText: { fontSize: 12, color: "#046868ff", marginBottom: 4 },
});
