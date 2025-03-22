import { StyleSheet, Pressable, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useSelector } from "react-redux";
import { selectProfile } from "@/redux/auth/slice";
import { useGetMenstruationDaysQuery } from "@/redux/menstruation-days/services";
import { useGetInsightsQuery } from "@/redux/insights/services";
import { useMemo } from "react";
import Colors from "@/constants/Colors";
import Icons from "@/constants/Icons";
import React from "react";
import TodaysFeatured from "@/components/todays-featured";
import { CycleData } from "@/types/menstruation";

export default function HomeScreen() {
  const profile = useSelector(selectProfile);

  const {
    data: menstruationData,
    isLoading: isLoadingMenstruation,
    error: menstruationError,
  } = useGetMenstruationDaysQuery();

  const { data: insightsData } = useGetInsightsQuery();

  const cycleData = useMemo(() => {
    if (!menstruationData?.data.menstrationDays) return null;

    const days = menstruationData.data.menstrationDays;
    const cycleLength = menstruationData.data.cycleInfo.totalDays || 28;

    // Günleri tarihe göre sırala
    const sortedDays = [...days].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Döngünün başlangıç gününü bul (en eski tarih)
    const cycleStartDate = new Date(sortedDays[0].date);
    cycleStartDate.setHours(0, 0, 0, 0);

    // Bugünün kaçıncı gün olduğunu hesapla
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSinceStart = Math.floor(
      (today.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const currentDay =
      ((daysSinceStart % cycleLength) + cycleLength) % cycleLength;

    return {
      totalDays: cycleLength,
      currentDay: currentDay + 1, // 1-based index
      days: sortedDays,
    } as CycleData;
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

      <TodaysFeatured
        insights={insightsData?.data.insights ?? []}
        cycleData={cycleData ?? undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: Colors.light.backgroundTertiary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: Colors.light.backgroundTertiary,
    zIndex: 20,
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
