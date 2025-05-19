import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "../../components/Header";
import StudentNav from "../beadle/BeadleNav";

export default function ClassDetails() {
  const { classId } = useLocalSearchParams();
  const db = getFirestore();
  const auth = getAuth();

  const [classInfo, setClassInfo] = useState<any>(null);
  const [attendance, setAttendance] = useState<{ date: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentUID, setStudentUID] = useState<string | null>(null);

  useEffect(() => {
    const fetchClass = async () => {
      if (!classId) return;
      const classRef = doc(db, "classes", classId as string);
      const docSnap = await getDoc(classRef);
      if (docSnap.exists()) {
        setClassInfo(docSnap.data());
      }
    };
    fetchClass();
  }, [classId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && classId) {
        setStudentUID(currentUser.uid);
        console.log("✅ Logged in as UID:", currentUser.uid);
        fetchAttendance(currentUser.uid);
      } else {
        console.log("❌ No authenticated user or missing classId.");
      }
    });

    return () => unsubscribe();
  }, [classId]);

  const fetchAttendance = async (uid: string) => {
    console.log("📣 Fetching attendance collection...");

    const attendanceRef = collection(db, "classes", classId as string, "attendance");
    const attendanceSnapshots = await getDocs(attendanceRef);

    if (attendanceSnapshots.empty) {
      console.log("⚠️ No attendance documents found in Firestore.");
    } else {
      console.log("📁 Dates found:", attendanceSnapshots.docs.map((doc) => doc.id));
    }

    const data: { date: string; status: string }[] = [];

    for (const dateDoc of attendanceSnapshots.docs) {
      const date = dateDoc.id;
      console.log("📅 Checking attendance for date:", date);

      const recordRef = doc(
        db,
        "classes",
        classId as string,
        "attendance",
        date,
        "records",
        uid
      );

      const recordSnap = await getDoc(recordRef);

      if (recordSnap.exists()) {
        console.log(`✅ Record found for ${date}:`, recordSnap.data());
      } else {
        console.log(`❌ No record for UID ${uid} on ${date}`);
      }

      data.push({
        date,
        status: recordSnap.exists() ? recordSnap.data().status : "Absent",
      });
    }

    data.sort((a, b) => (a.date < b.date ? 1 : -1));
    setAttendance(data.slice(0, 5));
    setLoading(false);
  };

  const totalPresent = attendance.filter((a) => a.status === "Present").length;
  const totalAbsent = attendance.filter((a) => a.status === "Absent").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "green";
      case "Late":
        return "orange";
      case "Absent":
        return "red";
      default:
        return "#333";
    }
  };

  if (!classInfo) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={{ marginTop: 100, textAlign: "center" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.subjectCode}>{classInfo.subjectCode}</Text>
            <Text style={styles.editIcon}>✎</Text>
          </View>
          <Text style={styles.subjectName}>{classInfo.subjectName}</Text>
          <Text style={styles.teacherName}>{classInfo.teacherName}</Text>
          <Text style={styles.classMeta}>
            {classInfo.room} • {classInfo.dayTime}
          </Text>
        </View>

        {studentUID && (
          <Text style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "#555" }}>
            Student UID: {studentUID}
          </Text>
        )}

        <View style={styles.counterContainer}>
          <View style={styles.counterBox}>
            <Text style={styles.counterLabel}>Present</Text>
            <Text style={styles.counterValue}>{totalPresent}</Text>
          </View>
          <View style={styles.counterBox}>
            <Text style={styles.counterLabel}>Absent</Text>
            <Text style={styles.counterValue}>{totalAbsent}</Text>
          </View>
        </View>

        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Date</Text>
          <Text style={styles.historyTitle}>Status</Text>
        </View>

        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading attendance...</Text>
        ) : attendance.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
            No attendance records found.
          </Text>
        ) : (
          attendance.map((record, index) => (
            <TouchableOpacity key={index} style={styles.historyRow}>
              <Text style={styles.historyDate}>{record.date}</Text>
              <Text
                style={[
                  styles.historyStatus,
                  { color: getStatusColor(record.status) },
                ]}
              >
                {record.status}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <StudentNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 24,
    marginTop: 20,
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
  },
  classMeta: {
    fontSize: 12,
    marginTop: 6,
    color: "#666",
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 24,
    marginTop: 24,
  },
  counterBox: {
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  counterLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  counterValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    paddingHorizontal: 24,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  historyTitle: {
    fontWeight: "600",
    fontSize: 14,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  historyDate: {
    fontSize: 14,
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
});
