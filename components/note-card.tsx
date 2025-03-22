import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import Colors from "@/constants/Colors";

interface NoteCardProps {
  note?: string;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  return (
    <View style={[styles.container]}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Notlar</Text>
        <Text
          style={styles.content}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {note || "Seçilen gün için not bulunmamaktadır."}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 16,
    height: 67,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    borderRadius: 12,
  },
  firstItem: {
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 400,
    color: Colors.light.text,
    lineHeight: 24,
  },
  content: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  contentContainer: {
    flexDirection: "column",
    width: "100%",
  },
});
