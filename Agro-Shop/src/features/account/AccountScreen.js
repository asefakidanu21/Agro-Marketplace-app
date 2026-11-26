
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

import { useAuth } from "../../context/AuthContext";

export default function AccountScreen() {
  const { user, logout } = useAuth();

  const isBuyer = user?.role === "buyer";
  const isFarmer = user?.role === "farmer";

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const menuItems = [
    ...(isBuyer
      ? [
          {
            title: "My Orders",
            onPress: () => router.push("/(tabs)/my-orders"),
          },
          {
            title: "Delivery Addresses",
            onPress: () => router.push("/addresses"),
          },
          {
            title: "My Favorites",
            onPress: () => router.push("/favorites"),
          },
        ]
      : []),

    ...(isFarmer
      ? [
          {
            title: "My Products",
            onPress: () => router.push("/(tabs)/my-products"),
          },
          {
            title: "Farmer Orders",
            onPress: () => router.push("/(tabs)/orders"),
          },
        ]
      : []),

    {
      title: "Notifications",
      onPress: () => router.push("/notifications"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>My Account</Text>

      {/* Profile */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.full_name || "User"}
        </Text>

        <Text style={styles.role}>
          {user?.role?.toUpperCase()}
        </Text>
      </View>

      {/* Account Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Account Information
        </Text>

        <Text style={styles.info}>
          Name: {user?.full_name || "Not available"}
        </Text>

        <Text style={styles.info}>
          Email: {user?.email || "Not available"}
        </Text>

        <Text style={styles.info}>
          Phone: {user?.phone || "Not available"}
        </Text>

        <Text style={styles.info}>
          Account Type: {user?.role || "Not available"}
        </Text>
      </View>

      {/* Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu</Text>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Text style={styles.menuText}>
              {item.title}
            </Text>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
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
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 20,
  },
  profile: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  role: {
    color: "#2E7D32",
    marginTop: 5,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#222",
  },
  info: {
    fontSize: 15,
    color: "#555",
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  arrow: {
    fontSize: 23,
    color: "#888",
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
