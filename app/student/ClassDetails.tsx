import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Header from "../../components/Header";
import StudentNav from "../beadle/BeadleNav"; 
import { useRouter } from "expo-router";

export default function ClassDetails() {
  const { classId } = useLocalSearchParams();
  const db = getFirestore();
  const [classInfo, setClassInfo] = useState<any>(null);
  const router = useRouter();

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

        <View style={styles.counterContainer}>
          <View style={styles.counterBox}>
            <Text style={styles.counterLabel}>Present</Text>
            <Text style={styles.counterValue}>1</Text>
          </View>
          <View style={styles.counterBox}>
            <Text style={styles.counterLabel}>Absent</Text>
            <Text style={styles.counterValue}>2</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.classMembersRow}
          onPress={() =>
            router.push({
              pathname: "/shared/ClassMembers",
              params: { classId: classId as string },
            })
          }
        >
          <Text style={styles.classMembersText}>👥 Class Members</Text>
        </TouchableOpacity>

        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Date</Text>
          <Text style={styles.historyTitle}>Status</Text>
        </View>

        <TouchableOpacity style={styles.historyRow}>
          <Text style={styles.historyDate}>Today</Text>
          <Text style={styles.historyStatus}>Present</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyRow}>
          <Text style={styles.historyDate}>2/23/2025</Text>
          <Text style={styles.historyStatus}>Present</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyRow}>
          <Text style={styles.historyDate}>2/23/2025</Text>
          <Text style={styles.historyStatus}>Absent</Text>
        </TouchableOpacity>
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
  classMembersRow: {
    marginHorizontal: 24,
    marginTop: 25,
  },
  classMembersText: {
    fontWeight: "600",
    fontSize: 14,
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
    fontWeight: "500",
  },
});
