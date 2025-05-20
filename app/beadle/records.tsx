import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/Header";
import BeadleNav from "./BeadleNav";
import { useRouter } from "expo-router";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Records() {
  const db = getFirestore();
  const auth = getAuth();
  const router = useRouter();

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchRecords = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "attendance"),
          where("recordedBy", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const dateMap: Record<string, any> = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const key = `${data.date}_${data.classId}`;
          // Use first entry per date+class only
          if (!dateMap[key]) {
            dateMap[key] = { id: doc.id, ...data };
          }
        });

        const uniqueRecords = Object.values(dateMap);

        uniqueRecords.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setRecords(uniqueRecords);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.pageTitle}>Attendance History</Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? (
          <ActivityIndicator size="large" color="#0818C6" />
        ) : records.length === 0 ? (
          <Text style={styles.noRecords}>No attendance records found.</Text>
        ) : (
          records.map((record) => (
            <TouchableOpacity
              key={record.id} // ✅ unique key to avoid error
              style={styles.recordItem}
              onPress={() =>
                router.push({
                  pathname: "./RecordHistory",
                  params: {
                    date: record.date,
                    classId: record.classId,
                  },
                })
              }
            >
              <Text style={styles.recordText}>
                📅 {record.date}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <BeadleNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 10,
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
