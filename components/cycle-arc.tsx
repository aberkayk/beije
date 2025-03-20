import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { CycleData, MenstruationDay } from "@/types/menstruation";
import Colors from "@/constants/Colors";
import Svg, { Circle, G, Path } from "react-native-svg";

interface CycleArcProps {
  cycleData: CycleData;
}

export const CycleArc: React.FC<CycleArcProps> = ({ cycleData }) => {
  const { width } = Dimensions.get("window");
  const radius = width * 0.35;
  const dotRadius = 5;
  const center = { x: width / 2, y: radius + 80 };

  const getDotColor = (type: MenstruationDay["type"]) => {
    switch (type) {
      case "BLEEDING":
        return "#FF9E9E"; // Light coral color for top dots
      case "FERTILITY":
        return "#A8E6CF"; // Mint/turquoise for bottom dots
      case "OVULATION":
        return "#A8E6CF";
      default:
        return "#F0F0F0";
    }
  };

  const calculateDotPosition = (index: number, total: number) => {
    // Calculate angle from 0 to 180 degrees (PI radians)
    const angleStep = Math.PI / (total - 1);
    const angle = index * angleStep;
    return {
      x: center.x + radius * Math.cos(angle),
      y: center.y - radius * Math.sin(angle),
    };
  };

  // Create the semi-circular arc path
  const createArcPath = () => {
    const startPoint = { x: center.x - radius, y: center.y };
    const endPoint = { x: center.x + radius, y: center.y };
    return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 1 ${endPoint.x} ${endPoint.y}`;
  };

  return (
    <View style={styles.container}>
      <Svg width={width} height={radius * 2 + 120}>
        {/* Semi-circular arc */}
        <Path
          d={createArcPath()}
          stroke="#F0F0F0"
          strokeWidth={2}
          fill="none"
        />

        {/* Dots */}
        <G>
          {Array.from({ length: cycleData.totalDays }).map((_, index) => {
            const pos = calculateDotPosition(index, cycleData.totalDays);
            const day = cycleData.days.find(
              (d) => new Date(d.date).getDate() === index + 1
            );
            const dotColor = getDotColor(day?.type || "NORMAL");
            const isCurrentDay = index + 1 === cycleData.currentDay;

            return (
              <Circle
                key={index}
                cx={pos.x}
                cy={pos.y}
                r={dotRadius}
                fill={dotColor}
                opacity={isCurrentDay ? 1 : 0.6}
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
