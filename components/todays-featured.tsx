import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text as UIText } from "@/components/ui/text";
import { View as UIView } from "@/components/ui/view";
import Colors from "@/constants/Colors";
import { InsightCard } from "@/components/insight-card";
import { NoteCard } from "@/components/note-card";
import CycleScreen from "@/components/cycle-screen";
import { CycleData } from "@/types/menstruation";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  Easing,
} from "react-native-reanimated";

interface TodaysFeaturedProps {
  insights: any[];
  onSheetIndexChange?: (index: number) => void;
  cycleData?: CycleData;
}

const TodaysFeatured: React.FC<TodaysFeaturedProps> = ({
  insights,
  onSheetIndexChange,
  cycleData,
}) => {
  const [sheetIndex, setSheetIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const noteCardAnimation = useSharedValue(0);
  const noteCardVisibility = useSharedValue(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const position = useSharedValue(0);

  useEffect(() => {
    if (sheetIndex === 1) {
      position.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      noteCardAnimation.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      position.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      noteCardAnimation.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      // Reset selected day when sheet is closed
      setSelectedDay(null);
    }
  }, [sheetIndex]);

  // Animate note card visibility when selected day changes or sheet index changes
  useEffect(() => {
    const hasNote = selectedDay && selectedDay.note;
    const isExpanded = sheetIndex === 1;

    if (isExpanded && hasNote) {
      noteCardVisibility.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      noteCardVisibility.value = withTiming(0, {
        duration: 200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [selectedDay, sheetIndex]);

  const handleSheetIndexChange = (index: number) => {
    setSheetIndex(index);
    onSheetIndexChange?.(index);
  };

  const handleDaySelected = (dayData: any) => {
    setSelectedDay(dayData);
  };

  const noteCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        noteCardVisibility.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            noteCardVisibility.value,
            [0, 1],
            [10, 0],
            Extrapolate.CLAMP
          ),
        },
        {
          scale: interpolate(
            noteCardVisibility.value,
            [0, 1],
            [0.95, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
      height: interpolate(
        noteCardVisibility.value,
        [0, 1],
        [0, 91], // 67 (card height) + 24 (vertical margins)
        Extrapolate.CLAMP
      ),
      marginBottom: interpolate(
        noteCardVisibility.value,
        [0, 1],
        [0, 12],
        Extrapolate.CLAMP
      ),
      overflow: "hidden",
    };
  });

  return (
    <>
      {cycleData && (
        <CycleScreen
          cycleData={cycleData}
          position={position}
          onDaySelected={handleDaySelected}
        />
      )}
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
              <Animated.View style={noteCardAnimatedStyle}>
                <NoteCard note={selectedDay?.note} />
              </Animated.View>
            }
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

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

export default TodaysFeatured;
