import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import Firebase authentication
import { collection, doc, setDoc, getFirestore } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

export default function SignUp() {
  const router = useRouter();

  // State for user input
  const [name, setName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Function to handle sign-up
  const handleSignUp = async () => {
    if (!name || !studentID || !email || !password || !selectedRole) {
      Alert.alert("Error", "All fields are required, including role.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(collection(db, "users"), user.uid), {
        name,
        studentID,
        email,
        uid: user.uid,
        role: selectedRole,
      });

      Alert.alert("Success", "Account created successfully!");

      // Role redirection for beadle and student
      if (selectedRole === "Beadle") {
        router.replace("/beadle-home");
      } else if (selectedRole === "Student") {
        router.replace("/student-home");
      } else {
        Alert.alert("Error", "Role not recognized. Please try logging in.");
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }

      Alert.alert("Sign-Up Failed", errorMessage);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign-Up</Text>
        <Text style={styles.subtitle}>Create an account to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Student ID"
            value={studentID}
            onChangeText={setStudentID}
            keyboardType="numeric"
          />
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
          <View style={styles.roleContainer}>
            <Text style={styles.role}>Role</Text>
            <View style={styles.chooseRole}>
              {["Student", "Beadle"].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={styles.radioContainer}
                  onPress={() => setSelectedRole(role)}
                >
                  <View style={styles.outerCircle}>
                    {selectedRole === role && (
                      <View style={styles.innerCircle} />
                    )}
                  </View>
                  <Text style={styles.label}>{role}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.words}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  roleContainer: {
    margin: 8,
    backgroundColor: "#FFF",
    borderWidth: 0.5,
    width: 300,
    borderRadius: 15,
    height: 107,
  },
  chooseRole: {
    flexDirection: "row",
    paddingLeft: 18,
    marginBottom: 10,
  },
  role: {
    padding: 18,
  },

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
    marginTop: 30,
  },
  input: {
    margin: 8,
    backgroundColor: "#FFF",
    borderWidth: 0.5,
    width: 300,
    borderRadius: 15,
    height: 50,
    padding: 18,
  },
  button: {
    backgroundColor: "#0818C6",
    height: 50,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  words: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    marginVertical: 10,
  },
  roleButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },

  outerCircle: {
    height: 10,
    width: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },

  label: {
    fontSize: 16,
  },
});
