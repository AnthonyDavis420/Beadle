import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Header from "../components/Header";
import StudentNav from "./beadle/BeadleNav";
import JoinClassModal from "../components/JoinClassModal";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";

interface ClassInfo {
  id: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  room: string;
  dayTime: string;
}

export default function StudentHome() {
  const [modalVisible, setModalVisible] = useState(false);
  const [joinedClasses, setJoinedClasses] = useState<ClassInfo[]>([]);
  const router = useRouter();
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchValidClasses = async () => {
      const ref = collection(db, "students", user.uid, "enrolledClasses");
      const snapshot = await getDocs(ref);

      const classes: ClassInfo[] = [];

      for (const docSnap of snapshot.docs) {
        const classId = docSnap.id;
        const classRef = doc(db, "classes", classId);
        const classDoc = await getDoc(classRef);

        if (classDoc.exists()) {
          classes.push({ id: classId, ...docSnap.data() } as ClassInfo);
        }
      }

      setJoinedClasses(classes);
    };

    fetchValidClasses();
  }, [user]);

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.courses}>Courses</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {joinedClasses.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              router.push({
                pathname: "/student/ClassDetails",
                params: { classId: item.id },
              })
            }
          >
            <View style={styles.classBox}>
              <Text style={styles.subjectCode}>{item.subjectCode}</Text>
              <Text style={styles.subjectName}>{item.subjectName}</Text>
              <Text style={styles.teacherName}>{item.teacherName}</Text>
              <View style={styles.footerRow}>
                <Text style={styles.room}>{item.room}</Text>
                <Text style={styles.time}>{item.dayTime}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.joinClassButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.joinClassText}>Join Class +</Text>
        </TouchableOpacity>
      </ScrollView>

      <JoinClassModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <StudentNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  courses: {
    padding: 30,
    fontSize: 18,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  joinClassButton: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    borderColor: "#8A8A8A",
    borderRadius: 10,
    alignItems: "center",
  },
  joinClassText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0818C6",
  },
  classBox: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  subjectCode: {
    fontSize: 12,
    color: "#555",
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
  teacherName: {
    fontSize: 14,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  room: {
    fontSize: 12,
  },
  time: {
    fontSize: 12,
  },
});
