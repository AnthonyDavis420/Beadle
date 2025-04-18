import React from "react";
import { View, Text, StyleSheet } from "react-native";

// 👉 Define the expected props
interface ClassBoxProps {
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  room: string;
  dayTime: string;
}

export default function ClassBox({
  subjectCode,
  subjectName,
  teacherName,
  room,
  dayTime,
}: ClassBoxProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.subjectCode}>{subjectCode}</Text>
      <Text style={styles.subjectName}>{subjectName}</Text>
      <Text style={styles.teacher}>{teacherName}</Text>
      <Text style={styles.roomTime}>
        {room}   {dayTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderColor: "#A0A0A0",
    borderWidth: 1,
  },
  subjectCode: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  subjectName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  teacher: {
    color: "#3E3E3E",
    marginBottom: 5,
  },
  roomTime: {
    fontSize: 12,
    color: "#6E6E6E",
  },
});
