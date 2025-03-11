import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

/* Authored by: Mark Ong Jacinto
Company: 3idiots
Project: BEADLE
Feature: [BDLE-014-015] LogIn & SignUp
Description: First Page of the Mobile App
 */

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BEADLE</Text>
      <Text style={styles.subtitle}>
        A Mobile App for easy Attendance
      </Text>

      <View style={styles.buttonContainer}>
        <Link href="/OnBoarding" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Link>
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
    color: "#000000",
    textAlign: "center",
    marginBottom: 80,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 80,
    width: 300,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0818C8",
    paddingVertical: 15,
    width: 300,
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
