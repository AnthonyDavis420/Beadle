// Home.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AddSubjectModal from "../components/AddSubjectModal"; // Update path if needed
import Header from "../components/Header";
import BeadleNav from "./beadle/BeadleNav";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [classes, setClasses] = useState<
    {
      subjectCode: string;
      subjectName: string;
      teacherName: string;
      room: string;
      dayTime: string;
    }[]
  >([]);

  const handleAddClass = (newClass: {
    subjectCode: string;
    subjectName: string;
    teacherName: string;
    room: string;
    dayTime: string;
  }) => {
    setClasses((prev) => [...prev, newClass]);
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Courses</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {classes.map((cls, index) => (
          <View key={index} style={styles.classBox}>
            <View style={styles.headerRow}>
              <Text style={styles.subjectCode}>{cls.subjectCode}</Text>
              <Text style={styles.editIcon}>✎</Text>
            </View>
            <Text style={styles.subjectName}>{cls.subjectName}</Text>
            <Text style={styles.teacherName}>{cls.teacherName}</Text>
            <View style={styles.footerRow}>
              <Text style={styles.room}>{cls.room}</Text>
              <Text style={styles.time}>{cls.dayTime}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addClassBox}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addClassText}>Add Class +</Text>
        </TouchableOpacity>
      </ScrollView>

      <AddSubjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddClass}
      />
      <BeadleNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 20,
    color: "#0818C6",
    fontWeight: "bold",
  },
  addClassText: {
    paddingVertical: 10,
  },
  classBox: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
    marginHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subjectCode: {
    fontSize: 12,
    color: "#555",
  },
  editIcon: {
    fontSize: 14,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
  teacherName: {
    fontSize: 14,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  room: {
    fontSize: 12,
  },
  time: {
    fontSize: 12,
  },
  addClassBox: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
});
