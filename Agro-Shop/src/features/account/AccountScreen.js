
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AccountScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Account</Text>

      {/* Profile */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>

        <Text style={styles.name}>{user?.full_name}</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </View>

      {/* Account Information */}
      <View style={styles.info}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>{user?.full_name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>
          {user?.phone || "Not provided"}
        </Text>

        <Text style={styles.label}>Account Type</Text>
        <Text style={styles.value}>{user?.role}</Text>
      </View>

      {/* Buyer Menu */}
      {user?.role === "buyer" && (
        <View style={styles.menu}>
          <Text style={styles.menuHeading}>My Activities</Text>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/my-orders")}
          >
            <Text style={styles.menuText}>My Orders</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push("/addresses")}
          >
            <Text style={styles.menuText}>Delivery Addresses</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push("/favorites")}
          >
            <Text style={styles.menuText}>My Favorites</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>
      )}

      {/* Farmer Menu */}
      {user?.role === "farmer" && (
        <View style={styles.menu}>
          <Text style={styles.menuHeading}>My Activities</Text>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/my-products")}
          >
            <Text style={styles.menuText}>My Products</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/orders")}
          >
            <Text style={styles.menuText}>Farmer Orders</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>
      )}

      {/* Logout */}
      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8faf8",
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 25,
  },
  profile: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#15803d",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  role: {
    color: "#15803d",
    marginTop: 5,
    textTransform: "capitalize",
  },
  info: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
  },
  label: {
    color: "#777",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 18,
  },
  menu: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  menuHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  menuText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 24,
    color: "#777",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
