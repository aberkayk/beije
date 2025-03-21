import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { View } from "./ui/view";
import { Text } from "./ui/text";
import Colors from "@/constants/Colors";
import { CycleData } from "@/types/menstruation";

const CIRCLE_RADIUS = 120;
const DOT_RADIUS = 6;
const STROKE_WIDTH = 20; // Yayın kalınlığı

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

  for (let i = 0; i < cycleData.totalDays; i++) {
    const angle = (i / cycleData.totalDays) * 2 * Math.PI - Math.PI / 2;
    const x = CIRCLE_RADIUS * Math.cos(angle);
    const y = CIRCLE_RADIUS * Math.sin(angle);

    let color = "#e2e2e2"; // Normal gün
    const day = cycleData.days.find(
      (d) => new Date(d.date).getDate() === i + 1
    );

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

    if (i + 1 === cycleData.currentDay) {
      color = "#117A65"; // Güncel gün (koyu yeşil)
    }

    const radius = color === "#e2e2e2" ? 2 : 6; // Normal günler için yarı boyut

    dots.push(<Circle key={i} cx={x} cy={y} r={radius} fill={color} />);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {new Date().toLocaleDateString("tr-TR", {
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
