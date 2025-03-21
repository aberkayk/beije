import { useThemeColor } from "@/hooks/use-theme-color";
import { View as DefaultView } from "react-native";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ViewProps = ThemeProps & DefaultView["props"];

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}
