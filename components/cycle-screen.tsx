import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
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
  runOnJS,
  useAnimatedReaction,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import Icons from "@/constants/Icons";

const CIRCLE_RADIUS = 144;
const DOT_RADIUS = 7.2;
const STROKE_WIDTH = 24;

const NORMAL_DOT_RADIUS = 2.4;
const SPECIAL_DOT_RADIUS = 7.2;
const CURRENT_DAY_RADIUS = 12;
const EXPANDED_DOT_RADIUS = 12;

interface CycleScreenProps {
  cycleData: CycleData;
  position?: Animated.SharedValue<number>;
  onDaySelected?: (dayData: any) => void;
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
const AnimatedG = Animated.createAnimatedComponent(G);

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
  onDaySelected,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(
    cycleData.currentDay - 1
  );
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] =
    useState(false);

  // Add animation value for dot selection
  const dotAnimationProgress = useSharedValue(0);

  // Monitor bottom sheet position and update expanded state
  useAnimatedReaction(
    () => position?.value || 0,
    (value) => {
      const isExpanded = value > 0.5;
      runOnJS(setIsBottomSheetExpanded)(isExpanded);

      // Reset selected day to current day when bottom sheet closes
      if (!isExpanded && selectedDayIndex !== cycleData.currentDay - 1) {
        runOnJS(setSelectedDayIndex)(cycleData.currentDay - 1);
      }
    }
  );

  const handleDayPress = (index: number) => {
    if (isBottomSheetExpanded) {
      setSelectedDayIndex(index);

      // Find selected day data
      const targetDate = new Date(cycleStartDate);
      targetDate.setDate(targetDate.getDate() + index);
      targetDate.setHours(0, 0, 0, 0);

      const selectedDay = cycleData.days.find((d) => {
        const dayDate = new Date(d.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate.getTime() === targetDate.getTime();
      });

      // Notify parent component of the selected day
      if (selectedDay && onDaySelected) {
        onDaySelected(selectedDay);
      }

      // Animate dot growth when pressed
      dotAnimationProgress.value = withTiming(0, { duration: 50 }, () => {
        dotAnimationProgress.value = withTiming(1, { duration: 300 });
      });
    }
  };

  const dots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cycleStartDate = new Date(cycleData.days[0].date);
  cycleStartDate.setHours(0, 0, 0, 0);

  const displayDate = new Date(cycleStartDate);
  displayDate.setDate(
    displayDate.getDate() +
      (isBottomSheetExpanded && selectedDayIndex !== null
        ? selectedDayIndex
        : cycleData.currentDay - 1)
  );

  let currentDayX = 0;
  let currentDayY = 0;

  for (let i = 0; i < cycleData.totalDays; i++) {
    const angle = (i / cycleData.totalDays) * 2 * Math.PI - Math.PI / 2;

    const x = CIRCLE_RADIUS * Math.cos(angle);
    const y = CIRCLE_RADIUS * Math.sin(angle);

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
    const isSelected = i === selectedDayIndex;

    const baseRadius = isSelected
      ? CURRENT_DAY_RADIUS
      : color === "#e2e2e2"
      ? NORMAL_DOT_RADIUS
      : SPECIAL_DOT_RADIUS;

    const expandedRadius = isSelected
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

      const effectiveBaseRadius =
        isSelected && !isCurrentDay
          ? interpolate(
              progress,
              [0, 1],
              [
                color === "#e2e2e2"
                  ? NORMAL_DOT_RADIUS
                  : SPECIAL_DOT_RADIUS,
                baseRadius,
              ],
              Extrapolation.CLAMP
            )
          : baseRadius;

      // Calculate the final radius with dot animation
      const selectionScale = isSelected
        ? interpolate(
            dotAnimationProgress.value,
            [0, 1],
            [effectiveBaseRadius, expandedRadius],
            Extrapolation.CLAMP
          )
        : effectiveBaseRadius;

      return {
        r: interpolate(
          progress,
          [0, 1],
          [
            effectiveBaseRadius,
            isSelected ? selectionScale : expandedRadius,
          ],
          Extrapolation.CLAMP
        ),
        opacity: shouldAnimate
          ? 1
          : interpolate(progress, [0, 1], [1, 0], Extrapolation.CLAMP),
      };
    });

    // Create a clickable area group for each dot
    if (shouldAnimate) {
      const isDayBleeding = day?.type === "BLEEDING";

      dots.push(
        <AnimatedG key={i}>
          <AnimatedCircle
            cx={x}
            cy={y}
            r={baseRadius}
            fill={isSelected ? (isDayBleeding ? "#ED5214" : color) : color}
            animatedProps={animatedProps}
          />
          <Circle
            cx={x}
            cy={y}
            r={30}
            fill="transparent"
            onPress={() => isBottomSheetExpanded && handleDayPress(i)}
            opacity={isBottomSheetExpanded ? 1 : 0}
            pointerEvents={isBottomSheetExpanded ? "auto" : "none"}
          />
        </AnimatedG>
      );
    } else {
      dots.push(
        <AnimatedCircle
          key={i}
          cx={x}
          cy={y}
          r={baseRadius}
          fill={color}
          animatedProps={animatedProps}
        />
      );
    }
  }

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

  const foregroundPathAnimatedProps = useAnimatedProps(() => {
    if (!position) return { strokeWidth: 25 };

    return {
      strokeWidth: interpolate(
        position.value,
        [0, 1],
        [25, 50],
        Extrapolation.CLAMP
      ),
    };
  });

  const svgContainerAnimatedStyle = useAnimatedStyle(() => {
    if (!position) return {};

    return {
      transform: [
        {
          translateY: interpolate(
            position.value,
            [0, 1],
            [0, -20],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <Image
        source={Icons.first}
        style={styles.first}
        resizeMode="contain"
      />
      <Image
        source={Icons.third}
        style={styles.second}
        resizeMode="contain"
      />
      <Image
        source={Icons.second}
        style={styles.third}
        resizeMode="contain"
      />
      <Text style={styles.date}>
        {displayDate.toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "long",
        })}
      </Text>
      <Animated.View style={chevronAnimatedStyle}>
        <ChevronDown />
      </Animated.View>

      <Animated.View style={svgContainerAnimatedStyle}>
        <Svg height="360" width="360" viewBox="-180 -180 360 360">
          <AnimatedPath
            d={getArcPath(CIRCLE_RADIUS + 10, STROKE_WIDTH)}
            fill="none"
            strokeWidth={50}
            animatedProps={backgroundPathAnimatedProps}
          />

          <AnimatedPath
            d={getArcPath(CIRCLE_RADIUS, STROKE_WIDTH - 20)}
            fill="none"
            stroke="white"
            animatedProps={foregroundPathAnimatedProps}
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundTertiary,
    alignItems: "center",
    paddingTop: 100,
    position: "relative",
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
  first: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,
  },
  second: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: "-50%" }],
    right: -10,
    zIndex: 0,
  },
  third: {
    position: "absolute",
    bottom: 200,
    left: -20,
    zIndex: 0,
  },
});

export default CycleScreen;
