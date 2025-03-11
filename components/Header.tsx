import React from "react";
import { View, Text, StyleSheet, Image, Modal } from "react-native";
import { Appbar, Avatar } from "react-native-paper";

const Header = () => {
  return (
    <Appbar.Header style={styles.header}>
      {/* Greeting */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Hello, <Text style={styles.blueText}>Beadle</Text> 👋
        </Text>
      </View>
      {/* Replacing Search Icon with Image */}
      <Image
        source={require("../assets/images/Search.svg")}
        style={styles.image}
      />

      {/* Profile Avatar */}
      <Image
        source={require("../assets/images/profile.svg")}
        style={styles.profile}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    height: 65,
  },
  title: {
    margin: 24,
    fontSize: 18,
    fontWeight: "medium",
  },
  icon: {
    width: 24, // Adjust width
    height: 24, // Adjust height
    marginRight: 10, // Space between image and avatar
  },
  image: {
    width: 24,
    height: 24,
  },
  profile: {
    width: 33,
    height: 33,
    margin: 24,
  },
  titleContainer: {
    flex: 1,
  },
  blueText: {
    color: "blue",
  },
});

export default Header;
