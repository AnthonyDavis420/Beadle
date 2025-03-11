import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Link } from "expo-router";
export default function signUp() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
            <Text style={styles.title}>Sign-Up</Text>
            <Text style={styles.subtitle}>
              Please login to continue using our app
            </Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="  Name" />
              <TextInput style={styles.input} placeholder="  Student ID" />
              <TextInput style={styles.input} placeholder="  Email" keyboardType="email-address" />
              <TextInput style={styles.input} placeholder="  Password" secureTextEntry />
            </View>
    <View style={styles.container}>
      <Link href="/rolePage" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Link>
    </View>
    </View>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0033cc",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    margin: 5,
    backgroundColor: "#White",
    borderWidth: 0.5,
    width: 250,
    borderRadius: 10,
  },
  buttonContainer: {},
  button: {},
  buttonText: {},
});
