import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  getFirestore,
  collection,
  onSnapshot,
} from "firebase/firestore";
import Header from "../../components/Header";
import BeadleNav from "../teacher/TeacherNav";

interface Student {
  id: string;
  name?: string;
  email?: string;
}

export default function ClassMembers() {
  const { classId } = useLocalSearchParams();
  const db = getFirestore();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;

    const q = collection(db, "classes", classId as string, "enrolledStudents");


    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Student[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Student;
        list.push({
          id: doc.id,
          name: data.name || "Unnamed",
          email: data.email || "",
        });
      });
      setStudents(list);  
      setLoading(false);
    });

    return () => unsubscribe();
  }, [classId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Class Members</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0818C6" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {students.length === 0 ? (
            <Text style={styles.emptyText}>No students have joined this class yet.</Text>
          ) : (
            students.map((student, index) => (
              <View key={student.id} style={styles.studentBox}>
                <Text style={styles.name}>{index + 1}. {student.name}</Text>
                {student.email ? (
                  <Text style={styles.email}>{student.email}</Text>
                ) : null}
              </View>
            ))
          )}
        </ScrollView>
      )}

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
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 20,
    color: "#0818C6",
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  studentBox: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    marginTop: 50,
    textAlign: "center",
    color: "#888",
    fontSize: 14,
  },
});
