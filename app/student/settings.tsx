import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Header from "../../components/StudentHeader";
import BeadleNav from "./StudentNav";

export default function SettingsScreen() {
  const [name, setName] = useState("");
  const [initialName, setInitialName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [initialTeacherId, setInitialTeacherId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  // Request permission for media library on mount
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setInitialName(data.name || "");
          setTeacherId(data.id || "");
          setInitialTeacherId(data.id || "");
          setEmail(user.email || "");
          // If you saved image URL in Firestore, you can set it here, e.g.
          // setImageUri(data.profileImageUrl || null);
        } else {
          Alert.alert("Error", "User data not found.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Detect if inputs changed
  useEffect(() => {
    if (name !== initialName || teacherId !== initialTeacherId) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [name, teacherId, initialName, initialTeacherId]);

  // Handle image picking
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setIsChanged(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  // Handle save button
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Update Firestore user doc
      await updateDoc(doc(db, "users", user.uid), {
        name,
        id: teacherId,
        // Add image URL if you upload image to storage and get URL
        // profileImageUrl: uploadedImageUrl,
      });

      setInitialName(name);
      setInitialTeacherId(teacherId);
      setIsChanged(false);

      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {/* Image picker button */}
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.profileImage} />
          ) : (
            <MaterialIcons name="add-a-photo" size={40} color="gray" />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Teacher's ID</Text>
        <TextInput
          style={styles.input}
          value={teacherId}
          onChangeText={setTeacherId}
        />

        <Text style={styles.label}>Gmail</Text>
        <TextInput style={styles.input} value={email} editable={false} />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value="*************"
          secureTextEntry
          editable={false}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          isChanged ? styles.saveButtonActive : styles.saveButtonInactive,
        ]}
        onPress={handleSave}
        disabled={!isChanged}
      >
        <Text
          style={[
            styles.saveButtonText,
            isChanged
              ? styles.saveButtonTextActive
              : styles.saveButtonTextInactive,
          ]}
        >
          Save Changes
        </Text>
      </TouchableOpacity>

      <BeadleNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 20 },
  label: { fontSize: 14, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  loadingText: { marginTop: 100, textAlign: "center", fontSize: 16 },

  imagePicker: {
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 75,
    width: 150,
    height: 150,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },

  saveButton: {
    margin: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonInactive: {
    backgroundColor: "gray",
  },
  saveButtonActive: {
    backgroundColor: "#007BFF",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonTextInactive: {
    color: "#ccc",
  },
  saveButtonTextActive: {
    color: "white",
  },
});
