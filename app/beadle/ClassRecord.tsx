import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import BeadleNav from "./BeadleNav";

export default function ClassRecord() {
  const { classId } = useLocalSearchParams();
  const db = getFirestore();
  const router = useRouter();

  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceDates = async () => {
      if (!classId) return;

      try {
        const attendanceRef = collection(db, "classes", classId as string, "attendance");
        const snapshot = await getDocs(attendanceRef);

        const dateList: string[] = [];
        snapshot.forEach((doc) => {
          dateList.push(doc.id); // doc.id is the date
        });

        // Sort by most recent first
        dateList.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        setDates(dateList);
      } catch (error) {
        console.error("Error fetching attendance dates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceDates();
  }, [classId]);

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Past Attendance Records</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? (
          <ActivityIndicator size="large" color="#0818C6" />
        ) : dates.length === 0 ? (
          <Text style={styles.noRecords}>No attendance records found.</Text>
        ) : (
          dates.map((date) => (
            <TouchableOpacity
              key={date}
              style={styles.recordItem}
              onPress={() =>
                router.push({
                  pathname: "./RecordHistory",
                  params: {
                    date,
                    classId: classId as string,
                  },
                })
              }
            >
              <Text style={styles.recordText}>📅 {date}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <BeadleNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 20 },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  recordItem: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  recordText: {
    fontSize: 16,
  },
  noRecords: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
});
