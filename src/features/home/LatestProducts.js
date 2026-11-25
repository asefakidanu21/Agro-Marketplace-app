
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ProductCard from "../products/ProductCard";

export default function LatestProducts({ products }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Products</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
});
