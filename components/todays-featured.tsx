import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  Pressable,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text as UIText } from "@/components/ui/text";
import { View as UIView } from "@/components/ui/view";
import Colors from "@/constants/Colors";
import { InsightCard } from "@/components/insight-card";
import { NoteCard } from "@/components/note-card";

interface TodaysFeaturedProps {
  insights: any[];
  onSheetIndexChange?: (index: number) => void;
}

const TodaysFeatured: React.FC<TodaysFeaturedProps> = ({
  insights,
  onSheetIndexChange,
}) => {
  const [sheetIndex, setSheetIndex] = useState(0);
  const noteCardAnimation = useRef(new Animated.Value(0)).current;
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (sheetIndex === 1) {
      Animated.timing(noteCardAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(noteCardAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [sheetIndex]);

  const handleSheetIndexChange = (index: number) => {
    setSheetIndex(index);
    onSheetIndexChange?.(index);
  };

  return (
    <BottomSheet
      index={0}
      snapPoints={["20%", 500]}
      backgroundStyle={{ backgroundColor: Colors.light.background }}
      handleIndicatorStyle={styles.bottomSheetIndicator}
      ref={bottomSheetRef}
      onChange={handleSheetIndexChange}
      maxDynamicContentSize={500}
    >
      <BottomSheetView
        style={[
          styles.insightsContainer,
          { backgroundColor: Colors.light.background },
        ]}
      >
        <UIText style={styles.insightsTitle}>Bugün Öne Çıkanlar</UIText>

        <FlatList
          data={insights}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <InsightCard
              insight={item}
              isFirstItem={index === 0}
              isLastItem={index === (insights?.length ?? 0) - 1}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          ItemSeparatorComponent={() => (
            <UIView
              style={{
                height: 1,
                backgroundColor: Colors.light.background,
              }}
            />
          )}
          ListHeaderComponent={
            sheetIndex === 1 ? (
              <Animated.View
                style={{
                  opacity: noteCardAnimation,
                  transform: [
                    {
                      translateY: noteCardAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }}
              >
                <NoteCard />
              </Animated.View>
            ) : null
          }
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default TodaysFeatured;

const styles = StyleSheet.create({
  bottomSheetIndicator: {
    backgroundColor: Colors.light.textSecondary,
  },
  insightsContainer: {
    padding: 24,
    flex: 1,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: Colors.light.text,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});
