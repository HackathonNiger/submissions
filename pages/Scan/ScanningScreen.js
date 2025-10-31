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
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fonts } from "../../Style/Theme";

// Import your existing mockData.json
const mockData = require("./mockData.json");

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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

    const product = mockData.find((item) => item.nafdac_reg_no === code);

    let result;
    if (product) {
      result = {
        valid: true,
        product,
        date: new Date().toISOString(),
        productName: product.product_name,
        manufacturer: product.manufacturer,
      };
    } else {
      result = {
        valid: false,
        message: "Product not found in mock data.",
        date: new Date().toISOString(),
      };
    }

    try {
      const storedScans = await AsyncStorage.getItem("scannedDrugs");
      const scans = storedScans ? JSON.parse(storedScans) : [];
      scans.unshift(result); // latest scan on top
      await AsyncStorage.setItem("scannedDrugs", JSON.stringify(scans));
    } catch (err) {
      console.error("Error saving scanned drug:", err);
    }

    this.setState({ verifying: false, result });
    this.props.navigation.navigate("Scan", { scannedResult: result });
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

        // simulate QR code detection for mock demo
        const code = prompt("Enter QR code value from mock data for demo:");
        if (code) this.verifyDrug(code);
      };
      input.click();
    } else {
      alert("Image upload is currently supported only on web.");
    }
  };

  renderResult = () => {
    const { result } = this.state;
    if (!result) return null;

    if (!result.valid) {
      return (
        <View style={styles.resultContainer}>
          <Text style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>
            {result.message}
          </Text>
        </View>
      );
    }

    const product = result.product;
    const isExpired = product.verification_status === "expired";

    return (
      <View style={styles.resultContainer}>
        <Image
          source={{ uri: product.product_image_url }}
          style={styles.productImage}
        />
        <Text style={styles.productName}>{product.product_name}</Text>
        <Text>Manufacturer: {product.manufacturer}</Text>
        <Text>Active Ingredient: {product.active_ingredient}</Text>
        <Text>Dosage Form: {product.dosage_form}</Text>
        <Text style={{ fontWeight: "bold", color: isExpired ? "red" : "green" }}>
          Status: {product.verification_status.toUpperCase()}
        </Text>
        <Text>Batch No: {product.batch_no}</Text>
        <Text>Production Date: {product.production_date}</Text>
        <Text>Expiry Date: {product.expiry_date}</Text>
      </View>
    );
  };

  render() {
    const { hasPermission, scanning, verifying } = this.state;
    const scanLineTranslate = this.scanLineAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 250],
    });

    return (
      <SafeAreaView style={styles.container}>
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

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.content}>
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

          {!scanning && !verifying && !this.state.result && (
            <>
              <TouchableOpacity style={styles.scanButton} onPress={this.startScan}>
                <Ionicons name="scan" size={SCREEN_WIDTH * 0.04} color="#eaf7efff" />
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

          {!scanning && !verifying && this.state.result && this.renderResult()}

          <View style={{ height: 140 }} /> {/* Space for bottom tips */}
        </ScrollView>

        {/* Scanning Tips pinned at bottom */}
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
      </SafeAreaView>
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
  content: { alignItems: "center", paddingBottom: 150 },
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
  cameraContainer: { width: "100%", height: 300, marginBottom: 20, position: "relative" },
  camera: { flex: 1, borderRadius: 10, overflow: "hidden" },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
  frameOuter: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1 },
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
  scanInstruction: { marginTop: 10, color: "#075f5f", fontWeight: "bold", textAlign: "center" },
  scanningText: { textAlign: "center", marginTop: 5, fontWeight: "bold", color: "#075f5f" },
  scanButton: { width: "80%", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 10, padding: 10, backgroundColor: "#0fa3a3ff", borderRadius: 15 },
  scanButtonText: { color: "#eaf7efff", fontWeight: "bold" },
  uploadButton: { flexDirection: "row", justifyContent: "center", alignItems: "center", width: "80%", marginTop: 10, padding: 10, backgroundColor: "#f0fcfc", borderRadius: 15, borderWidth: 1, borderColor: "#bbf0f0ff" },
  uploadButtonText: { color: "#075f5f", fontWeight: "bold" },
  choose: { marginTop: 20 },
  resultContainer: { marginTop: 20, width: "90%", padding: 15, borderRadius: 12, backgroundColor: "#f0fcfcff", borderWidth: 1, borderColor: "#cceaea", alignItems: "center" },
  productImage: { width: 100, height: 100, marginBottom: 10 },
  productName: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  tipsContainer: { 
    position: "absolute", 
    bottom: 15, 
    left: 15, 
    right: 15, 
    backgroundColor: "#f0fcfcff", 
    borderTopWidth: 1, 
    borderColor: "#cceaea", 
    padding: 15, 
    borderRadius: 12,
  },
  tipsTitle: { fontSize: 14, fontWeight: "bold", color: "#075f5f", marginBottom: 8 },
  tipsText: { fontSize: 12, color: "#046868ff", marginBottom: 4 },
});
