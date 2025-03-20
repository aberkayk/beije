import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { selectProfile } from "@/redux/auth/slice";
import { useGetProfileQuery } from "@/redux/auth/services";

export default function CycleScreen() {
  const profile = useSelector(selectProfile);
  const { data: profileData, isLoading } = useGetProfileQuery({});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Bilgileri</Text>
      {isLoading ? (
        <Text>Yükleniyor...</Text>
      ) : profile?.profileInfo ? (
        <View style={styles.profileInfo}>
          <Text>Ad: {profile.profileInfo.firstName}</Text>
          <Text>Soyad: {profile.profileInfo.lastName}</Text>
          <Text>E-posta: {profile.profileInfo.email}</Text>
          <Text>Doğum Tarihi: {profile.profileInfo.birthDate}</Text>
        </View>
      ) : (
        <Text>Profil bilgileri bulunamadı</Text>
      )}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileInfo: {
    width: "100%",
    gap: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
