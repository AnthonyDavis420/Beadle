import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Header from "../components/Header";
import AddSubjectModal from "../components/AddSubjectModal";

export default function LandingPage() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {/* Add Subject Modal */}
      <AddSubjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 89,
    right: 44,
    backgroundColor: "#0818C8",
    width: 63,
    height: 63,
    borderRadius: 36,
    zIndex: 2,
  },
  buttonText: {
    fontSize: 50,
    color: "white",
    paddingBottom: 10,
  },
});
