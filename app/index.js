


import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";

import { useAuth } from "../src/context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  // Wait until the saved login session is checked
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  // User is not logged in
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // User is logged in
  return <Redirect href="/(tabs)" />;
}
