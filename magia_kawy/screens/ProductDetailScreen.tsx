import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { product } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${product.imageBase64}` }}
        style={styles.productImage}
      />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productDetails}>Price: ${product.price}</Text>
      <Text style={styles.productDetails}>
        Country of Origin: {product.countryOfOrigin}
      </Text>
      <Text style={styles.productDetails}>Rating: {product.rating} / 5</Text>
      <Text style={styles.productDetails}>
        Level of Bitterness: {product.levelOfBitterness} / 10
      </Text>
      <Text style={styles.productDetails}>Taste: {product.taste}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  productImage: {
    width: "100%",
    height: 300,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  productDetails: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ProductDetailScreen;
