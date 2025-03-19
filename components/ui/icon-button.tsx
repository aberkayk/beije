import React from "react";
import { Pressable, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useThemeColor } from "@/hooks/use-theme-color";

type IconButtonProps = {
  icon: any;
  lightColor?: string;
  darkColor?: string;
  size: number;
  style?: any;
  onPress?: () => void;
};

const IconButton = ({
  icon,
  lightColor,
  darkColor,
  size = 24,
  onPress,
  style,
}: IconButtonProps) => {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "button"
  );

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <FontAwesome
          name={icon}
          size={size}
          color={color}
          style={[style, { opacity: pressed ? 0.5 : 1 }]}
        />
      )}
    </Pressable>
  );
};

export default IconButton;
