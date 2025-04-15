import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link, usePathname } from "expo-router"; // <-- import usePathname

export default function BeadleNav() {
  const pathname = usePathname();

  return (
    <View style={styles.navbar}>
      <Link href="../beadle-home" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../../assets/images/subjects.png")}
            style={styles.icon}
          />
          <Text
            style={
              pathname === "/beadle-home" ? styles.activeText : styles.text
            }
          >
            Subjects
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/beadle/records" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../../assets/images/records.png")}
            style={styles.icon}
          />
          <Text
            style={
              pathname === "/beadle/records" ? styles.activeText : styles.text
            }
          >
            Records
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/beadle/scan" asChild>
        <TouchableOpacity style={styles.scanButton}>
          <Image
            source={require("../../assets/images/scan.png")}
            style={styles.scanIcon}
          />
        </TouchableOpacity>
      </Link>

      <Link href="/beadle/notifications" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../../assets/images/notifications.png")}
            style={styles.icon}
          />
          <Text
            style={
              pathname === "/beadle/notifications"
                ? styles.activeText
                : styles.text
            }
          >
            Notification
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/beadle/settings" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../../assets/images/settings.png")}
            style={styles.icon}
          />
          <Text
            style={
              pathname === "/beadle/settings" ? styles.activeText : styles.text
            }
          >
            Settings
          </Text>
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
