import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { usePathname, useRouter } from "expo-router";

export default function StudentNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.replace("/student-home")}
      >
        <Image
          source={require("../../assets/images/subjects.png")}
          style={styles.icon}
        />
        <Text
          style={
            pathname === "/student-home" ? styles.activeText : styles.text
          }
        >
          Subjects
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.replace("/student/records")}
      >
        <Image
          source={require("../../assets/images/records.png")}
          style={styles.icon}
        />
        <Text
          style={
            pathname === "/student/records" ? styles.activeText : styles.text
          }
        >
          Records
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.replace("/student/scan")}
      >
        <Image
          source={require("../../assets/images/scan.png")}
          style={styles.scanIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.replace("/student/notifications")}
      >
        <Image
          source={require("../../assets/images/notifications.png")}
          style={styles.icon}
        />
        <Text
          style={
            pathname === "/student/notifications"
              ? styles.activeText
              : styles.text
          }
        >
          Notification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.replace("/student/settings")}
      >
        <Image
          source={require("../../assets/images/settings.png")}
          style={styles.icon}
        />
        <Text
          style={
            pathname === "/student/settings" ? styles.activeText : styles.text
          }
        >
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navItem: {
    alignItems: "center",
  },
  icon: {
    height: 24,
  },
  scanButton: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 50,
  },
  scanIcon: {
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
