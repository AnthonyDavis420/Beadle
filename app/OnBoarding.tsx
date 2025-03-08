import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

const slides = [
  {
    id: 1,
    title: "Welcome to Beadle!",
    description: "Easily take attendance with QR code scanning.",
    image: require("../assets/images/scan.svg"),
  },
  {
    id: 2,
    title: "Create and Manage Classes",
    description: "Organize student attendance records effortlessly.",
    image: require("../assets/images/qr.svg"),
  },
  {
    id: 3,
    title: "Track Attendance in Real-Time",
    description: "Stay updated with instant logs and records.",
    image: require("../assets/images/Organized.svg"),
  },
];
{
  /* GPT HAHAHAHHAAH */
}
export default function OnBoarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace("/login");
    }
  };
  /* GPT HAHAHAHHAAH */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{slides[currentSlide].title}</Text>
      <Image source={slides[currentSlide].image} style={styles.image} />
      <Text style={styles.description}>{slides[currentSlide].description}</Text>

      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSlide === index ? styles.activeIndicator : null,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={nextSlide}>
        <Text style={styles.buttonText}>
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },

  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0818C6",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    marginBottom: 40,
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    position: "absolute",
    bottom: 90,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D3D3D3",
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "#0818C6",
  },
  button: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "#0818C6",
    paddingVertical: 15,
    width: 382,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
