
import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />

        <Stack.Screen name="search" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="addresses" />

        <Stack.Screen name="products/index" />
        <Stack.Screen name="products/[id]" />

        <Stack.Screen name="orders/index" />
        <Stack.Screen name="orders/[id]" />
      </Stack>
    </AuthProvider>
  );
}
