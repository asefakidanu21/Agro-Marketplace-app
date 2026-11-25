


import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useFocusEffect, router } from "expo-router";

import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "./cartService";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      const items = await getCart();
      setCartItems(items);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const handleQuantityChange = async (item, quantity) => {
    if (quantity < 1) return;

    try {
      setUpdatingId(item.id);

      await updateCartItem(item.id, quantity);

      await loadCart();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update quantity"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = (id) => {
    Alert.alert("Remove Product", "Are you sure you want to remove this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await removeCartItem(id);
            await loadCart();
          } catch (error) {
            Alert.alert(
              "Error",
              error.response?.data?.message || "Failed to remove product"
            );
          }
        },
      },
    ]);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text>No Image</Text>
        </View>
      )}

      <View style={styles.details}>
        <Text style={styles.name}>{item.product_name}</Text>

        <Text style={styles.price}>
          ETB {Number(item.price).toFixed(2)} / {item.unit}
        </Text>

        <Text style={styles.subtotal}>
          Subtotal: ETB{" "}
          {(Number(item.price) * Number(item.quantity)).toFixed(2)}
        </Text>

        <View style={styles.actions}>
          <View style={styles.quantityBox}>
            <TouchableOpacity
              style={styles.quantityButton}
              disabled={updatingId === item.id || Number(item.quantity) <= 1}
              onPress={() =>
                handleQuantityChange(item, Number(item.quantity) - 1)
              }
            >
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              disabled={updatingId === item.id}
              onPress={() =>
                handleQuantityChange(item, Number(item.quantity) + 1)
              }
            >
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => handleRemove(item.id)}>
            <Text style={styles.remove}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text>Loading cart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>

      {cartItems.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Browse products and add them to your cart.
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.shopButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>
                ETB {total.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => router.push("/checkout")}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111827",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 95,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  price: {
    color: "#475569",
    marginTop: 5,
  },
  subtotal: {
    fontWeight: "bold",
    color: "#16A34A",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    paddingHorizontal: 10,
    fontWeight: "bold",
  },
  remove: {
    color: "#DC2626",
    fontWeight: "600",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16A34A",
  },
  checkoutButton: {
    backgroundColor: "#16A34A",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
