



import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";

import { getCategories } from "./categoryService";
import { getProducts } from "../products/productService";
import ProductCard from "../products/ProductCard";

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [categoryData, productData] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);

      setCategories(categoryData);
      setProducts(productData);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          String(product.category_id) === String(selectedCategory)
      )
    : products;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#287a3d" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Categories</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Pressable
          style={[
            styles.category,
            selectedCategory === null && styles.selectedCategory,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === null && styles.selectedText,
            ]}
          >
            All
          </Text>
        </Pressable>

        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.category,
              String(selectedCategory) === String(category.id) &&
                styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>
              {category.icon || "🌱"}
            </Text>

            <Text
              style={[
                styles.categoryText,
                String(selectedCategory) === String(category.id) &&
                  styles.selectedText,
              ]}
            >
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.productHeading}>Products</Text>

      {filteredProducts.length === 0 ? (
        <Text style={styles.emptyText}>
          No products found in this category.
        </Text>
      ) : (
        <View>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  category: {
    padding: 12,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
  },
  selectedCategory: {
    backgroundColor: "#287a3d",
  },
  categoryIcon: {
    fontSize: 22,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  productHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 25,
    color: "#777",
  },
});
