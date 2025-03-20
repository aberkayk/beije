import React from "react";
import { Link, Tabs } from "expo-router";
import {
  Pressable,
  useColorScheme,
  View,
  Text,
  Image,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native";
import Colors from "@/constants/Colors";
import Icons from "@/constants/Icons";
import { useThemeColor } from "@/hooks/use-theme-color";

const TabIcon = ({
  focused,
  icon,
  title,
  textStyle,
}: {
  focused: boolean;
  icon: any;
  title: string;
  textStyle?: StyleProp<TextStyle>;
}) => (
  <View style={styles.tabIconContainer}>
    <Image
      style={{}}
      source={icon}
      tintColor={focused ? Colors.dark.tint : Colors.dark.tabIconDefault}
      resizeMode="contain"
    />
    <Text
      style={[
        {
          color: focused ? Colors.dark.text : Colors.dark.textSecondary,
        },
        textStyle,
      ]}
    >
      {title}
    </Text>
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const background = useThemeColor({}, "background");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: background,
          height: 88,
          paddingTop: 12,
          borderWidth: 0,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Döngü",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              textStyle={styles.tabLabel}
              icon={Icons.innercircle}
              focused={focused}
              title="Döngü"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Takvim",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              textStyle={styles.tabLabel}
              icon={Icons.calendar}
              focused={focused}
              title="Takvim"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analyze"
        options={{
          title: "Analiz",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              textStyle={styles.tabLabel}
              icon={Icons.barchart}
              focused={focused}
              title="Analiz"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: "Rehber",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              textStyle={styles.tabLabel}
              icon={Icons.eye}
              focused={focused}
              title="Rehber"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 16,
  },
  iconImage: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: 500,
    textAlign: "center",
    minWidth: 80,
    marginTop: 4,
  },
});
