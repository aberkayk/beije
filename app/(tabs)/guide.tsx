import { StyleSheet, Text, View } from "react-native";
import React from "react";

const GuideScreen = () => {
  return (
    <View style={styles.container}>
      <Text>GuideScreen</Text>
    </View>
  );
};

export default GuideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
