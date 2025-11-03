import React from "react";
import { View, StyleSheet } from "react-native";
import Menue from "../../component/LandingPage/Menue";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Menue navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
