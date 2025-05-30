import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/StudentHeader";
import StudentNav from "../student/StudentNav"; // Adjust path if needed

export default function records() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.text}>This is the Records Pages</Text>
      </View>
      <StudentNav />
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
