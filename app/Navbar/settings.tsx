import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav"; // Adjust path if needed

export default function settings() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.text}>This is the Settings Page</Text>
      </View>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});
