import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

export default function App() {
  const [visible, setVisible] = useState(true);
  const opacity = useSharedValue(1); // Starts fully visible

  useEffect(() => {
    fadeIn();
  }, []);

  const fadeIn = () => {
    opacity.value = withTiming(1, {
      duration: 1000, // Fade-in duration
      easing: Easing.ease,
    });
  };

  const fadeOut = () => {
    opacity.value = withTiming(0, {
      duration: 1000, // Fade-out duration
      easing: Easing.ease,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, animatedStyle]}>
        <Text style={styles.text}>Fade In & Out Animation</Text>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (visible) {
            fadeOut();
          } else {
            fadeIn();
          }
          setVisible(!visible);
        }}
      >
        <Text style={styles.buttonText}>{visible ? "Fade Out" : "Fade In"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  box: {
    width: 250,
    height: 100,
    backgroundColor: "#0818C6",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#FF5733",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
