import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ContentPage from "../../component/LandingPage/ContentPage";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login"); // after 3 sec, go to login
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ContentPage navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
