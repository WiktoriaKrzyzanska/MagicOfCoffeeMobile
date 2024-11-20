import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import homeScreenCarouselData from "@/utils/homeScreenCarouselData";
import colorPalette from "@/utils/colorPalette";
import CustomMap from "@/components/CustomMap";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDarkMode } from "@/contexts/DarkModeProvider";
import axios from "axios";
import { RootStackParamList } from "../navigation/AppNavigator";
const { width } = Dimensions.get("window");
const flatListElementWidth = width - 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colorPalette.background,
  },
  containerDark: {
    backgroundColor: "#333333",
  },

  header1: {
    fontSize: 32,
    color: colorPalette.primary,
    fontFamily: "Righteous_400Regular",
  },
  header1Dark: {
    color: "#FFFFFF",
  },
  header2: {
    fontSize: 24,
    color: colorPalette.primary,
    fontFamily: "Righteous_400Regular",
    marginBottom: 12,
  },
  header2Dark: {
    color: "#FFFFFF",
  },
  carousel: {
    width: "100%",
  },
  carouselItem: {
    width: flatListElementWidth,
    height: 200,
  },
  overlayTitle: {
    width: "60%",
    position: "absolute",
    bottom: 20,
    left: 20,
    color: colorPalette.background,
    fontWeight: "bold",
    fontSize: 28,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    marginRight: 10,
    color: "#333",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  productList: {
    justifyContent: "space-between",
  },
  productTile: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: (width - 60) / 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
  },
  productTileDark: {
    backgroundColor: "#333333",
    borderColor: "#fff",
    borderWidth: 1,
  },

  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  productNameDark: {
    color: "#fff",
  },
  productDescription: {
    fontSize: 12,
    color: "#666",
  },
  productPrice: {
    fontSize: 16,
    color: colorPalette.primary,
    marginTop: 5,
  },
  productPriceDark: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: colorPalette.accent,
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  countryButtonContainer: {
    paddingVertical: 10,
    marginTop: 20,
  },
  countryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginHorizontal: 5,
    backgroundColor: "#F5F5F5",
  },
  countryButtonSelected: {
    backgroundColor: "#FFA500",
  },
  countryButtonText: {
    fontSize: 16,
    color: "#333",
  },
  countryButtonTextSelected: {
    color: "#fff",
  },
  bottomNav: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navButton: {
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
  },
  bottomNavDark: {
    backgroundColor: "#444444",
  },

  navButtonTextDark: {
    color: "#FFD700",
  },
});

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const countries = ["Italy", "Brazil", "Colombia", "Ethiopia", "Vietnam"];
  interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    availability: boolean;
    rating: number;
    countryOfOrigin: string;
    levelOfBitterness: number;
    taste: string;
    quantity: number;
    imageBase64: string;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://xxx.xxxx.xxx.xxx:8082/api/products"
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };
  const handleSearch = () => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleCountryFilter = (country: string) => {
    setSelectedCountry(country);
    if (country === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.countryOfOrigin === country
      );
      setFilteredProducts(filtered);
    }
  };
  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={[styles.productTile, isDarkMode && styles.productTileDark]}>
      <Image
        source={{ uri: `data:image/png;base64,${item.imageBase64}` }}
        style={styles.productImage}
      />
      <Text style={[styles.productName, isDarkMode && styles.productNameDark]}>
        {item.name}
      </Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text
        style={[styles.productPrice, isDarkMode && styles.productPriceDark]}
      >
        ${item.price.toFixed(2)}
      </Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % homeScreenCarouselData.length;
      setCurrentIndex(nextIndex);

      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const renderItem = ({
    item,
  }: {
    item: { id: string; caption: string; image: any };
  }) => (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.overlayTitle}>{item.caption}</Text>
    </View>
  );

  const renderCountryButton = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.countryButton,
        selectedCountry === item && styles.countryButtonSelected,
      ]}
      onPress={() => handleCountryFilter(item)}
    >
      <Text
        style={[
          styles.countryButtonText,
          selectedCountry === item && styles.countryButtonTextSelected,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };
  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        ListHeaderComponent={
          <>
            <View style={{ marginTop: 12, marginBottom: 24 }}>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Text
                  style={[styles.header1, isDarkMode && styles.header1Dark]}
                >
                  MagicOf
                  <Text style={{ color: colorPalette.accent }}>Coffee</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchInput}>
                <TextInput
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#A0A0A0"
                  style={{ flex: 1, color: "#333" }}
                />
              </View>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={handleSearch}
              >
                <Ionicons
                  name="search-outline"
                  size={18}
                  color="#A0A0A0"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.filterButtonText}>Search</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 12 }}>
              <Text style={[styles.header2, isDarkMode && styles.header2Dark]}>
                Special
                <Text style={{ color: colorPalette.accent }}> offer</Text>
              </Text>
              <View style={styles.carousel}>
                <FlatList
                  ref={flatListRef}
                  data={homeScreenCarouselData}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  getItemLayout={(_, index) => ({
                    length: flatListElementWidth,
                    offset: flatListElementWidth * index,
                    index,
                  })}
                  onMomentumScrollEnd={(event) => {
                    setCurrentIndex(
                      Math.round(event.nativeEvent.contentOffset.x / width)
                    );
                  }}
                />
                <View style={styles.dotsContainer}>
                  {homeScreenCarouselData.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            index === currentIndex
                              ? colorPalette.accent
                              : colorPalette.disabled,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>

            <FlatList
              data={countries}
              renderItem={renderCountryButton}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.countryButtonContainer}
            />
          </>
        }
        ListFooterComponent={
          <>
            <View style={{ marginBottom: 50 }}>
              <Text style={[styles.header2, isDarkMode && styles.header2Dark]}>
                Our
                <Text style={{ color: colorPalette.accent }}> providers</Text>
              </Text>
              <CustomMap />
            </View>
          </>
        }
      />

      <View style={[styles.bottomNav, isDarkMode && styles.bottomNavDark]}>
        <TouchableOpacity style={styles.navButton} onPress={scrollToTop}>
          <Ionicons
            name="home-outline"
            size={24}
            color={isDarkMode ? "#FFD700" : "#333"}
          />
          <Text
            style={[
              styles.navButtonText,
              isDarkMode && styles.navButtonTextDark,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleDarkMode} style={styles.navButton}>
          <Ionicons
            name={isDarkMode ? "sunny-outline" : "moon-outline"}
            size={24}
            color={isDarkMode ? "#FFD700" : "#333"}
          />
          <Text
            style={[
              styles.navButtonText,
              isDarkMode && styles.navButtonTextDark,
            ]}
          >
            Theme
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("CartScreen")}
        >
          <Ionicons
            name="cart-outline"
            size={24}
            color={isDarkMode ? "#FFD700" : "#333"}
          />
          <Text
            style={[
              styles.navButtonText,
              isDarkMode && styles.navButtonTextDark,
            ]}
          >
            Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default HomeScreen;
