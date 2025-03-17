import React from "react";
import { View, Text, StyleSheet, Image, Modal } from "react-native";
import { Appbar, Avatar } from "react-native-paper";

const ClassBox = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.Container}>
        <View style={styles.subjectContainer}>
          <Text style={styles.Title}>ITEC303.N3Am</Text>
          <Text style={styles.Title}>MOBILE COMPUTING AND COMMUNICATION</Text>
          <Text style={styles.Title}>Kevin G. Vega</Text>
          <View style={styles.sectionAndTime}>
            <Text style={styles.Title}>AL212/CSLAB3</Text>
            <Text style={styles.Title}>TTH 03:00PM-04:30PM</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    borderWidth: 1,
  },
  subjectContainer: {
    backgroundColor: "#fff",
  },
  Title: {},
  sectionAndTime: {
    flexDirection: "row",
  },
});

export default ClassBox;
