import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import BeadleNav from "./BeadleNav";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons"; // for icons
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import GenerateQRModal from "../../components/GenerateQRModal"; // adjust path if needed

export default function ClassDetails() {
  const { classId } = useLocalSearchParams();
  const [qrVisible, setQrVisible] = useState(false);
  const [classInfo, setClassInfo] = useState<any>(null);
  const db = getFirestore();
  useEffect(() => {
    const fetchClass = async () => {
      if (!classId) return;
      const classRef = doc(db, "classes", classId as string);
      const docSnap = await getDoc(classRef);
      if (docSnap.exists()) {
        setClassInfo(docSnap.data());
      } else {
        console.warn("No such class!");
      }
    };
    fetchClass();
  }, [classId]);

  if (!classInfo || !classInfo.subjectCode) {
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="people-outline" size={16} /> Class Members
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>History</Text>
          {(classInfo.dates ?? []).map((date: string, index: number) => (
            <TouchableOpacity key={index} style={styles.historyRow}>
              <Text>{date}</Text>
              <Text>{">"}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => setQrVisible(true)}
        >
          <Text style={styles.qrText}>Generate QR</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <GenerateQRModal
        visible={qrVisible}
        onClose={() => setQrVisible(false)}
        classId={classId as string}
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
  section: {
    marginHorizontal: 24,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  qrButton: {
    backgroundColor: "#0818C6",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 30,
  },
  qrText: {
    color: "#fff",
    fontWeight: "600",
  },
});
