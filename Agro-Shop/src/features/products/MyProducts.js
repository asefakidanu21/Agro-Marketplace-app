
import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import { getMyProducts } from "./productService";

export default function MyProducts() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadProducts = async () => {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setMessage("");

          const data = await getMyProducts(user.id);
          setProducts(data);
        } catch (error) {
          setMessage(
            error.response?.data?.message || "Failed to load products"
          );
        } finally {
          setLoading(false);
        }
      };

      loadProducts();
    }, [user?.id])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Products</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/products")}
        >
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : message ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              You haven't added any products yet.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.image}
                />
              ) : null}

              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.price}>
                  ETB {item.price} / {item.unit}
                </Text>
                <Text style={styles.quantity}>
                  Quantity: {item.quantity}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  price: {
    color: "green",
    marginTop: 6,
    fontWeight: "bold",
  },
  quantity: {
    color: "#666",
    marginTop: 5,
  },
  message: {
    color: "red",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 40,
  },
});
