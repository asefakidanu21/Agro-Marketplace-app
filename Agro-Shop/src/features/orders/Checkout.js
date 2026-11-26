



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { getCart } from "../cart/cartService";
import { placeOrder } from "./orderService";
import {
  getMyAddresses,
  createAddress,
} from "../addresses/addressService";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [fulfillmentMethod, setFulfillmentMethod] = useState("pickup");

  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [subCity, setSubCity] = useState("");
  const [woreda, setWoreda] = useState("");
  const [kebele, setKebele] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    loadCheckout();
  }, []);

  const loadCheckout = async () => {
    try {
      const [items, savedAddresses] = await Promise.all([
        getCart(),
        getMyAddresses(),
      ]);

      setCartItems(items);
      setAddresses(savedAddresses);

      const defaultAddress = savedAddresses.find(
        (address) => address.is_default
      );

      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load checkout"
      );
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleAddAddress = async () => {
    if (!region.trim() || !city.trim()) {
      Alert.alert("Error", "Region and city are required");
      return;
    }

    try {
      const address = await createAddress({
        region,
        city,
        sub_city: subCity,
        woreda,
        kebele,
      });

      setAddresses((previous) => [...previous, address]);
      setSelectedAddress(address.id);

      setRegion("");
      setCity("");
      setSubCity("");
      setWoreda("");
      setKebele("");

      setShowAddressForm(false);

      Alert.alert("Success", "Address saved successfully");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to save address"
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    if (fulfillmentMethod === "delivery" && !selectedAddress) {
      Alert.alert("Error", "Please select a delivery address");
      return;
    }

    try {
      setPlacingOrder(true);

      await placeOrder({
        fulfillment_method: fulfillmentMethod,
        address_id:
          fulfillmentMethod === "delivery"
            ? selectedAddress
            : null,
      });

      Alert.alert(
        "Success",
        "Your order has been placed successfully!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Order Failed",
        error.response?.data?.message || "Failed to place order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Loading checkout...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <Text style={styles.sectionTitle}>Order Summary</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        cartItems.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {item.product_name || item.name}
              </Text>

              <Text style={styles.itemQuantity}>
                Quantity: {item.quantity} {item.unit}
              </Text>
            </View>

            <Text style={styles.itemPrice}>
              ETB{" "}
              {(
                Number(item.price) * Number(item.quantity)
              ).toFixed(2)}
            </Text>
          </View>
        ))
      )}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalPrice}>
          ETB {total.toFixed(2)}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Fulfillment Method</Text>

      <View style={styles.methodContainer}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            fulfillmentMethod === "pickup" && styles.selectedMethod,
          ]}
          onPress={() => setFulfillmentMethod("pickup")}
        >
          <Text
            style={[
              styles.methodText,
              fulfillmentMethod === "pickup" &&
                styles.selectedMethodText,
            ]}
          >
            Pickup
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodButton,
            fulfillmentMethod === "delivery" && styles.selectedMethod,
          ]}
          onPress={() => setFulfillmentMethod("delivery")}
        >
          <Text
            style={[
              styles.methodText,
              fulfillmentMethod === "delivery" &&
                styles.selectedMethodText,
            ]}
          >
            Delivery
          </Text>
        </TouchableOpacity>
      </View>

      {fulfillmentMethod === "delivery" && (
        <>
          <Text style={styles.sectionTitle}>Delivery Address</Text>

          {addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedAddress === address.id &&
                  styles.selectedAddress,
              ]}
              onPress={() => setSelectedAddress(address.id)}
            >
              <Text style={styles.addressText}>
                {address.city}, {address.region}
              </Text>

              {address.sub_city ? (
                <Text style={styles.addressDetails}>
                  Sub-city: {address.sub_city}
                </Text>
              ) : null}

              {address.woreda ? (
                <Text style={styles.addressDetails}>
                  Woreda: {address.woreda}
                </Text>
              ) : null}

              {address.kebele ? (
                <Text style={styles.addressDetails}>
                  Kebele: {address.kebele}
                </Text>
              ) : null}

              {address.is_default ? (
                <Text style={styles.defaultText}>Default Address</Text>
              ) : null}

              {selectedAddress === address.id && (
                <Text style={styles.selectedText}>Selected</Text>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addAddressButton}
            onPress={() => setShowAddressForm(!showAddressForm)}
          >
            <Text style={styles.addAddressText}>
              {showAddressForm ? "Cancel" : "+ Add New Address"}
            </Text>
          </TouchableOpacity>

          {showAddressForm && (
            <View style={styles.addressForm}>
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
                placeholder="Sub-city"
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

              <TouchableOpacity
                style={styles.saveAddressButton}
                onPress={handleAddAddress}
              >
                <Text style={styles.buttonText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <TouchableOpacity
        style={[
          styles.placeOrderButton,
          (placingOrder || cartItems.length === 0) &&
            styles.disabledButton,
        ]}
        onPress={handlePlaceOrder}
        disabled={placingOrder || cartItems.length === 0}
      >
        <Text style={styles.buttonText}>
          {placingOrder ? "Placing Order..." : "Place Order"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
    color: "#111827",
  },
  emptyText: {
    color: "#777",
    marginVertical: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  itemQuantity: {
    color: "#777",
    marginTop: 5,
  },
  itemPrice: {
    fontWeight: "bold",
    color: "#2E7D32",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  methodContainer: {
    flexDirection: "row",
    gap: 12,
  },
  methodButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedMethod: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  methodText: {
    fontWeight: "bold",
    color: "#333",
  },
  selectedMethodText: {
    color: "#fff",
  },
  addressCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  selectedAddress: {
    borderColor: "#2E7D32",
    borderWidth: 2,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressDetails: {
    color: "#666",
    marginTop: 4,
  },
  defaultText: {
    color: "#2E7D32",
    marginTop: 6,
    fontWeight: "bold",
  },
  selectedText: {
    color: "#2E7D32",
    marginTop: 6,
    fontWeight: "bold",
  },
  addAddressButton: {
    padding: 12,
    alignItems: "center",
  },
  addAddressText: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
  addressForm: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 7,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  saveAddressButton: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  placeOrderButton: {
    backgroundColor: "#2E7D32",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 35,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
