
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
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

    const currentRequest = ++requestId.current;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const results = await searchProducts({ name: query });

        if (currentRequest === requestId.current) {
          setProducts(results || []);
        }
      } catch (error) {
        console.log(
          "Search error:",
          error.response?.data || error.message
        );

        if (currentRequest === requestId.current) {
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

  const handleClear = () => {
    setName("");
    setProducts([]);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.8}
      onPress={() => router.push(`/products/${item.id}`)}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.productImage}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="leaf-outline" size={25} color="#999" />
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.categoryName} numberOfLines={1}>
          {item.category_name || "Agricultural product"}
        </Text>

        <Text style={styles.price}>
          ETB {Number(item.price).toFixed(2)} / {item.unit}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#999"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={21}
          color="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="Search agricultural products..."
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
        />

        {name.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons
              name="close-circle"
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#238B45" />
        </View>
      )}

      {/* Search Results */}
      {!loading && name.trim().length > 0 && (
        <View style={styles.resultsContainer}>
          {products.length > 0 ? (
            <FlatList
              data={products}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderProduct}
              scrollEnabled={false}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <Text style={styles.noResults}>
              No products found.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 15,
    marginBottom: 10,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 0,
  },

  input: {
    flex: 1,
    height: "100%",
    padding: 0,
    margin: 0,
    borderWidth: 0,
    outlineStyle: "none",
    fontSize: 14,
    color: "#222",
    marginLeft: 10,
  },

  loadingContainer: {
    padding: 15,
    alignItems: "center",
  },

  resultsContainer: {
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },

  productCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  productImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },

  imagePlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  categoryName: {
    fontSize: 12,
    color: "#888",
    marginTop: 3,
  },

  price: {
    fontSize: 13,
    fontWeight: "600",
    color: "#238B45",
    marginTop: 4,
  },

  noResults: {
    textAlign: "center",
    padding: 18,
    color: "#888",
    fontSize: 13,
  },
});
