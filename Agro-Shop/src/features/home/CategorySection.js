
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

const categoryEmojis = {
  Vegetables: "🥦",
  Fruits: "🍎",
  Grains: "🌾",
  "Root Crops": "🥔",
  Livestock: "🐄",
  Dairy: "🥛",
};

export default function CategorySection({ categories = [] }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Pressable onPress={() => router.push("/categories")}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={styles.category}
            onPress={() =>
              router.push(`/products?categoryId=${category.id}`)
            }
          >
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>
                {categoryEmojis[category.name] || "🌱"}
              </Text>
            </View>

            <Text style={styles.name}>{category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  category: {
    alignItems: "center",
    marginRight: 18,
    width: 75,
  },
  emojiContainer: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  emoji: {
    fontSize: 32,
  },
  name: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
