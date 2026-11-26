




import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect, router } from "expo-router";

import {
  getFavorites,
  removeFavorite,
} from "./favoriteService";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load favorites"
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemove = async (productId) => {
    try {
      await removeFavorite(productId);
      setFavorites((previous) =>
        previous.filter((item) => item.product_id !== productId)
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to remove favorite"
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Favorites</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              style={styles.product}
              onPress={() => router.push(`/products/${item.product_id}`)}
            >
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.image}
                />
              ) : (
                <View style={[styles.image, styles.noImage]}>
                  <Text>🌱</Text>
                </View>
              )}

              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>
                  {item.price} ETB / {item.unit}
                </Text>
                <Text style={styles.farmer}>
                  By {item.farmer_name}
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={styles.removeButton}
              onPress={() => handleRemove(item.product_id)}
            >
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            You haven't added any favorites yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  product: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  noImage: {
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  farmer: {
    color: "#777",
    marginTop: 5,
  },
  removeButton: {
    backgroundColor: "#c0392b",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  removeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 30,
  },
});
