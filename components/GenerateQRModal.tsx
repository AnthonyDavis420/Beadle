import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  serverTimestamp,
  Timestamp,
  doc,
} from "firebase/firestore";
import uuid from "react-native-uuid";

interface Props {
  visible: boolean;
  classId: string;
  onClose: () => void;
}

export default function QRModal({ visible, classId, onClose }: Props) {
  const db = getFirestore();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchOrGenerateToken = async () => {
      if (!visible || !classId) return;
      setLoading(true);
      setToken(null);

      try {
        const tokensRef = collection(db, `classes/${classId}/attendanceTokens`);
        const q = query(tokensRef, where("date", "==", today));
        const snapshot = await getDocs(q);

        const now = new Date();
        let existingToken: string | null = null;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const expires = data.expiresAt?.toDate?.();
          if (expires && expires > now) {
            existingToken = data.token;
          }
        });

        if (existingToken) {
          setToken(existingToken);
          setLoading(false);
          return;
        }

        // Else, generate a new one
        const newToken = uuid.v4().toString();

        //const expiresAt = new Date(now.getTime() + 15 * 60000);

        await setDoc(doc(tokensRef, newToken), {
          token: newToken,
          classId,
          date: today,
          createdAt: serverTimestamp(),
          //expiresAt: Timestamp.fromDate(expiresAt),
          presentStudents: [],
        });

        setToken(newToken);
      } catch (error) {
        console.error("QR Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrGenerateToken();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Today's QR Code</Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#000"
              style={{ marginTop: 20 }}
            />
          ) : token ? (
            <QRCode value={token} size={200} />
          ) : (
            <Text style={{ marginTop: 20 }}>Failed to load QR.</Text>
          )}

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
  },
  close: {
    marginTop: 20,
    color: "#888",
    fontSize: 14,
  },
});
