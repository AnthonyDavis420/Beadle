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

interface AddSubjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    subjectCode: string;
    subjectName: string;
    teacherName: string;
    room: string;
    dayTime: string;
  }) => void;
  defaultValues?: {
    subjectCode: string;
    subjectName: string;
    teacherName: string;
    room: string;
    dayTime: string;
  };
}

export default function AddSubjectModal({
  visible,
  onClose,
  onSubmit,
  defaultValues,
}: AddSubjectModalProps) {
  const [modalVisible, setModalVisible] = useState(visible);
  const [slideAnim] = useState(new Animated.Value(1000));

  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [room, setRoom] = useState("");
  const [dayTime, setDayTime] = useState("");

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      setSubjectCode(defaultValues?.subjectCode || "");
      setSubjectName(defaultValues?.subjectName || "");
      setTeacherName(defaultValues?.teacherName || "");
      setRoom(defaultValues?.room || "");
      setDayTime(defaultValues?.dayTime || "");

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  }, [visible]);

  const handleSubmit = () => {
    onSubmit({ subjectCode, subjectName, teacherName, room, dayTime });
    onClose();
    setSubjectCode("");
    setSubjectName("");
    setTeacherName("");
    setRoom("");
    setDayTime("");
  };

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
          <Text style={styles.modalTitle}>
            {defaultValues ? "Edit Subject" : "Add Subject"}
          </Text>
        </View>

        <TextInput
          placeholder="Subject Code"
          style={styles.input}
          value={subjectCode}
          onChangeText={setSubjectCode}
        />
        <TextInput
          placeholder="Subject Name"
          style={styles.input}
          value={subjectName}
          onChangeText={setSubjectName}
        />
        <TextInput
          placeholder="Teacher’s Name"
          style={styles.input}
          value={teacherName}
          onChangeText={setTeacherName}
        />
        <TextInput
          placeholder="Room"
          style={styles.input}
          value={room}
          onChangeText={setRoom}
        />
        <TextInput
          placeholder="Day & Time"
          style={styles.input}
          value={dayTime}
          onChangeText={setDayTime}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0818C6",
  },
  input: {
    height: 60,
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 10,
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
