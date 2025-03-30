import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router"; // Use react-navigation if needed

export default function BottomNav() {
  return (
    <View style={styles.navbar}>
      <Link href="/Navbar/subjects" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../assets/images/subjects.png")}
            style={styles.icon}
          />
          <Text style={styles.activeText}>Subjects</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/Navbar/records" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../assets/images/records.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>Records</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/Navbar/scan" asChild>
        <TouchableOpacity style={styles.scanButton}>
          <Image
            source={require("../assets/images/scan.png")}
            style={styles.scanIcon}
          />
        </TouchableOpacity>
      </Link>

      <Link href="/Navbar/notifications" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../assets/images/notifications.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>Notification</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/Navbar/settings" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../assets/images/settings.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>Settings</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navItem: {
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
  scanButton: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 50,
  },
  scanIcon: {
    width: 40,
    height: 40,
  },
  text: {
    fontSize: 12,
    color: "#000",
  },
  activeText: {
    fontSize: 12,
    color: "#0818C6",
    fontWeight: "bold",
  },
});
