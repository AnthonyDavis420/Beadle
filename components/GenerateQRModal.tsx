import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Clipboard,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

interface Props {
  visible: boolean;
  onClose: () => void;
  classId: string;
}

export default function GenerateQRModal({ visible, onClose, classId }: Props) {
  const [qrLink, setQrLink] = useState<string | null>(null);

  const db = getFirestore();

  const generateQR = async () => {
    try {
      const sessionRef = await addDoc(collection(db, "classes", classId, "sessions"), {
        createdAt: serverTimestamp(),
      });

      const sessionId = sessionRef.id;

      const link = `https://beadleapp.com/attend/${classId}?session=${sessionId}`;
      setQrLink(link);
    } catch (error) {
      console.error("Failed to generate QR:", error);
      Alert.alert("Error", "Could not generate QR code.");
    }
  };

  const handleCopy = () => {
    if (qrLink) {
      Clipboard.setString(qrLink);
      Alert.alert("Copied", "Link copied to clipboard.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Generate Attendance QR</Text>

          {!qrLink ? (
            <TouchableOpacity style={styles.button} onPress={generateQR}>
              <Text style={styles.buttonText}>Generate QR</Text>
            </TouchableOpacity>
          ) : (
            <>
              <QRCode value={qrLink} size={200} />
              <Text style={styles.linkText}>{qrLink}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                <Text style={styles.copyText}>Copy Link</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Close</Text>
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
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0818C6",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  linkText: {
    fontSize: 12,
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  copyButton: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 15,
  },
  copyText: {
    fontWeight: "600",
    color: "#0818C6",
  },
  cancel: {
    marginTop: 10,
  },
  cancelText: {
    color: "#0818C6",
    fontWeight: "600",
  },
});
