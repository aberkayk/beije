import { useThemeColor } from "@/hooks/use-theme-color";
import {
  Button as DefaultButton,
  Pressable,
  StyleSheet,
} from "react-native";
import { Text } from "./text";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  style?: any;
  children?: React.ReactNode;
  textStyle?: any;
  onPress: () => void;
};

export type ButtonProps = ThemeProps & DefaultButton["props"];

export function Button(props: ButtonProps) {
  const {
    style,
    lightColor,
    darkColor,
    children,
    textStyle,
    onPress,
    title,
    ...otherProps
  } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "button"
  );

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor }, style]}
      {...otherProps}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    padding: 10,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
  },
});
