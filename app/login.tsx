import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import GoogleSignInButton from "../components/GoogleSignInButton";
export default function LoginScreen() {
  const router = useRouter();

  // State for user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;

        Alert.alert("Success", "Login Successful!");

        if (role === "Beadle") {
          router.replace("/beadle-home");
        } else if (role === "Student") {
          router.replace("/student-home");
        } else {
          Alert.alert("Error", "No role assigned. Please contact admin.");
        }
      } else {
        Alert.alert("Error", "User data not found in Firestore.");
      }

    } catch (error: any) {
      // error messages
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format. Please enter a valid email.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      }
      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Log In Now</Text>
        <Text style={styles.subtitle}>
          Please login to continue using our app
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <Link href="/signUp" asChild>
          <TouchableOpacity>
            <Text style={styles.words}>Don't Have an Account? Sign Up</Text>
            <GoogleSignInButton />
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
    backgroundColor: "white",
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
  },
});
