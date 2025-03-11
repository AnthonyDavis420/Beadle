import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
// Define the expected types for props
interface AddSubjectModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddSubjectModal({
  visible,
  onClose,
}: AddSubjectModalProps) {
  const [modalVisible, setModalVisible] = useState(visible);
  const [slideAnim] = useState(new Animated.Value(1000)); // Start below screen
  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0, // Slide up to visible position
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000, // Move far down off-screen
        duration: 600,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  }, [visible]);

  return (
    <Modal animationType="none" transparent visible={modalVisible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.modalTitleContainer}>
          <Text style={styles.modalTitle}>Add Subject</Text>
        </View>

        {[
          "Subject Code",
          "Subject Name",
          "Teacher’s Name",
          "Room",
          "Day & Time",
        ].map((placeholder, index) => (
          <TextInput
            key={index}
            placeholder={placeholder}
            style={styles.input}
          />
        ))}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    width: "100%",
    height: "100%",
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
  },
  modalTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#404040",
    marginBottom: 60,
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#0818C6",
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
