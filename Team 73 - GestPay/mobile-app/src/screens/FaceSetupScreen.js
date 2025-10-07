import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { CheckCircle, AlertCircle } from "lucide-react-native";
import theme from "../utils/theme";
import Header from "../components/molecules/Header";

const FacePaySetupScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const cameraRef = React.useRef(null);

  const livenessSteps = [
    {
      id: 1,
      instruction: "Look directly at the camera",
      duration: 2000,
      icon: "👀",
    },
    {
      id: 2,
      instruction: "Blink your eyes twice",
      duration: 3000,
      icon: "😉",
    },
    {
      id: 3,
      instruction: "Turn your head slightly left",
      duration: 2500,
      icon: "👈",
    },
    {
      id: 4,
      instruction: "Turn your head slightly right",
      duration: 2500,
      icon: "👉",
    },
    {
      id: 5,
      instruction: "Smile for the camera",
      duration: 2000,
      icon: "😊",
    },
  ];

  useEffect(() => {
    if (isCameraActive && currentStep < livenessSteps.length) {
      // Fade in animation for each new instruction
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, livenessSteps[currentStep].id]);
        setCurrentStep((prev) => prev + 1);
      }, livenessSteps[currentStep].duration);

      return () => clearTimeout(timer);
    } else if (isCameraActive && currentStep === livenessSteps.length && !isCapturing) {
      // Auto-capture when all steps are complete
      handleCapture();
    }
  }, [currentStep, isCameraActive]);

  const handleStartSetup = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        return;
      }
    }
    setIsCameraActive(true);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const handleCapture = async () => {
    if (!cameraReady || !cameraRef.current) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
        processingContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  processingText: {
    ...theme.typography.subheading,
    fontSize: 18,
    color: theme.colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  processingSubtext: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

      // Simulate API call to send photo
      const response = await mockApiCall(photo.base64);
      console.log("API Response:", response);

      // Navigate back or to success screen
      setTimeout(() => {
        setIsCameraActive(false);
        setCurrentStep(0);
        setCompletedSteps([]);
        navigation.goBack(); // Or navigate to a success screen
      }, 1500);
    } catch (error) {
      console.error("Capture error:", error);
      alert("Error capturing photo. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const mockApiCall = async (base64Image) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: "FacePay setup successful" };
  };

  const renderProgressBar = () => {
    const progress = (completedSteps.length / livenessSteps.length) * 100;
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedSteps.length}/{livenessSteps.length} checks completed
        </Text>
      </View>
    );
  };

  const renderCompletedSteps = () => {
    return (
      <View style={styles.completedStepsContainer}>
        {livenessSteps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === livenessSteps.indexOf(step);
          return (
            <View
              key={step.id}
              style={[
                styles.stepIndicator,
                isCompleted && styles.stepCompleted,
                isCurrent && styles.stepCurrent,
              ]}
            >
              {isCompleted ? (
                <CheckCircle color="#10b981" size={16} />
              ) : (
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.id}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Header variant="back" navigation={navigation} title="Set up FacePay" />
        <View style={styles.content}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.infoText}>Requesting camera permission...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Header variant="back" navigation={navigation} title="Set up FacePay" />
        <View style={styles.content}>
          <AlertCircle color={theme.colors.error} size={64} />
          <Text style={styles.title}>Camera Access Required</Text>
          <Text style={styles.infoText}>
            FacePay needs camera access to capture your facial biometrics
            securely. Your privacy is protected and images are encrypted.
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={requestPermission}
          >
            <Text style={styles.startButtonText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header variant="back" navigation={navigation} title="Set up FacePay" />
      <View style={styles.content}>
        <View style={styles.finTechPattern} />
        {!isCameraActive ? (
          <>
            <Text style={styles.title}>Set Up FacePay</Text>
            <Text style={styles.infoText}>
              FacePay uses advanced facial recognition with liveness detection
              to secure your payments. We'll guide you through a quick setup
              process.
            </Text>
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>
                📋 What to expect:
              </Text>
              <Text style={styles.instructionItem}>
                • Look directly at the camera
              </Text>
              <Text style={styles.instructionItem}>
                • Follow on-screen prompts
              </Text>
              <Text style={styles.instructionItem}>
                • Complete liveness checks
              </Text>
              <Text style={styles.instructionItem}>
                • Capture your face securely
              </Text>
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartSetup}
            >
              <Text style={styles.startButtonText}>Start Setup</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="front"
              onCameraReady={() => setCameraReady(true)}
            >
              <View style={styles.cameraOverlay}>
                <View style={styles.faceFrame} />
              </View>
            </CameraView>

            {renderProgressBar()}
            {renderCompletedSteps()}

            {currentStep < livenessSteps.length ? (
              <Animated.View
                style={[styles.promptContainer, { opacity: fadeAnim }]}
              >
                <Text style={styles.promptIcon}>
                  {livenessSteps[currentStep].icon}
                </Text>
                <Text style={styles.promptText}>
                  {livenessSteps[currentStep].instruction}
                </Text>
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primary}
                  style={styles.promptLoader}
                />
              </Animated.View>
            ) : (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.processingText}>
                  {isCapturing ? "Processing your face data..." : "Capturing..."}
                </Text>
                <Text style={styles.processingSubtext}>
                  Please wait while we securely verify your identity
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  finTechPattern: {
    ...StyleSheet.absoluteFill,
    opacity: 0.05,
    backgroundColor: theme.colors.gray,
  },
  title: {
    ...theme.typography.heading,
    fontSize: 28,
    color: theme.colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  infoText: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: 24,
    lineHeight: 24,
    textAlign: "center",
  },
  instructionsCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    ...theme.typography.subheading,
    fontSize: 18,
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  instructionItem: {
    ...theme.typography.body,
    fontSize: 15,
    color: theme.colors.text.secondary,
    marginBottom: 8,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    ...theme.typography.button,
    fontSize: 16,
    color: theme.colors.surface,
    fontWeight: "bold",
  },
  cameraContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  camera: {
    width: 320,
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  faceFrame: {
    width: 220,
    height: 280,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 140,
    borderStyle: "dashed",
  },
  progressContainer: {
    width: "100%",
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: theme.colors.gray,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.text.muted,
    textAlign: "center",
  },
  completedStepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  stepCompleted: {
    backgroundColor: "#d1fae5",
  },
  stepCurrent: {
    backgroundColor: theme.colors.primary,
    transform: [{ scale: 1.1 }],
  },
  stepNumber: {
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    ...theme.typography.caption,
    fontSize: 12,
    color: theme.colors.text.primary,
    fontWeight: "bold",
  },
  promptContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  promptText: {
    ...theme.typography.subheading,
    fontSize: 18,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  promptLoader: {
    marginTop: 8,
  },
  successContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successText: {
    ...theme.typography.subheading,
    fontSize: 20,
    color: "#10b981",
    marginTop: 12,
    marginBottom: 8,
    fontWeight: "bold",
  },
  successSubtext: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 20,
    textAlign: "center",
  },
  captureButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  captureButtonText: {
    ...theme.typography.button,
    fontSize: 16,
    color: theme.colors.surface,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: theme.colors.gray,
    opacity: 0.6,
  },
});

export default FacePaySetupScreen;