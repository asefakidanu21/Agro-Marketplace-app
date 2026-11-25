


import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import { getCategories } from "../categories/categoryService.js";
import { addProduct } from "./productService.js";

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      Alert.alert("Error", "Could not load categories");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !unit || !quantity) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
      Alert.alert("Error", "Price and quantity cannot be negative");
      return;
    }

    try {
      setLoading(true);

      await addProduct({
        name,
        category_id: categoryId || null,
        description,
        price,
        unit,
        quantity,
        image,
      });

      Alert.alert("Success", "Product added successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Could not add product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Product</Text>

      <Text style={styles.label}>Product Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categories}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.category,
              String(categoryId) === String(category.id) &&
                styles.selectedCategory,
            ]}
            onPress={() => setCategoryId(String(category.id))}
          >
            <Text
              style={[
                styles.categoryText,
                String(categoryId) === String(category.id) &&
                  styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter product description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Price *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Unit *</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: kg, quintal, piece"
        value={unit}
        onChangeText={setUnit}
      />

      <Text style={styles.label}>Quantity *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Product Image</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Choose Image</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.preview} />
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Add Product</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  category: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  selectedCategory: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  categoryText: {
    color: "#333",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  imageButton: {
    padding: 14,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },
  imageButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 30,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
