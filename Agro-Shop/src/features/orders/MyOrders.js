
import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";

import {
  getMyOrders,
  getOrderDetails,
  cancelOrder,
} from "./orderService";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const handleDetails = async (id) => {
    try {
      const data = await getOrderDetails(id);
      setSelectedOrder(data);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load order details"
      );
    }
  };

const handleCancel = async (id) => {
  try {
    console.log("Cancelling order:", id);

    await cancelOrder(id);

    console.log("Order cancelled successfully");

    setSelectedOrder(null);
    await loadOrders();
  } catch (error) {
    console.log("Cancel error:", error.response?.data || error.message);

    Alert.alert(
      "Error",
      error.response?.data?.message || "Failed to cancel order"
    );
  }
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#287a3d" />
      </View>
    );
  }

  if (selectedOrder) {
    const { order, items } = selectedOrder;

    return (
      <View style={styles.container}>
        <Pressable onPress={() => setSelectedOrder(null)}>
          <Text style={styles.back}>← Back to Orders</Text>
        </Pressable>

        <Text style={styles.heading}>Order #{order.id}</Text>
        <Text>Status: {order.status}</Text>
        <Text>Total: ETB {order.total_amount}</Text>
        <Text>Fulfillment: {order.fulfillment_method}</Text>

        <Text style={styles.sectionTitle}>Order Items</Text>

        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.productName}>{item.product_name}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>ETB {item.subtotal}</Text>
          </View>
        ))}

        {order.status === "pending" && (
          <Pressable
            style={styles.cancelButton}
            onPress={() => handleCancel(order.id)}
          >
            <Text style={styles.buttonText}>Cancel Order</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.productName}>Order #{item.id}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: ETB {item.total_amount}</Text>
            <Text>Fulfillment: {item.fulfillment_method}</Text>

            <Pressable
              style={styles.detailsButton}
              onPress={() => handleDetails(item.id)}
            >
              <Text style={styles.buttonText}>View Details</Text>
            </Pressable>

            {item.status === "pending" && (
              <Pressable
                style={styles.cancelButton}
                onPress={() => handleCancel(item.id)}
              >
                <Text style={styles.buttonText}>Cancel Order</Text>
              </Pressable>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>You haven't placed any orders yet.</Text>
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  productName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailsButton: {
    backgroundColor: "#287a3d",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButton: {
    backgroundColor: "#c0392b",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  back: {
    color: "#287a3d",
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
  },
});
