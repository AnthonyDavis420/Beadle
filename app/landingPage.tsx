import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Header from "../components/Header";
import ClassBox from "../components/Classbox";
import AddSubjectModal from "../components/AddSubjectModal";
import BottomNav from "@/components/BottomNav";

interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  room: string;
  dayTime: string;
}

export default function LandingPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const addSubject = (newSubject: Subject) => {
    setSubjects([...subjects, { ...newSubject, id: Date.now().toString() }]);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.courses}>Courses</Text>
      <View style={styles.content}>
        {/* Add Class Button */}
        <TouchableOpacity
          style={styles.addClassButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addClassText}>Add Class +</Text>
        </TouchableOpacity>

        {/* Modal Component */}
        <AddSubjectModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />

        {/* Bottom Navigation */}
      </View>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  courses: {
    padding: 30,
    fontSize: 18,
  },
  addClassButton: {
    marginHorizontal: 20,
    padding: 50,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    borderColor: "#8A8A8A",
    borderRadius: 10,
    alignItems: "center",
  },
  addClassText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0818C6",
  },
  navbar: {},
  content: {
    flex: 1,
  },
});
