import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import LottieView from "lottie-react-native";
import Colors from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

export const CustomSplashScreen: React.FC = () => {
  const [repeatCount, setRepeatCount] = useState(0);

  const handleAnimationFinish = () => {
    if (repeatCount < 2) {
      setRepeatCount((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animation_splash.json")}
        autoPlay
        loop={repeatCount < 2}
        onAnimationFinish={handleAnimationFinish}
        style={styles.animation}
      />
      <View style={styles.logoContainer}>
        <Image source={require("../assets/images/logo.png")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: width * 0.8,
    height: width * 0.8,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDECE7",
  },
  logoContainer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
