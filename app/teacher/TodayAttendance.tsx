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
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Header from "../../components/Header";
import TeacherNav from "./TeacherNav";

export default function TodayAttendance() {
  const { classId } = useLocalSearchParams();
  const db = getFirestore();
  const auth = getAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!classId) return;

    const enrolledRef = collection(
      db,
      "classes",
      classId as string,
      "enrolledStudents"
    );
    const attendanceRef = collection(
      db,
      "classes",
      classId as string,
      "attendance",
      today,
      "records"
    );

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

    try {
      const dateDocRef = doc(
        db,
        "classes",
        classId as string,
        "attendance",
        today
      );
      await setDoc(dateDocRef, { createdAt: new Date() }, { merge: true });

      const studentRef = doc(
        db,
        "classes",
        classId as string,
        "attendance",
        today,
        "records",
        studentId
      );

      // ✅ Get the student's name for saving
      const studentData = students.find((s) => s.id === studentId);

      await setDoc(studentRef, {
        name: studentData?.name || "Unnamed",
        status,
        markedAt: new Date(),
      });

      // ✅ Save to global collection once all students are marked
      const hasUnmarked = students.some((s) => !statusMap[s.id]);
      if (!hasUnmarked && !hasSaved) {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const classList = students.map((s) => ({
          name: s.name || "Unnamed",
          status: statusMap[s.id] || "unmarked",
        }));

        await addDoc(collection(db, "attendance"), {
          date: today,
          recordedBy: currentUser.uid,
          classId: classId,
          classList,
        });

        console.log("✅ Attendance saved to global collection.");
        setHasSaved(true);
      }
    } catch (error) {
      console.error("❌ Error marking attendance:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <Text style={styles.date}>{today}</Text>
        <Text style={styles.title}>Today's Attendance</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0818C6"
            style={{ marginTop: 40 }}
          />
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
      <TeacherNav />
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
    justifyContent: "space-between",
  },
  statusBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    width: 80,
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 30,
  },
});
