import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import Header from "../../components/Header";
import BeadleNav from "./BeadleNav";

export default function TodayAttendance() {
  const { classId } = useLocalSearchParams();
  const db = getFirestore();
  const [students, setStudents] = useState<any[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!classId) return;

    const enrolledRef = collection(db, "classes", classId as string, "enrolledStudents");
    const attendanceRef = collection(db, "classes", classId as string, "attendance", today, "records");

    const unsubscribeStudents = onSnapshot(enrolledRef, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setStudents(list);
      setLoading(false);
    });

    const unsubscribeAttendance = onSnapshot(attendanceRef, (snapshot) => {
      const map: Record<string, string> = {};
      snapshot.forEach((doc) => {
        map[doc.id] = doc.data().status;
      });
      setStatusMap(map);
    });

    return () => {
      unsubscribeStudents();
      unsubscribeAttendance();
    };
  }, [classId, today]);

  const handleMark = async (studentId: string, status: string) => {
    if (!classId) return;

    setStatusMap((prev) => ({ ...prev, [studentId]: status }));

    const ref = doc(
      db,
      "classes",
      classId as string,
      "attendance",
      today,
      "records",
      studentId
    );

    await setDoc(ref, {
      status,
      markedAt: new Date(),
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <Text style={styles.date}>{today}</Text>
        <Text style={styles.title}>Mark Attendance</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0818C6" style={{ marginTop: 40 }} />
        ) : students.length === 0 ? (
          <Text style={styles.empty}>No students enrolled in this class.</Text>
        ) : (
          students.map((student, index) => (
            <View key={index} style={styles.studentRow}>
              <Text style={styles.name}>{student.name || "Unnamed"}</Text>
              <View style={styles.buttons}>
                {["Present", "Late", "Absent"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusBtn,
                      {
                        backgroundColor:
                          statusMap[student.id] === status
                            ? status === "Present"
                              ? "green"
                              : status === "Late"
                              ? "gold"
                              : "red"
                            : "#ccc",
                      },
                    ]}
                    onPress={() => handleMark(student.id, status)}
                  >
                    <Text style={styles.statusText}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <BeadleNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  date: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    marginBottom: 20,
  },
  studentRow: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
  statusBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 30,
  },
});
