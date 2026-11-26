
import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { useFocusEffect } from "expo-router";

import {
  getFarmerOrders,
  getOrderDetails,
  changeOrderStatus,
} from "./orderService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [updatingId, setUpdatingId] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  // Load farmer orders
  const loadOrders = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      setError("");

      const data = await getFarmerOrders();
      setOrders(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load orders"
      );
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  // Show order details
  const handleViewDetails = async (id) => {
    if (expandedOrder === id) {
      setExpandedOrder(null);
      setOrderItems([]);
      return;
    }

    try {
      setDetailsLoading(true);
      setExpandedOrder(id);
      setOrderItems([]);

      const result = await getOrderDetails(id);
      setOrderItems(result.items || []);
    } catch (err) {
      setExpandedOrder(null);

      setFeedback(
        err.response?.data?.message ||
          "Failed to load order details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // Open confirmation modal
  const handleStatusChange = (id, status, label) => {
    setPendingAction({ id, status, label });
  };

  // Confirm and update order status
  const confirmStatusChange = async () => {
    if (!pendingAction) return;

    const { id, status } = pendingAction;

    try {
      setUpdatingId(id);
      setFeedback("");

      await changeOrderStatus(id, status);

      setPendingAction(null);
      setFeedback("Order status updated successfully.");

      await loadOrders(false);
    } catch (err) {
      setPendingAction(null);

      setFeedback(
        err.response?.data?.message ||
          "Failed to update order"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Status actions allowed by backend
  const getStatusActions = (status) => {
    switch (status) {
      case "pending":
        return [
          { label: "Accept Order", value: "accepted" },
          { label: "Reject Order", value: "rejected" },
        ];

      case "accepted":
        return [
          { label: "Start Processing", value: "processing" },
        ];

      case "processing":
        return [
          {
            label: "Ready for Delivery",
            value: "ready_for_delivery",
          },
        ];

      case "ready_for_delivery":
        return [
          { label: "Complete Order", value: "completed" },
        ];

      default:
        return [];
    }
  };

  const formatStatus = (status) => {
    return status?.replaceAll("_", " ") || "Unknown";
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farmer Orders</Text>

      {feedback !== "" && (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>{feedback}</Text>

          <Pressable onPress={() => setFeedback("")}>
            <Text style={styles.closeFeedback}>×</Text>
          </Pressable>
        </View>
      )}

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => loadOrders()}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              You don't have any orders yet.
            </Text>
          }
          renderItem={({ item }) => {
            const actions = getStatusActions(item.status);
            const isExpanded = expandedOrder === item.id;

            return (
              <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderTitle}>
                    Order #{item.id}
                  </Text>

                  <Text
                    style={[
                      styles.status,
                      item.status === "completed"
                        ? styles.completed
                        : item.status === "rejected" ||
                            item.status === "cancelled"
                          ? styles.rejected
                          : styles.pending,
                    ]}
                  >
                    {formatStatus(item.status)}
                  </Text>
                </View>

                <Text style={styles.info}>
                  Total: ETB {item.total_amount}
                </Text>

                <Text style={styles.info}>
                  Fulfillment: {item.fulfillment_method}
                </Text>

                <Text style={styles.info}>
                  Buyer ID: {item.buyer_id}
                </Text>

                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => handleViewDetails(item.id)}
                >
                  <Text style={styles.buttonText}>
                    {isExpanded
                      ? "Hide Details"
                      : "View Order Items"}
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.details}>
                    <Text style={styles.sectionTitle}>
                      Order Items
                    </Text>

                    {detailsLoading ? (
                      <ActivityIndicator color="#2E7D32" />
                    ) : orderItems.length === 0 ? (
                      <Text style={styles.info}>
                        No order items found.
                      </Text>
                    ) : (
                      orderItems.map((product) => (
                        <View
                          key={product.id}
                          style={styles.itemRow}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={styles.productName}>
                              {product.product_name}
                            </Text>

                            <Text style={styles.info}>
                              Quantity: {product.quantity}
                            </Text>
                          </View>

                          <Text style={styles.price}>
                            ETB {product.subtotal}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                )}

                {actions.length > 0 && (
                  <View style={styles.actions}>
                    {actions.map((action) => (
                      <TouchableOpacity
                        key={action.value}
                        style={[
                          styles.actionButton,
                          action.value === "rejected"
                            ? styles.rejectButton
                            : styles.acceptButton,
                        ]}
                        disabled={updatingId === item.id}
                        onPress={() =>
                          handleStatusChange(
                            item.id,
                            action.value,
                            action.label
                          )
                        }
                      >
                        <Text style={styles.buttonText}>
                          {updatingId === item.id
                            ? "Updating..."
                            : action.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
        />
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={pendingAction !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingAction(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Confirm Order Update
            </Text>

            <Text style={styles.modalMessage}>
              Are you sure you want to{" "}
              {pendingAction?.label?.toLowerCase()}?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                disabled={updatingId !== null}
                onPress={() => setPendingAction(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                disabled={updatingId !== null}
                onPress={confirmStatusChange}
              >
                {updatingId !== null ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    textTransform: "capitalize",
    fontWeight: "bold",
    padding: 6,
    borderRadius: 5,
    overflow: "hidden",
  },
  pending: {
    color: "#EF6C00",
    backgroundColor: "#FFF3E0",
  },
  completed: {
    color: "#2E7D32",
    backgroundColor: "#E8F5E9",
  },
  rejected: {
    color: "#D32F2F",
    backgroundColor: "#FFEBEE",
  },
  info: {
    color: "#666",
    marginTop: 5,
  },
  detailsButton: {
    backgroundColor: "#455A64",
    padding: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  details: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  productName: {
    fontWeight: "bold",
    fontSize: 15,
  },
  price: {
    color: "#2E7D32",
    fontWeight: "bold",
    marginLeft: 10,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 15,
  },
  actionButton: {
    padding: 10,
    borderRadius: 6,
  },
  acceptButton: {
    backgroundColor: "#2E7D32",
  },
  rejectButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  refreshButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 40,
  },
  feedback: {
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedbackText: {
    color: "#2E7D32",
    flex: 1,
  },
  closeFeedback: {
    fontSize: 22,
    color: "#555",
    paddingHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 25,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },
  confirmButton: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#2E7D32",
    minWidth: 90,
    alignItems: "center",
  },
});
