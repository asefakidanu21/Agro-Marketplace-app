
import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SearchBar() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push("/search")}
    >
      <Ionicons name="search-outline" size={22} color="#777" />
      <Text style={styles.text}>Search agricultural products...</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 25,
  },
  text: {
    color: "#888",
    fontSize: 14,
  },
});
