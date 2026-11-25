
import {
  View,
  Text,
  Pressable,
  StyleSheet,
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
    <View style={styles.container}>
      <Text style={styles.title}>My Account</Text>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>

        <Text style={styles.name}>{user?.full_name}</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>{user?.full_name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{user?.phone}</Text>

        <Text style={styles.label}>Account Type</Text>
        <Text style={styles.value}>{user?.role}</Text>
      </View>

      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
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
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
