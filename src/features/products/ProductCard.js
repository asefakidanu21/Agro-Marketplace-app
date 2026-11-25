
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

export default function ProductCard({ product }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/products/${product.id}`)}
    >
      <Image
        source={{ uri: product.image_url }}
        style={styles.image}
      />

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>

        <Text style={styles.price}>
          {product.price} ETB / {product.unit}
        </Text>

        <Text style={styles.farmer}>
          By {product.farmer_name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 165,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#eee",
  },
  details: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  price: {
    color: "#2E7D32",
    fontWeight: "bold",
    marginTop: 5,
  },
  farmer: {
    color: "#777",
    fontSize: 12,
    marginTop: 5,
  },
});
