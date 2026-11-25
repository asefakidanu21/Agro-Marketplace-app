import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { getHomeData } from "./homeService";

import HomeHeader from "./HomeHeader";
import SearchBar from "./SearchBar";
import CategorySection from "./CategorySection";
import PopularProducts from "./PopularProducts";
import LatestProducts from "./LatestProducts";

export default function HomeScreen() {
  const [homeData, setHomeData] = useState({
    categories: [],
    popularProducts: [],
    latestProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHomeData = async () => {
    try {
      setError("");

      const data = await getHomeData();

      setHomeData(data);
    } catch (error) {
      console.log("Home Error:", error.message);
      setError("Unable to load home data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Loading Agro-Shop...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
        <Text onPress={loadHomeData} style={styles.retry}>
          Try Again
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <HomeHeader />
      <SearchBar />

      <CategorySection categories={homeData.categories} />

      <PopularProducts products={homeData.popularProducts} />

      <LatestProducts products={homeData.latestProducts} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 45,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  retry: {
    color: "#2E7D32",
    marginTop: 12,
  },
});