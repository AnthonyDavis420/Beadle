
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BEADLE</Text>
      <Text style={styles.subtitle}>
        A mobile app for easy and less hassle {"\n"}
        attendance HAHAHAHAHA
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("Get Started Pressed!")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#0033cc",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginBottom: 80,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    width: "90%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0818C8",
    paddingVertical: 15,
    width: 382,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
