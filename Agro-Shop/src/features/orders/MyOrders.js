



import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import {
  getMyOrders,
  cancelOrder,
  getOrderDetails,
} from "./orderService";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load orders"
      );
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

      Alert.alert(
        `Order #${id}`,
        `Status: ${data.order.status}\n\n` +
          data.items
            .map(
              (item) =>
                `${item.product_name}\nQuantity: ${item.quantity}\nETB ${item.subtotal}`
            )
            .join("\n\n")
      );
    } catch (error) {
      Alert.alert("Error", "Failed to load order details");
    }
  };

  const handleCancel = (id) => {
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelOrder(id);
            Alert.alert("Success", "Order cancelled");
            loadOrders();
          } catch (error) {
            Alert.alert(
              "Error",
              error.response?.data?.message || "Failed to cancel order"
            );
          }
        },
      },
    ]);
  };

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Order #{item.id}</Text>
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
  );

  if (loading) {
    return <Text style={styles.message}>Loading orders...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderOrder}
        ListEmptyComponent={
          <Text style={styles.message}>You haven't placed any orders yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailsButton: {
    backgroundColor: "#287a3d",
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#c0392b",
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  message: {
    padding: 20,
    textAlign: "center",
  },
});
