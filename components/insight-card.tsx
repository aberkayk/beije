import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import Colors from "@/constants/Colors";
import Icons from "@/constants/Icons";
import { Image } from "react-native";
import { Insight } from "@/types/insights";

interface InsightCardProps {
  insight: Insight;
  isFirstItem?: boolean;
  isLastItem?: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  isFirstItem,
  isLastItem,
}) => {
  return (
    <View
      style={[
        styles.container,
        isFirstItem && styles.firstItem,
        isLastItem && styles.lastItem,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Image source={Icons.card} style={styles.icon} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{insight.title}</Text>
          <Text
            style={styles.content}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {insight.content}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 16,
    maxHeight: 60,
  },
  firstItem: {
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
  lastItem: {
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  content: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  contentContainer: {
    flexDirection: "column",
    width: "85%",
  },
});
