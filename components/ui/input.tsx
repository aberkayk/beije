import { useThemeColor } from "@/hooks/use-theme-color";
import {
  TextInput as DefaultTextInput,
  StyleSheet,
  TextInputProps as DefaultTextInputProps,
} from "react-native";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  style?: any;
  placeholderTextColor?: string;
};

export type InputProps = ThemeProps & DefaultTextInputProps;

export function TextInput(props: InputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const color = useThemeColor({}, "text");

  const placeholderTextColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "placeholder"
  );

  return (
    <DefaultTextInput
      style={[styles.input, { backgroundColor, color }, style]}
      placeholderTextColor={placeholderTextColor}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 14,
  },
});
