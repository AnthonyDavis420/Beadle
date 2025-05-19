import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AddSubjectModal from "../components/AddSubjectModal";
import Header from "../components/Header";
import BeadleNav from "./beadle/BeadleNav";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function BeadleHome() {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [editClass, setEditClass] = useState<any>(null);
  const [classes, setClasses] = useState<
    {
      id: string;
      subjectCode: string;
      subjectName: string;
      teacherName: string;
      room: string;
      dayTime: string;
      classCode: string;
    }[]
  >([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "classes"),
      where("teacherId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const classList: any[] = [];
      snapshot.forEach((doc) => {
        classList.push({ id: doc.id, ...doc.data() });
      });
      setClasses(classList);
    });

    return () => unsubscribe();
  }, [user]);

  const generateClassCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleAddClass = async (classData: {
    subjectCode: string;
    subjectName: string;
    teacherName: string;
    room: string;
    dayTime: string;
  }) => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      console.error("No authenticated user.");
      return;
    }

    try {
      if (editClass) {
        const classRef = doc(db, "classes", editClass.id);
        await setDoc(classRef, {
          ...editClass,
          ...classData,
        });
      } else {
        const classCode = generateClassCode();
        await addDoc(collection(db, "classes"), {
          ...classData,
          classCode,
          teacherId: currentUser.uid, 
          createdAt: new Date(),
        });
      }

      setModalVisible(false);
      setEditClass(null);
    } catch (error) {
      console.error("Error saving class:", error);
    }
  };

  const handleDeleteClass = (classId: string) => {
    Alert.alert("Delete Class", "Are you sure you want to delete this class?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "classes", classId));
          } catch (err) {
            console.error("Error deleting class:", err);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Courses</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {classes.map((cls) => (
          <TouchableOpacity
            key={cls.id}
            onPress={() =>
              router.push({
                pathname: "/beadle/ClassDetails",
                params: { classId: cls.id },
              })
            }
          >
            <View style={styles.classBox}>
              <View style={styles.headerRow}>
                <Text style={styles.subjectCode}>{cls.subjectCode}</Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditClass(cls);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.editIcon}>✎</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteClass(cls.id)}>
                    <Text style={styles.editIcon}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.subjectName}>{cls.subjectName}</Text>
              <Text style={styles.teacherName}>{cls.teacherName}</Text>
              <Text style={styles.classCode}>Code: {cls.classCode}</Text>
              <View style={styles.footerRow}>
                <Text style={styles.room}>{cls.room}</Text>
                <Text style={styles.time}>{cls.dayTime}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.addClassBox}
          onPress={() => {
            setEditClass(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addClassText}>Add Class +</Text>
        </TouchableOpacity>
      </ScrollView>

      <AddSubjectModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditClass(null);
        }}
        onSubmit={handleAddClass}
        defaultValues={editClass}
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
  title: {
    fontSize: 18,
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 20,
    color: "#0818C6",
    fontWeight: "bold",
  },
  addClassText: {
    paddingVertical: 10,
  },
  classBox: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
    marginHorizontal: 20,
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
    marginLeft: 10,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
  teacherName: {
    fontSize: 14,
    marginBottom: 4,
  },
  classCode: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
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
  addClassBox: {
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
});
