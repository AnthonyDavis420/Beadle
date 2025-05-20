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
  getDocs,
} from "firebase/firestore";

export default function RecordHistory() {
  const { date, classId } = useLocalSearchParams();
  const db = getFirestore();
  const router = useRouter();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    if (!classId || !date) return;

    const fetchData = async () => {
      try {
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

  const getColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "#2ecc71";
      case "late":
        return "#f1c40f";
      case "absent":
        return "#e74c3c";
      default:
        return "#bdc3c7"; // unmarked
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
                {idx + 1}. {student.name || "Unnamed"}
              </Text>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: getColor(student.status) },
                ]}
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
