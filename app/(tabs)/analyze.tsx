import { StyleSheet, Text, View } from "react-native";
import React from "react";

const AnalyzeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>AnalyzeScreen</Text>
    </View>
  );
};

export default AnalyzeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
