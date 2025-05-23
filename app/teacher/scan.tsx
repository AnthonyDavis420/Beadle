import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  getFirestore,
  collectionGroup,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ScanQRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);

    try {
      const tokenSnapshot = await collectionGroup(db, "attendanceTokens");
      const querySnapshot = await getDocs(tokenSnapshot);

      let matched = false;

      for (const docSnap of querySnapshot.docs) {
        const tokenDoc = docSnap.data();
        if (tokenDoc.token === data) {
          matched = true;

          const studentId = auth.currentUser?.uid;
          if (!studentId) {
            Alert.alert("Error", "Student not logged in.");
            break;
          }

          const tokenRef = docSnap.ref;

          // ✅ 1. Update presentStudents array
          await updateDoc(tokenRef, {
            presentStudents: arrayUnion(studentId),
          });

          // ✅ 2. Add attendance log in /attendance/{date}/{studentId}
          const todayDate = new Date().toISOString().split("T")[0];
          const attendanceRef = doc(
            db,
            `classes/${tokenDoc.classId}/attendance/${todayDate}/${studentId}`
          );

          await setDoc(attendanceRef, {
            uid: studentId,
            status: "Present",
            timestamp: new Date(),
          });

          Alert.alert("Success", "Your attendance has been recorded.");
          break;
        }
      }

      if (!matched) {
        Alert.alert("Invalid QR", "This QR code is not recognized.");
      }
    } catch (err) {
      console.error("Scan error:", err);
      Alert.alert("Error", "Something went wrong.");
    }

    setLoading(false);
    setTimeout(() => setScanned(false), 2000);
  };

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return <Text>No access to camera. Please enable it in settings.</Text>;
  }

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="#0818C6" style={styles.loading} />
      )}

      <CameraView
        ref={cameraRef}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && !loading && (
        <View style={styles.overlay}>
          <Text style={styles.statusText}>Scanned. Resetting...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    zIndex: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
  },
});
