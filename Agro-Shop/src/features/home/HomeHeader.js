
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Agro-Shop</Text>
          <Text style={styles.subtitle}>
            Fresh products, directly from farmers
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/notifications")}
          style={styles.notification}
        >
          <Ionicons
            name="notifications-outline"
            size={26}
            color="#2E7D32"
          />
        </Pressable>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1604337214275-86010944959d?auto=format&fit=crop&w=1200&q=80",
          }}
          style={styles.bannerImage}
          resizeMode="cover"
        />

        <View style={styles.overlay}>
          <Text style={styles.bannerTitle}>
            Fresh from local farms
          </Text>

          <Text style={styles.bannerText}>
            Discover fresh agricultural products
            at affordable prices.
          </Text>

          <View style={styles.bannerButton}>
            <Text style={styles.buttonText}>
              Shop Now
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  subtitle: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },

  notification: {
    padding: 8,
  },

  banner: {
    height: 175,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  bannerTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
  },

  bannerText: {
    color: "#fff",
    fontSize: 13,
    marginTop: 6,
  },

  bannerButton: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },

  buttonText: {
    color: "#2E7D32",
    fontWeight: "bold",
    fontSize: 12,
  },
});
