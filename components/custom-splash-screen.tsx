import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import LottieView from "lottie-react-native";
import Colors from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

interface Props {
  onAnimationFinish?: () => void;
}

export const CustomSplashScreen: React.FC<Props> = ({
  onAnimationFinish,
}: Props) => {
  const [repeatCount, setRepeatCount] = useState(0);
  const animationRef = useRef<LottieView>(null);

  const handleAnimationFinish = () => {
    console.log({ repeatCount });
    if (repeatCount < 2) {
      setRepeatCount((prev) => prev + 1);
      // Restart the animation
      animationRef.current?.reset();
      animationRef.current?.play();
    } else {
      onAnimationFinish?.();
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../assets/animation_splash.json")}
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={handleAnimationFinish}
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
