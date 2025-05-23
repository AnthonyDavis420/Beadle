import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import TeacherNav from "./TeacherNav";

export default function Records() {
  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();

  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "classes"),
          where("teacherId", "==", user.uid) // ✅ matching your DB structure
        );
        const snapshot = await getDocs(q);
        const list: any[] = [];

        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        setClasses(list);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleSelectClass = (id: string) => {
    router.push({
      pathname: "./ClassRecord",
      params: { classId: id },
    });
  };

  return (
    <View style={styles.container}>
      {/* Main content area */}
      <View style={styles.content}>
        <Text style={styles.heading}>Attendance History</Text>
        <Text style={styles.subText}>Choose Class</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0818C6" style={{ marginTop: 30 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            {classes.length === 0 ? (
              <Text style={styles.subText}>No classes found.</Text>
            ) : (
              classes.map((cls) => (
                <TouchableOpacity
                  key={cls.id}
                  style={styles.classCard}
                  onPress={() => handleSelectClass(cls.id)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.classCode}>{cls.classCode || "No Code"}</Text>
                    <Ionicons name="pencil-outline" size={16} color="#444" />
                  </View>
                  <Text style={styles.classTitle}>{cls.subjectName || "Untitled"}</Text>
                  <Text style={styles.teacher}>{cls.teacherName || "Unnamed"}</Text>
                  <View style={styles.detailsRow}>
                    <Text style={styles.room}>{cls.room || "Room TBD"}</Text>
                    <Text style={styles.schedule}>{cls.dayTime || "Schedule TBD"}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation (fixed) */}
      <TeacherNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 12,
  },
  scroll: {
    paddingBottom: 24,
  },
  classCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  classCode: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
  },
  classTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 6,
  },
  teacher: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  room: {
    fontSize: 12,
    color: "#666",
  },
  schedule: {
    fontSize: 12,
    color: "#666",
  },
});
