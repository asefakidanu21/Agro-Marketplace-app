



import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useFocusEffect, router } from "expo-router";

import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "./notificationService";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === id ? { ...item, is_read: true } : item
        )
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to mark as read"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to delete notification"
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {notifications.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No notifications yet.</Text>
        </View>
      ) : (
        notifications.map((item) => (
          <View
            key={item.id}
            style={[
              styles.notification,
              !item.is_read && styles.unread,
            ]}
          >
            <Text style={styles.notificationTitle}>
              {item.title}
            </Text>

            <Text style={styles.message}>
              {item.message}
            </Text>

            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleString()}
            </Text>

            <View style={styles.actions}>
              {!item.is_read && (
                <TouchableOpacity
                  onPress={() => handleMarkAsRead(item.id)}
                >
                  <Text style={styles.readButton}>Mark as read</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
  },
  notification: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: "#2E7D32",
  },
  notificationTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },
  message: {
    color: "#555",
    marginTop: 8,
    lineHeight: 21,
  },
  date: {
    color: "#999",
    fontSize: 12,
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  readButton: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
  deleteButton: {
    color: "#D32F2F",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#777",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
