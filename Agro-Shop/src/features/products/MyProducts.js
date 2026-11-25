
import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import {
  getMyProducts,
  deleteProduct,
  changeProductStatus,
} from "./productService";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load products
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load your products"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh whenever screen becomes active
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  // Delete product
  const handleDelete = (id) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(id);

              Alert.alert("Success", "Product deleted successfully");
              loadProducts();
            } catch (err) {
              Alert.alert(
                "Error",
                err.response?.data?.message || "Failed to delete product"
              );
            }
          },
        },
      ]
    );
  };

  // Change product availability
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "available" ? "unavailable" : "available";

    try {
      await changeProductStatus(id, newStatus);

      Alert.alert("Success", `Product is now ${newStatus}`);
      loadProducts();
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to update product status"
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Products</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/products")}
        >
          <Text style={styles.buttonText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadProducts}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
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
              ) : (
                <View style={styles.noImage}>
                  <Text style={styles.noImageText}>No Image</Text>
                </View>
              )}

              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>

                <Text style={styles.price}>
                  ETB {item.price} / {item.unit}
                </Text>

                <Text style={styles.quantity}>
                  Quantity: {item.quantity}
                </Text>

                <Text
                  style={[
                    styles.status,
                    item.status === "available"
                      ? styles.availableText
                      : styles.unavailableText,
                  ]}
                >
                  Status: {item.status}
                </Text>

                {/* Edit and Delete */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      router.push(`/products/edit/${item.id}`)
                    }
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>

                {/* Change Availability */}
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    item.status === "available"
                      ? styles.unavailableButton
                      : styles.availableButton,
                  ]}
                  onPress={() =>
                    handleStatusChange(item.id, item.status)
                  }
                >
                  <Text style={styles.buttonText}>
                    {item.status === "available"
                      ? "Mark Unavailable"
                      : "Mark Available"}
                  </Text>
                </TouchableOpacity>
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  list: {
    paddingBottom: 20,
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
  noImage: {
    width: 85,
    height: 85,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#777",
    fontSize: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  price: {
    color: "#2E7D32",
    marginTop: 6,
    fontWeight: "bold",
  },
  quantity: {
    color: "#666",
    marginTop: 5,
  },
  status: {
    marginTop: 5,
    fontWeight: "bold",
  },
  availableText: {
    color: "#2E7D32",
  },
  unavailableText: {
    color: "#EF6C00",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  statusButton: {
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  availableButton: {
    backgroundColor: "#2E7D32",
  },
  unavailableButton: {
    backgroundColor: "#EF6C00",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 40,
  },
});
