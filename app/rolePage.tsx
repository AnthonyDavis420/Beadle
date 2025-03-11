import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Link } from "expo-router";

/* Authored by: Mark Ong Jacinto
Company: 3idiots
Project: BEADLE
Feature: [BDLE-014-015] LogIn & SignUp
Description: User selecting account role
 */


export default function RolePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ROLE</Text>
      <Text style={styles.subtitle}>Select your role</Text>
      <Image
        source={require("../assets/images/role.png")}
        style={styles.image}
      />
      <View style={styles.buttonContainer}>
        <Link href="/landingPage" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Beadle</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.words}>Or</Text>
        <Link href="/landingPage" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Student</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.words}>Do you have an account</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#071689",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    marginVertical: 10,
  },
  image: {
    width: 325,
    height: 240,
    resizeMode: "contain",
    marginVertical: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#0818C6",
    paddingVertical: 12,
    width: 300,
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  words: {
    fontSize: 12,
    color: "#000000",
    textAlign: "center",
    marginVertical: 10,
  },
  linkText: {
    fontSize: 12,
    color: "#071689",
    fontWeight: "bold",
  },
});
