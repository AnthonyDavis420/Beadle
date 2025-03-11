import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Link } from "expo-router";

/* Authored by: John Ken Lanon
Company: 3idiots
Project: BEADLE
Feature: [BDLE-014-015] LogIn & SignUp
Description: User LogIn and Signup hehe
 */

export default function LoginScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Log In Now</Text>
        <Text style={styles.subtitle}>
          Please login to continue using our app
        </Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Email" />
          <TextInput style={styles.input} placeholder="Password" />
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
          <Link href="/signUp" asChild>
            <TouchableOpacity>
              <Text style={styles.words}>Don't Have an Account? Sign Up</Text>
            </TouchableOpacity>
          </Link>
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
    color: "#000000",
    textAlign: "center",
  },
  inputContainer: {
    marginTop: 53,
  },
  input: {
    margin: 8,
    backgroundColor: "#White",
    borderWidth: 0.5,
    width: 300,
    borderRadius: 15,
    height: 50,
    padding: 18,
  },
  buttonContainer: {},
  button: {
    backgroundColor: "#0818C6",
    height: 50,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 17,
  },
  buttonText: {
    color: "white",
  },
  words: {
      fontSize: 12,
      color: "#000000",
      textAlign: "center",
      marginVertical: 10,
  }
});
