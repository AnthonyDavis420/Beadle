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
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function JoinClassModal({ visible, onClose }: Props) {
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const db = getFirestore();
  const auth = getAuth();

  const handleJoin = async () => {
    if (!classCode) {
      Alert.alert("Error", "Please enter a class code.");
      return;
    }

    setLoading(true);

    try {
      const q = query(collection(db, "classes"), where("classCode", "==", classCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Invalid Code", "No class found with that code.");
        setLoading(false);
        return;
      }

      const classDoc = querySnapshot.docs[0];
      const classData = classDoc.data();
      const student = auth.currentUser;

      if (!student) {
        Alert.alert("Error", "User not authenticated.");
        setLoading(false);
        return;
      }

      const studentRef = doc(db, "students", student.uid, "enrolledClasses", classDoc.id);
      const alreadyJoined = await getDoc(studentRef);

      if (alreadyJoined.exists()) {
        Alert.alert("Already Joined", "You are already enrolled in this class.");
        setLoading(false);
        return;
      }

      // Save under student's enrolledClasses
      await setDoc(studentRef, classData);

      // Save under class's enrolledStudents
      const enrolledRef = doc(db, "classes", classDoc.id, "enrolledStudents", student.uid);
      await setDoc(enrolledRef, {
        uid: student.uid,
        name: student.displayName ?? "Unnamed",
        email: student.email,
      });

      Alert.alert("Success", "You have joined the class!");
      setClassCode("");
      onClose();
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
            editable={!loading}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#0818C6" style={{ marginVertical: 20 }} />
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={handleJoin}>
                <Text style={styles.buttonText}>Join</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancel} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
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
