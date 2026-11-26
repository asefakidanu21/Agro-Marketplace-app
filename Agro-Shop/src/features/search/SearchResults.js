
import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { searchProducts } from "../search/searchService";

export default function SearchBar() {
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const requestId = useRef(0);

  useEffect(() => {
    const query = name.trim();

    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      const currentRequest = ++requestId.current;

      try {
        setLoading(true);

        const results = await searchProducts({
          name: query,
        });

        // Ignore outdated search responses
        if (currentRequest === requestId.current) {
          setProducts(results);
        }
      } catch (error) {
        if (currentRequest === requestId.current) {
          console.log(
            "Search Error:",
            error.response?.data || error.message
          );
          setProducts([]);
        }
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [name]);

  const clearSearch = () => {
    requestId.current++;
    setName("");
    setProducts([]);
    setLoading(false);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/products/${item.id}`)}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.productImage}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons
            name="image-outline"
            size={28}
            color="#aaa"
          />
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productName}>
          {item.name}
        </Text>

        <Text style={styles.categoryName}>
          {item.category_name || "Uncategorized"}
        </Text>

        <Text style={styles.price}>
          ETB {item.price} / {item.unit}
        </Text>

        <Text style={styles.stock}>
          Available: {item.quantity}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#888"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={22}
          color="#777"
        />

        <TextInput
          style={styles.input}
          placeholder="Search agricultural products..."
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          returnKeyType="search"
        />

        {name.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons
              name="close-circle"
              size={21}
              color="#888"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading */}
      {loading && (
        <ActivityIndicator
          size="small"
          color="#2E7D32"
          style={styles.loader}
        />
      )}

      {/* Search Results */}
      {name.trim().length > 0 && !loading && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No products found.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  searchContainer: {
    height: 50,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#222",
  },

  loader: {
    marginTop: 15,
  },

  productCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginTop: 10,
  },

  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#eee",
  },

  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },

  categoryName: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },

  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 4,
  },

  stock: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },

  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
