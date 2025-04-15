import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";
import BeadleNav from "../beadle/BeadleNav"; // Adjust path if needed

export default function records() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.text}>This is the Records Page</Text>
      </View>
      <BeadleNav />
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
