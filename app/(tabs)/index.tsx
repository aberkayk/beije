import {
  StyleSheet,
  View as RNView,
  Pressable,
  FlatList,
  Animated,
} from "react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useSelector } from "react-redux";
import { selectProfile } from "@/redux/auth/slice";
import { useGetMenstruationDaysQuery } from "@/redux/menstruation-days/services";
import { useGetInsightsQuery } from "@/redux/insights/services";
import { useMemo, useRef, useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import Icons from "@/constants/Icons";
import { Image } from "react-native";
import { CycleArc } from "@/components/cycle-arc";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { InsightCard } from "@/components/insight-card";
import { NoteCard } from "@/components/note-card";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CycleScreen() {
  const profile = useSelector(selectProfile);
  const [sheetIndex, setSheetIndex] = useState(0);
  const noteCardAnimation = useRef(new Animated.Value(0)).current;
  const {
    data: menstruationData,
    isLoading: isLoadingMenstruation,
    error: menstruationError,
  } = useGetMenstruationDaysQuery();
  const { data: insightsData } = useGetInsightsQuery();
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

  const cycleData = useMemo(() => {
    if (
      !menstruationData?.data?.menstrationDays ||
      !menstruationData?.data?.cycleInfo
    )
      return null;

    const { menstrationDays: days, cycleInfo } = menstruationData.data;
    return {
      totalDays: cycleInfo.totalDays,
      currentDay: cycleInfo.currentDay,
      days,
    };
  }, [menstruationData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.profileButton}>
          <Text style={styles.profileLetter}>
            {profile?.profileInfo.firstName[0].toUpperCase()}
          </Text>
        </Pressable>
        <Pressable style={styles.notificationButton}>
          <Image source={Icons.bell} style={styles.notificationIcon} />
        </Pressable>
      </View>

      <Text style={styles.date}>13 Ekim</Text>
      {cycleData && <CycleArc cycleData={cycleData} />}

      <BottomSheet
        index={0}
        snapPoints={["25%", 500]}
        backgroundStyle={{ backgroundColor: Colors.light.background }}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        ref={bottomSheetRef}
        onChange={setSheetIndex}
        maxDynamicContentSize={500}
      >
        <BottomSheetView
          style={[
            styles.insightsContainer,
            { backgroundColor: Colors.light.background },
          ]}
        >
          <Text style={styles.insightsTitle}>Bugün Öne Çıkanlar</Text>

          <FlatList
            data={insightsData?.data.insights}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <InsightCard
                insight={item}
                isFirstItem={index === 0}
                isLastItem={
                  index === (insightsData?.data?.insights?.length ?? 0) - 1
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            ItemSeparatorComponent={() => (
              <View
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
              ) : (
                <></>
              )
            }
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundTertiary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: Colors.light.backgroundTertiary,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
  },
  profileLetter: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  notificationButton: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    width: 14,
    height: 16.54,
    tintColor: Colors.light.text,
  },
  date: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 20,
    color: Colors.light.text,
  },
  bottomSheet: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetBackground: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
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
  insightText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  expandedContent: {
    marginTop: 24,
  },
  expandedTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 16,
  },
  emptyExpandedView: {
    height: 200,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
  },
});
