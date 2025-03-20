import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";

export default function GoogleSignInButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <Image source={require("../assets/images/googleIcon.png")} style={styles.googleIcon} />

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
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
