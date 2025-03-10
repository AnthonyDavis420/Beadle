import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import Header from "../components/Header"; // Import your existing Header component

export default function LandingPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    teacherName: "",
    room: "",
    dayTime: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <View style={styles.container}>
      {/* Use Existing Header Component */}
      <Header />

      {/* Floating Button (Existing) */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {/* Modal for Adding a Subject */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>Add Subject</Text>
            </View>
            {/* Input Fields */}
            {[
              "Subject Code and Section",
              "Subject Name",
              "Teacher’s Name",
              "Room",
              "Day & Time",
            ].map((placeholder, index) => (
              <TextInput
                key={index}
                placeholder={placeholder}
                style={styles.input}
                onChangeText={(text) => handleChange(placeholder, text)}
              />
            ))}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  buttonText: {
    fontSize: 50,
    color: "white",
    paddingBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  modalContainer: {
    width: "100%",
    height: "70%",
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
  },
  modalTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#404040",
    marginBottom: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    height: 60,
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 30,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#D9D9D9",
    padding: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#0818C8",
    padding: 20,
    borderRadius: 10,
    flex: 1,
  },
  cancelText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
  },
  submitText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
