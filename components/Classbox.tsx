import React from "react";
import { View, Text, StyleSheet, Image, Modal } from "react-native";
import { Appbar, Avatar } from "react-native-paper";

const ClassBox = () => {
  return (
    <View style={styles.subjectContainer}>
      <Text style={styles.Title}></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  subjectContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    height: 65,
  },
  Title: {},
});

export default ClassBox;
