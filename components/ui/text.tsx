import { useThemeColor } from "@/hooks/use-theme-color";
import { Text as DefaultText } from "react-native";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}
