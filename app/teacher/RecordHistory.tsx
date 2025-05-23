import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function RecordHistory() {
  const { date, classId } = useLocalSearchParams();
  const db = getFirestore();
  const router = useRouter();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isToday, setIsToday] = useState(false);
  const [subjectName, setSubjectName] = useState("Attendance");

  useEffect(() => {
    if (!classId || !date) return;

    const fetchData = async () => {
      try {
        const classDoc = await getDoc(doc(db, "classes", classId as string));
        if (classDoc.exists()) {
          const classData = classDoc.data();
          setSubjectName(classData.subject || "Attendance");
        }

        const recordsRef = collection(
          db,
          "classes",
          classId as string,
          "attendance",
          date as string,
          "records"
        );

        const snapshot = await getDocs(recordsRef);
        const list: any[] = [];

        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        setStudents(list);

        const todayStr = new Date().toISOString().split("T")[0];
        setIsToday(date === todayStr);
      } catch (error) {
        console.error("Error fetching attendance history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId, date]);

  const getColor = (status?: string) => {
  const value = status?.toLowerCase() || "";

  switch (value) {
    case "present":
      return "#2ecc71";
    case "late":
      return "#f1c40f";
    case "absent":
      return "#e74c3c";
    default:
      return "#bdc3c7";
  }
};


  const formatFullDate = (d: string) => {
    const parsed = new Date(d);
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shareAllAttendanceCSV = async () => {
    if (!classId) return;

    try {
      const attendanceRef = collection(db, "classes", classId as string, "attendance");
      const attendanceSnapshots = await getDocs(attendanceRef);

      const allDates: string[] = [];
      const studentMap: { [studentName: string]: { [date: string]: string } } = {};

      for (const dateDoc of attendanceSnapshots.docs) {
        const date = dateDoc.id;
        allDates.push(date);

        const recordsRef = collection(
          db,
          "classes",
          classId as string,
          "attendance",
          date,
          "records"
        );
        const recordsSnapshot = await getDocs(recordsRef);

        recordsSnapshot.forEach((doc) => {
          const data = doc.data();

          let rawName = typeof data.name === "string" ? data.name.trim() : "";
          if (!rawName) return;

          const name = rawName;
          const status = data.status || "";

          if (!studentMap[name]) {
            studentMap[name] = {};
          }

          studentMap[name][date] = status;
        });
      }

      if (allDates.length === 0 || Object.keys(studentMap).length === 0) {
        alert("No attendance records found.");
        return;
      }

      const sortedDates = allDates.sort();
      const studentNames = Object.keys(studentMap).sort();
      const csvRows: string[][] = [];

      csvRows.push(["Name", ...sortedDates]);

      for (const student of studentNames) {
        const row = [student];
        for (const date of sortedDates) {
          row.push(studentMap[student]?.[date] || "");
        }
        csvRows.push(row);
      }

      const csvContent = csvRows.map((row) => row.join(",")).join("\n");
      const fileName = `${subjectName.replace(/\s/g, "")}Attendance.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        alert("Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export attendance.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.titleGroup}>
            <Text style={styles.headerIcon}>📅</Text>
            <Text style={styles.headerTitle}>
              Attendance for {isToday ? "Today" : formatFullDate(date as string)}
            </Text>
          </View>
        </View>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.csvButton} onPress={shareAllAttendanceCSV}>
          <Text style={styles.csvButtonText}>📤 Share Full Attendance CSV</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0818C6" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalCount}>{students.length}</Text>
          </View>

          {students.map((student, idx) => (
            <View key={idx} style={styles.studentRow}>
              <Text style={styles.name}>
                {idx + 1}. {student.name?.trim() || ""}
              </Text>
              <View
                style={[styles.dot, { backgroundColor: getColor(student.status) }]}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backIcon: {
    marginTop: -15,
    fontSize: 40,
    color: "#0818C6",
    fontWeight: "bold",
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0818C6",
  },
  separator: {
    marginTop: 10,
    height: 2,
    backgroundColor: "#0818C6",
    width: "100%",
    borderRadius: 10,
  },
  csvButton: {
    backgroundColor: "#0818C6",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  csvButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  scroll: {
    paddingBottom: 120,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  totalLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  totalCount: {
    marginLeft: 6,
    fontWeight: "bold",
    color: "#0818C6",
  },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 12,
  },
  name: {
    fontSize: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 10,
  },
});
