import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate: (date: Date, time: Date) => void;
}

export default function GenerateQRSetupModal({ visible, onClose, onCreate }: Props) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePicked, setTimePicked] = useState(false);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      setTimePicked(true);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modal}>
              <Text style={styles.title}>Select date & time</Text>

              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.inputBox}
              >
                <Text style={styles.inputText}>
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={handleDateChange}
                />
              )}

              <Text style={styles.label}>Expiration Time</Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={styles.inputBox}
              >
                <Text style={styles.inputText}>
                  {timePicked
                    ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "--:--"}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleTimeChange}
                />
              )}

              <View style={styles.buttons}>
                <TouchableOpacity style={styles.cancel} onPress={onClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.create}
                  onPress={() => onCreate(date, time)}
                >
                  <Text style={styles.createText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    elevation: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
    marginTop: 10,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  inputText: {
    fontSize: 14,
    color: "#333",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
    fontWeight: "600",
  },
  createText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
