


import { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, router } from "expo-router";

import {
  getMyAddresses,
  createAddress,
  deleteAddress,
  setDefaultAddress,
} from "./addressService";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [subCity, setSubCity] = useState("");
  const [woreda, setWoreda] = useState("");
  const [kebele, setKebele] = useState("");

  const loadAddresses = async () => {
    try {
      const data = await getMyAddresses();
      setAddresses(data);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load addresses"
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [])
  );

  const handleAddAddress = async () => {
    if (!region.trim() || !city.trim()) {
      Alert.alert("Error", "Region and city are required");
      return;
    }

    try {
      await createAddress({
        region,
        city,
        sub_city: subCity,
        woreda,
        kebele,
      });

      setRegion("");
      setCity("");
      setSubCity("");
      setWoreda("");
      setKebele("");
      setShowForm(false);

      await loadAddresses();
      Alert.alert("Success", "Address added successfully");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add address"
      );
    }
  };

  const handleDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      await loadAddresses();
      Alert.alert("Success", "Default address updated");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to set default address"
      );
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Address", "Are you sure?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAddress(id);
            await loadAddresses();
          } catch (error) {
            Alert.alert(
              "Error",
              error.response?.data?.message || "Failed to delete address"
            );
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#287a3d" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <Text style={styles.heading}>Delivery Addresses</Text>

      <Pressable
        style={styles.addButton}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={styles.buttonText}>
          {showForm ? "Close Form" : "+ Add New Address"}
        </Text>
      </Pressable>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Region *"
            value={region}
            onChangeText={setRegion}
          />

          <TextInput
            style={styles.input}
            placeholder="City *"
            value={city}
            onChangeText={setCity}
          />

          <TextInput
            style={styles.input}
            placeholder="Sub City"
            value={subCity}
            onChangeText={setSubCity}
          />

          <TextInput
            style={styles.input}
            placeholder="Woreda"
            value={woreda}
            onChangeText={setWoreda}
          />

          <TextInput
            style={styles.input}
            placeholder="Kebele"
            value={kebele}
            onChangeText={setKebele}
          />

          <Pressable style={styles.addButton} onPress={handleAddAddress}>
            <Text style={styles.buttonText}>Save Address</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.sectionTitle}>Saved Addresses</Text>

      {addresses.length === 0 ? (
        <Text style={styles.empty}>No addresses saved yet.</Text>
      ) : (
        addresses.map((address) => (
          <View key={address.id} style={styles.card}>
            <Text style={styles.city}>{address.city}</Text>
            <Text>Region: {address.region}</Text>
            {address.sub_city ? <Text>Sub City: {address.sub_city}</Text> : null}
            {address.woreda ? <Text>Woreda: {address.woreda}</Text> : null}
            {address.kebele ? <Text>Kebele: {address.kebele}</Text> : null}

            {address.is_default ? (
              <Text style={styles.defaultText}>Default Address</Text>
            ) : (
              <Pressable
                style={styles.defaultButton}
                onPress={() => handleDefault(address.id)}
              >
                <Text style={styles.buttonText}>Set as Default</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDelete(address.id)}
            >
              <Text style={styles.buttonText}>Delete Address</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8faf8",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  back: {
    color: "#287a3d",
    fontSize: 16,
    marginBottom: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 12,
  },
  form: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#287a3d",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  city: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  defaultText: {
    color: "#287a3d",
    fontWeight: "bold",
    marginTop: 12,
  },
  defaultButton: {
    backgroundColor: "#287a3d",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  deleteButton: {
    backgroundColor: "#c0392b",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  empty: {
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
});
