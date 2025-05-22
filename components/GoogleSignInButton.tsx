import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";

export default function GoogleSignInButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dddddd",
    width: 300,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 15,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
  },
});
