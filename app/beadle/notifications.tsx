import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../../components/Header";
import BeadleNav from "../beadle/BeadleNav"; // Adjust path if needed

export default function Notification() {
  // You can add state to control visibility if needed
  const [visible, setVisible] = React.useState(true);

  if (!visible) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.content}>
          <Text style={styles.text}>This is the Notification Page</Text>
        </View>
        <BeadleNav />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      {/* Notification Bar */}
      <View style={styles.notificationBar}>
        <Text style={styles.notificationText}>
          You have 3 new notifications
        </Text>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>This is the Notification Page</Text>
      </View>

      <BeadleNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  notificationBar: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  notificationText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  closeButton: {
    color: "#fff",
    fontSize: 18,
    paddingLeft: 15,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});
