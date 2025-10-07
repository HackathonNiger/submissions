// utils/theme.js
import { Platform } from "react-native";

const theme = {
  colors: {
    background: "#F7F9FC", // clean off-white background
    surface: "#FFFFFF", // cards, modals, sheets
    primary: "#1A2E5D", // deep navy blue
    secondary: "#F4B400", // warm golden accent
    accent: "#4A90E2", // vibrant sky blue accent
    gradient: {
      start: "#1A2E5D", // deep navy
      middle: "#4A90E2", // sky blue
      end: "#F4B400", // warm gold
    },
    text: {
      primary: "#1A1A1A", // almost black for readability
      secondary: "#4B5563", // dark gray for subtitles
      muted: "#9CA3AF", // soft gray for hints/placeholders
    },
    success: "#22C55E", // green
    warning: "#EAB308", // yellow-gold
    error: "#EF4444", // red
    gray: "#D1D5DB", // border/light gray
  },
  typography: {
    heading: {
      fontFamily: Platform.OS === "ios" ? "SpaceGrotesk-Bold" : "SpaceGrotesk-Bold",
      fontSize: 24,
      color: "#1A2E5D",
    },
    subheading: {
      fontFamily:
        Platform.OS === "ios" ? "SpaceGrotesk-SemiBold" : "SpaceGrotesk-SemiBold",
      fontSize: 18,
      color: "#4A90E2", // accent blue
    },
    body: {
      fontFamily: Platform.OS === "ios" ? "Inter-Regular" : "Inter-Regular",
      fontSize: 14,
      color: "#374151", // neutral dark gray
    },
    button: {
      fontFamily: Platform.OS === "ios" ? "Inter-Medium" : "Inter-Medium",
      fontSize: 16,
      color: "#FFFFFF",
    },
    caption: {
      fontFamily: Platform.OS === "ios" ? "Inter-Regular" : "Inter-Regular",
      fontSize: 12,
      color: "#6B7280", // muted gray
    },
    overline: {
      fontFamily: Platform.OS === "ios" ? "Inter-Medium" : "Inter-Medium",
      fontSize: 10,
      color: "#1A2E5D", // deep navy
      textTransform: "uppercase",
      letterSpacing: 1,
    },
  },
};

export default theme;
