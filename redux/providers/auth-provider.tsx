import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useLoginMutation,
  useGetProfileQuery,
} from "@/redux/auth/services";
import { useGetInsightsQuery } from "@/redux/insights/services";
import { useGetMenstruationDaysQuery } from "@/redux/menstruation-days/services";
import { setToken } from "@/redux/auth/slice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  const { data: profileData, isLoading: isProfileLoading } =
    useGetProfileQuery(undefined, { skip: !hasToken });

  const { isLoading: isInsightsLoading } = useGetInsightsQuery(undefined, {
    skip: !hasToken,
  });

  const { isLoading: isMenstruationLoading } = useGetMenstruationDaysQuery(
    undefined,
    { skip: !hasToken }
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsAuthLoading(true);

        // Önceden kaydedilmiş token var mı kontrol et
        let storedToken = await AsyncStorage.getItem("authToken");

        if (!storedToken) {
          const response = await login({
            email: "salar@beije.co",
            password: "beijeApp",
          }).unwrap();

          if (response.data.token) {
            storedToken = response.data.token;
            await AsyncStorage.setItem("authToken", response.data.token);
          }
        }

        // Eğer storedToken varsa, Redux'a kaydet
        if (storedToken) {
          dispatch(setToken(storedToken));
          setHasToken(true);
        }
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch, login]);

  // Wait for all data to be loaded
  if (
    isAuthLoading ||
    (hasToken &&
      (isProfileLoading || isInsightsLoading || isMenstruationLoading))
  ) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
