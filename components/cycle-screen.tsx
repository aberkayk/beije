import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Circle, Path, Text as SvgText, G } from "react-native-svg";
import { View } from "./ui/view";
import { Text } from "./ui/text";
import Colors from "@/constants/Colors";
import { CycleData } from "@/types/menstruation";
import Animated, {
  useAnimatedProps,
  interpolate,
  Extrapolation,
  useAnimatedStyle,
} from "react-native-reanimated";

const CIRCLE_RADIUS = 144;
const DOT_RADIUS = 7.2;
const STROKE_WIDTH = 24;

const NORMAL_DOT_RADIUS = 2.4;
const SPECIAL_DOT_RADIUS = 7.2;
const CURRENT_DAY_RADIUS = 14.4;
const EXPANDED_DOT_RADIUS = 14.4;

interface CycleScreenProps {
  cycleData: CycleData;
  position?: Animated.SharedValue<number>;
}

const getArcPath = (radius: number, strokeWidth: number) => {
  const r = radius - strokeWidth / 2;
  return `
  M ${-r} 0 
  A ${r} ${r} 0 1 1 ${r} 0 
  A ${r} ${r} 0 1 1 ${-r} 0
  `;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const ChevronDown = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke="#ED5214"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CycleScreen: React.FC<CycleScreenProps> = ({
  cycleData,
  position,
}) => {
  const dots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cycleStartDate = new Date(cycleData.days[0].date);
  cycleStartDate.setHours(0, 0, 0, 0);

  const displayDate = new Date(cycleStartDate);
  displayDate.setDate(displayDate.getDate() + (cycleData.currentDay - 1));

  let currentDayX = 0;
  let currentDayY = 0;

  for (let i = 0; i < cycleData.totalDays; i++) {
    const angle = (i / cycleData.totalDays) * 2 * Math.PI - Math.PI / 2;

    const x = CIRCLE_RADIUS * Math.cos(angle);
    const y = CIRCLE_RADIUS * Math.sin(angle);

    console.log({ angle });

    let color = "#e2e2e2";
    let isCurrentDay = i === cycleData.currentDay - 1;

    if (isCurrentDay) {
      currentDayX = x;
      currentDayY = y;
    }

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
          color = "#ED5214";
          break;
        case "FERTILITY":
          color = "#A3E4D7";
          break;
        case "OVULATION":
          color = "#117A65";
          break;
        default:
          color = "#e2e2e2";
      }
    }

    if (isCurrentDay) {
      color = "#000000";
    }

    // Calculate if this dot should be animated
    const isLastThreeDays = i >= cycleData.totalDays - 3;
    const isFirstFourDays = i < 4;
    const shouldAnimate = isLastThreeDays || isFirstFourDays;

    const baseRadius = isCurrentDay
      ? CURRENT_DAY_RADIUS
      : color === "#e2e2e2"
      ? NORMAL_DOT_RADIUS
      : SPECIAL_DOT_RADIUS;

    const expandedRadius = isCurrentDay
      ? CURRENT_DAY_RADIUS + 4
      : EXPANDED_DOT_RADIUS;

    const animatedProps = useAnimatedProps(() => {
      if (!position) return { r: baseRadius, opacity: 1 };

      const progress = interpolate(
        position.value,
        [0, 1],
        [0, 1],
        Extrapolation.CLAMP
      );

      return {
        r: interpolate(
          progress,
          [0, 1],
          [baseRadius, expandedRadius],
          Extrapolation.CLAMP
        ),
        opacity: shouldAnimate
          ? 1
          : interpolate(progress, [0, 1], [1, 0], Extrapolation.CLAMP),
      };
    });

    dots.push(
      <AnimatedCircle
        key={i}
        cx={x}
        cy={y}
        r={shouldAnimate ? undefined : baseRadius}
        fill={color}
        animatedProps={animatedProps}
      />
    );
  }

  const getDayTypeText = (type: string) => {
    switch (type) {
      case "BLEEDING":
        return "Regl Günü";
      case "FERTILITY":
        return "Doğurganlık Günü";
      case "OVULATION":
        return "Ovulasyon Günü";
      default:
        return "Normal Gün";
    }
  };

  const selectedDay = cycleData.days.find((d) => {
    const dayDate = new Date(d.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === displayDate.getTime();
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (!position) return {};

    return {
      transform: [
        {
          translateY: interpolate(
            position.value,
            [0, 1],
            [0, -10],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const chevronAnimatedStyle = useAnimatedStyle(() => {
    if (!position) return {};

    return {
      opacity: interpolate(
        position.value,
        [0, 1],
        [0, 1],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          rotate: `${interpolate(
            position.value,
            [0, 1],
            [0, 1],
            Extrapolation.CLAMP
          )}deg`,
        },
      ],
    };
  });

  const backgroundPathAnimatedProps = useAnimatedProps(() => {
    if (!position) return { stroke: "#F3F3F3" };

    const progress = interpolate(
      position.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      stroke: progress > 0.5 ? "white" : "#F3F3F3",
    };
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <Text style={styles.date}>
        {displayDate.toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "long",
        })}
      </Text>
      <Animated.View style={chevronAnimatedStyle}>
        <ChevronDown />
      </Animated.View>
      {selectedDay && (
        <Text
          style={[
            styles.dayType,
            {
              color:
                selectedDay.type === "BLEEDING"
                  ? "#ED5214"
                  : Colors.light.text,
            },
          ]}
        >
          {getDayTypeText(selectedDay.type)}
        </Text>
      )}
      <Svg height="360" width="360" viewBox="-180 -180 360 360">
        <AnimatedPath
          d={getArcPath(CIRCLE_RADIUS + 10, STROKE_WIDTH)}
          fill="none"
          strokeWidth={50}
          animatedProps={backgroundPathAnimatedProps}
        />

        <Path
          d={getArcPath(CIRCLE_RADIUS, STROKE_WIDTH - 20)}
          fill="none"
          stroke="white"
          strokeWidth={25}
        />

        {dots}

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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundTertiary,
    alignItems: "center",
    paddingTop: 100,
  },
  date: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 20,
    color: Colors.light.text,
    marginBottom: 8,
  },
  dayType: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 25,
  },
});

export default CycleScreen;
