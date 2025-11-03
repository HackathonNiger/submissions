import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import useAuthStore from "../store/useAuthStore";
import useAuthWorkerStore from "../store/useAuthWorkerStore";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated: isMotherAuth, isLoading: isMotherLoading } =
    useAuthStore();
  const { isAuthenticated: isWorkerAuth, isLoading: isWorkerLoading } =
    useAuthWorkerStore();

  useEffect(() => {
    let timer;

    // Wait for both auth stores to initialize
    if (!isMotherLoading && !isWorkerLoading) {
      console.log("Auth initialized:", { isMotherAuth, isWorkerAuth });

      timer = setTimeout(() => {
        if (isMotherAuth || isWorkerAuth) {
          console.log("User authenticated, navigating to currentuser");
          router.replace("/auth/currentuser");
        } else {
          console.log("User not authenticated, navigating to Onboarding");
          router.replace("/Onboarding");
        }
      }, 1500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isMotherLoading, isWorkerLoading, isMotherAuth, isWorkerAuth]);

  return (
    <View className="flex-1 justify-center items-center bg-[#FCFCFC]">
      <Image
        source={require("../assets/images/AyomamaLogo.png")}
        className="w-48 h-48"
        resizeMode="contain"
      />
      {(isMotherLoading || isWorkerLoading) && (
        <ActivityIndicator size="large" color="#006D5B" className="mt-4" />
      )}
    </View>
  );
}
