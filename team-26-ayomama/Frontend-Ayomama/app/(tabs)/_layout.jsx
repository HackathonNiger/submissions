import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import Toast from "react-native-toast-message";
import { useTranslation } from "../../utils/translator";

export default function TabLayout() {
  // Translate all tab labels
  const homeText = useTranslation("Home");
  const visitText = useTranslation("Visit");
  const emergencyText = useTranslation("Emergency");
  const learnText = useTranslation("Learn");
  const profileText = useTranslation("Profile");

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#293231",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarItemStyle: {
            borderRadius: 200,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          },
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "#E5E5E5",
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 12,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: homeText,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="visit"
          options={{
            title: visitText,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "calendar" : "calendar"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="emergency"
          options={{
            title: emergencyText,
            tabBarIcon: ({ color = "#FF5E5EBD", focused }) => (
              <Ionicons
                name={focused ? "medkit" : "medkit"}
                size={24}
                color={"#FF5E5EBD"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="learn"
          options={{
            title: learnText,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "headset" : "headset"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: profileText,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
      <Toast />
    </>
  );
}
