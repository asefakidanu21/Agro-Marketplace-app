
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

import { useLocalSearchParams, router } from "expo-router";

import { getProduct } from "./productService";
import { addToCart } from "../cart/cartService";
import { addFavorite } from "../favorites/favoriteService";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();

  const { user } = useAuth();
  const isBuyer = user?.role === "buyer";

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [favoriting, setFavoriting] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);

      const data = await getProduct(id);

      setProduct(data);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart and navigate to Cart
  const handleAddToCart = async () => {
    if (!isBuyer) return;

    if (!product || Number(product.quantity) < quantity) {
      Alert.alert("Error", "Not enough product stock available");
      return;
    }

    try {
      setAdding(true);

      await addToCart(product.id, quantity);

      router.replace("/cart");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add product to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  // Add product to favorites and navigate to Favorites
  const handleAddFavorite = async () => {
    if (!isBuyer) return;

    try {
      setFavoriting(true);

      await addFavorite(product.id);

      router.replace("/favorites");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add favorite"
      );
    } finally {
      setFavoriting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found.</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const total = Number(product.price) * quantity;

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text>No Image</Text>
        </View>
      )}

      <View style={styles.details}>
        {/* Product Name */}
        <Text style={styles.name}>{product.name}</Text>

        {/* Product Price */}
        <Text style={styles.price}>
          ETB {Number(product.price).toFixed(2)} / {product.unit}
        </Text>

        {/* Farmer Information */}
        <Text style={styles.farmer}>
          By {product.farmer_name}
        </Text>

        {/* Available Stock */}
        <Text style={styles.stock}>
          Available quantity: {product.quantity} {product.unit}
        </Text>

        {/* Description */}
        <Text style={styles.descriptionTitle}>Description</Text>

        <Text style={styles.description}>
          {product.description || "No description available."}
        </Text>

        {/* Buyer Actions Only */}
        {isBuyer && (
          <>
            {/* Select Quantity */}
            <Text style={styles.quantityTitle}>Select Quantity</Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                disabled={quantity <= 1}
                onPress={() => setQuantity(quantity - 1)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantity}>{quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                disabled={quantity >= Number(product.quantity)}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Total Price */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Price</Text>

              <Text style={styles.totalPrice}>
                ETB {total.toFixed(2)}
              </Text>
            </View>

            {/* Add to Cart */}
            <TouchableOpacity
              style={[
                styles.addButton,
                (adding || Number(product.quantity) < 1) &&
                  styles.disabledButton,
              ]}
              onPress={handleAddToCart}
              disabled={adding || Number(product.quantity) < 1}
            >
              <Text style={styles.addButtonText}>
                {adding ? "Adding..." : "Add to Cart"}
              </Text>
            </TouchableOpacity>

            {/* Add to Favorites */}
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                favoriting && styles.disabledButton,
              ]}
              onPress={handleAddFavorite}
              disabled={favoriting}
            >
              <Text style={styles.favoriteButtonText}>
                {favoriting
                  ? "Adding to Favorites..."
                  : "♡ Add to Favorites"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 280,
    backgroundColor: "#eee",
  },

  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },

  details: {
    padding: 20,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },

  price: {
    fontSize: 19,
    color: "#2E7D32",
    fontWeight: "bold",
    marginTop: 10,
  },

  farmer: {
    color: "#777",
    marginTop: 8,
  },

  stock: {
    marginTop: 12,
    color: "#444",
  },

  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 22,
  },

  description: {
    color: "#555",
    marginTop: 8,
    lineHeight: 22,
  },

  quantityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 22,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  quantityButton: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 6,
  },

  quantityButtonText: {
    fontSize: 22,
    color: "#2E7D32",
    fontWeight: "bold",
  },

  quantity: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 25,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 20,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },

  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  addButton: {
    backgroundColor: "#2E7D32",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  favoriteButton: {
    backgroundColor: "#FCE4EC",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },

  favoriteButtonText: {
    color: "#C2185B",
    fontSize: 16,
    fontWeight: "bold",
  },

  disabledButton: {
    opacity: 0.5,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  backText: {
    color: "#2E7D32",
    marginTop: 12,
  },
});
