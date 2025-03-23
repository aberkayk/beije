import { store } from "@/redux/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import { Provider } from "react-redux";
import AuthProvider from "@/redux/providers/auth-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomSplashScreen } from "@/components/custom-splash-screen";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [loaded]);

  if (!appReady || !isAnimationFinished) {
    return (
      <CustomSplashScreen
        onAnimationFinish={() => setIsAnimationFinished(true)}
      />
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider
        value={colorScheme === "dark" ? DefaultTheme : DefaultTheme}
      >
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
              />
            </Stack>
          </GestureHandlerRootView>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
