import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Header from "../../components/Header";
import BeadleNav from "./BeadleNav";
import GenerateQRModal from "../../components/GenerateQRModal";
import { Ionicons } from "@expo/vector-icons";

export default function ClassDetails() {
  const { classId } = useLocalSearchParams();
  const router = useRouter();
  const db = getFirestore();

  const [classInfo, setClassInfo] = useState<any>(null);
  const [qrVisible, setQrVisible] = useState(false);

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
        <Text style={{ marginTop: 100, textAlign: "center" }}>
          Loading class...
        </Text>
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

        <TouchableOpacity
          style={styles.attendanceButton}
          onPress={() =>
            router.push({
              pathname: "/beadle/TodayAttendance",
              params: { classId: classId as string },
            })
          }
        >
          <Text style={styles.attendanceText}>Check Today's Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.classMembersRow}
          onPress={() =>
            router.push({
              pathname: "../shared/ClassMembers",
              params: { classId: classId as string },
            })
          }
        >
          <Text style={styles.classMembersText}>
            <Ionicons name="people-outline" size={16} /> Class Members
          </Text>
        </TouchableOpacity>

        <Text style={styles.historyLabel}>Attendance History</Text>
      </ScrollView>

      {/* QR Button */}
      <TouchableOpacity
        style={styles.floatingQRButton}
        onPress={() => setQrVisible(true)}
      >
        <Text style={styles.qrText}>Show QR</Text>
      </TouchableOpacity>

      <GenerateQRModal
        visible={qrVisible}
        onClose={() => setQrVisible(false)}
        classId={classId as string}
        onGenerated={({ token, date }) => {
          console.log("QR Token Generated:", token);
        }}
      />

      <BeadleNav />
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
  attendanceButton: {
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: "#0818C6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  attendanceText: {
    color: "#fff",
    fontWeight: "600",
  },
  classMembersRow: {
    marginHorizontal: 24,
    marginTop: 20,
  },
  classMembersText: {
    fontWeight: "600",
    fontSize: 14,
  },
  historyLabel: {
    marginHorizontal: 24,
    marginTop: 24,
    fontWeight: "bold",
    fontSize: 16,
  },
  floatingQRButton: {
    position: "absolute",
    bottom: 90,
    right: 24,
    backgroundColor: "#0818C6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 5,
  },
  qrText: {
    color: "#fff",
    fontWeight: "600",
  },
});
