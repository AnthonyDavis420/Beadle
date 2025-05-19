import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function JoinClassModal({ visible, onClose }: Props) {
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const db = getFirestore();
  const auth = getAuth();
  const router = useRouter();

  const handleJoin = async () => {
    if (!classCode) {
      Alert.alert("Error", "Please enter a class code.");
      return;
    }

    setLoading(true);

    try {
      const q = query(
        collection(db, "classes"),
        where("classCode", "==", classCode)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Invalid Code", "No class found with that code.");
        setLoading(false);
        return;
      }

      const classDoc = querySnapshot.docs[0];
      const classId = classDoc.id;
      const studentId = auth.currentUser?.uid;

      if (!studentId) {
        Alert.alert("Error", "User not authenticated.");
        setLoading(false);
        return;
      }

      const studentUserDoc = await getDoc(doc(db, "users", studentId));
      const studentData = studentUserDoc.exists() ? studentUserDoc.data() : {};

      // Check if already joined
      const alreadyRef = doc(db, "students", studentId, "enrolledClasses", classId);
      const alreadySnap = await getDoc(alreadyRef);
      if (alreadySnap.exists()) {
        Alert.alert("Already Joined", "You have already joined this class.");
        setLoading(false);
        return;
      }

      // Save under student's list
      await setDoc(alreadyRef, classDoc.data());

      // ✅ Save to classes/{classId}/enrolledStudents/{studentId}
      const enrolledRef = doc(db, "classes", classId, "enrolledStudents", studentId);
      await setDoc(enrolledRef, {
        uid: studentId,
        name: studentData.name ?? "",
        email: studentData.email ?? auth.currentUser?.email ?? "",
      });

      Alert.alert("Success", "You have joined the class!");
      setClassCode("");
      onClose();
      router.replace("/student-home");
    } catch (error) {
      console.error("Join class failed:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Join a Class</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Class Code"
            value={classCode}
            onChangeText={setClassCode}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleJoin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Join</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0818C6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancel: {
    marginTop: 15,
    alignItems: "center",
  },
  cancelText: {
    color: "#0818C6",
    fontWeight: "600",
  },
});
