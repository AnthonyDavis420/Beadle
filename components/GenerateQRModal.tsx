import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

interface Props {
  visible: boolean;
  onClose: () => void;
  classId: string;
  onGenerated: (qrData: { token: string; date: string }) => void;
}

export default function GenerateQRModal({ visible, onClose, classId, onGenerated }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const db = getFirestore();

  const handleCreate = async () => {
    const token = uuidv4();

    const dateOnly = selectedDate.toISOString().split("T")[0];
    const expiresAt = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    const attendanceRef = doc(db, "classes", classId, "attendance", dateOnly);
    await setDoc(attendanceRef, {
      qrToken: token,
      expiresAt: Timestamp.fromDate(expiresAt),
      createdAt: Timestamp.now(),
    });

    onGenerated({ token, date: dateOnly });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select date & expiration time</Text>

          <Text style={styles.label}>Date</Text>
          <DateTimePicker
            mode="date"
            value={selectedDate}
            display="default"
            onChange={(_, selected) => selected && setSelectedDate(selected)}
          />

          <Text style={styles.label}>Expiration Time</Text>
          <DateTimePicker
            mode="time"
            value={selectedTime}
            display="default"
            onChange={(_, selected) => selected && setSelectedTime(selected)}
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.create} onPress={handleCreate}>
              <Text style={styles.createText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "500",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancel: {
    flex: 1,
    backgroundColor: "#E1E1E1",
    padding: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  create: {
    flex: 1,
    backgroundColor: "#0818C6",
    padding: 12,
    borderRadius: 6,
  },
  cancelText: {
    color: "#000",
    textAlign: "center",
  },
  createText: {
    color: "#fff",
    textAlign: "center",
  },
});
