import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons"; // or "react-native-vector-icons/Feather"

interface ClassBoxProps {
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  room: string;
  dayTime: string;
}

const ClassBox: React.FC<ClassBoxProps> = ({
  subjectCode,
  subjectName,
  teacherName,
  room,
  dayTime,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.subjectCode}>{subjectCode}</Text>
        <TouchableOpacity>
          <Feather name="edit-2" size={16} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subjectName}>{subjectName}</Text>
      <Text style={styles.teacherName}>{teacherName}</Text>

      <View style={styles.footerRow}>
        <Text style={styles.room}>{room}</Text>
        <Text style={styles.schedule}>{dayTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  subjectCode: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  room: {
    fontSize: 12,
    color: "#555",
  },
  schedule: {
    fontSize: 12,
    color: "#555",
  },
});

export default ClassBox;
