import { persistor, store } from "@/redux/store";
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
import { PersistGate } from "redux-persist/integration/react";
import AuthProvider from "@/redux/providers/auth-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomSplashScreen } from "@/components/custom-splash-screen";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();
// SplashScreen.hideAsync();

export default function RootLayout() {
  // const [loaded, error] = useFonts({
  //   SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  //   ...FontAwesome.font,
  // });

  // useEffect(() => {
  //   if (error) throw error;
  // }, [error]);

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider
          value={colorScheme === "dark" ? DefaultTheme : DefaultTheme}
        >
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              {loading ? (
                <CustomSplashScreen />
              ) : (
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                </Stack>
              )}
            </GestureHandlerRootView>
          </AuthProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
