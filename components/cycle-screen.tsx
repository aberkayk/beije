import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";
import { View } from "./ui/view";
import { Text } from "./ui/text";
import Colors from "@/constants/Colors";
import { CycleData } from "@/types/menstruation";

const CIRCLE_RADIUS = 120;
const DOT_RADIUS = 6;
const STROKE_WIDTH = 20; // Yayın kalınlığı

// Nokta boyutları
const NORMAL_DOT_RADIUS = 2;
const SPECIAL_DOT_RADIUS = 6;
const CURRENT_DAY_RADIUS = 12;

interface CycleScreenProps {
  cycleData: CycleData;
}

const getArcPath = (radius: number, strokeWidth: number) => {
  const r = radius - strokeWidth / 2;
  return `
  M ${-r} 0 
  A ${r} ${r} 0 1 1 ${r} 0 
  A ${r} ${r} 0 1 1 ${-r} 0
  `;
};

const CycleScreen: React.FC<CycleScreenProps> = ({ cycleData }) => {
  const dots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Döngünün başlangıç gününü bul (en eski tarih)
  const cycleStartDate = new Date(cycleData.days[0].date);
  cycleStartDate.setHours(0, 0, 0, 0);

  // Gösterilecek tarihi hesapla (başlangıç tarihi + current day)
  const displayDate = new Date(cycleStartDate);
  displayDate.setDate(displayDate.getDate() + (cycleData.currentDay - 1)); // currentDay 1-based index

  console.log("CycleScreen Debug:");
  console.log("Today:", today.toISOString());
  console.log("Display Date:", displayDate.toISOString());
  console.log("Cycle Data:", {
    totalDays: cycleData.totalDays,
    currentDay: cycleData.currentDay,
    daysCount: cycleData.days.length,
    days: cycleData.days.map((d) => ({
      date: d.date,
      type: d.type,
    })),
  });

  // Bugünün konumunu saklamak için değişkenler
  let currentDayX = 0;
  let currentDayY = 0;

  for (let i = 0; i < cycleData.totalDays; i++) {
    const angle = (i / cycleData.totalDays) * 2 * Math.PI - Math.PI / 2;
    const x = CIRCLE_RADIUS * Math.cos(angle);
    const y = CIRCLE_RADIUS * Math.sin(angle);

    let color = "#e2e2e2"; // Normal gün
    let isCurrentDay = i === cycleData.currentDay - 1; // currentDay 1-based index

    // Bugünün konumunu sakla
    if (isCurrentDay) {
      currentDayX = x;
      currentDayY = y;
    }

    // Bu pozisyona denk gelen günü bul
    const targetDate = new Date(cycleStartDate);
    targetDate.setDate(targetDate.getDate() + i);
    targetDate.setHours(0, 0, 0, 0);

    const day = cycleData.days.find((d) => {
      const dayDate = new Date(d.date);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate.getTime() === targetDate.getTime();
    });

    if (day) {
      switch (day.type) {
        case "BLEEDING":
          color = "#FF6B6B"; // Regl günleri (kırmızı)
          break;
        case "FERTILITY":
          color = "#A3E4D7"; // Doğurganlık günleri (yeşil)
          break;
        case "OVULATION":
          color = "#117A65"; // Ovulasyon günü (koyu yeşil)
          break;
        default:
          color = "#e2e2e2"; // Normal gün
      }
    }

    // Bugünün rengini ayarla
    if (isCurrentDay) {
      color = "#000000"; // Bugün için siyah renk
    }

    // Noktanın yarıçapını belirle
    let radius;
    if (isCurrentDay) {
      radius = CURRENT_DAY_RADIUS; // Bugün için 12px
    } else if (color === "#e2e2e2") {
      radius = NORMAL_DOT_RADIUS; // Normal günler için 2px
    } else {
      radius = SPECIAL_DOT_RADIUS; // Özel günler için 6px
    }

    dots.push(<Circle key={i} cx={x} cy={y} r={radius} fill={color} />);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {displayDate.toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "long",
        })}
      </Text>
      <Svg height="300" width="300" viewBox="-150 -150 300 300">
        {/* Gri Arka Plan (Tüm noktaların altında) */}
        <Path
          d={getArcPath(CIRCLE_RADIUS + 10, STROKE_WIDTH)}
          fill="none"
          stroke="#F3F3F3"
          strokeWidth={50}
        />

        {/* Beyaz İç Halka (Noktaların arkasında kalacak) */}
        <Path
          d={getArcPath(CIRCLE_RADIUS, STROKE_WIDTH - 20)}
          fill="none"
          stroke="white"
          strokeWidth={25}
        />

        {/* Noktalar */}
        {dots}

        {/* Bugün yazısı */}
        <SvgText
          x={currentDayX}
          y={currentDayY}
          fontSize="7"
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          Bugün
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundTertiary,
    alignItems: "center",
    paddingTop: "30%",
  },

  date: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 20,
    color: Colors.light.text,
    marginBottom: 25,
  },
});

export default CycleScreen;
