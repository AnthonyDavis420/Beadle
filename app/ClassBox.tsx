// ClassBox.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
    <View style={styles.container}>
      <Text style={styles.code}>{subjectCode}</Text>
      <Text style={styles.name}>{subjectName}</Text>
      <Text>{teacherName}</Text>
      <Text>{room}</Text>
      <Text>{dayTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#8A8A8A",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  code: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#3c3c3c",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 5,
  },
});
