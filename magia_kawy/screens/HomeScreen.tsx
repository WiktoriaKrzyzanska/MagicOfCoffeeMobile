import React, { useState, useEffect, useRef } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, ScrollView, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import homeScreenCarouselData from "@/utils/homeScreenCarouselData";
import colorPalette from "@/utils/colorPalette";
import CustomMap from "@/components/CustomMap";
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
const { width } = Dimensions.get('window');
const flatListElementWidth = width - 40;

const HomeScreen = () => {
    const navigation = useNavigation();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

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
    
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://192.168.1.41:8082/api/products');
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };
    const handleSearch = () => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    };
    const renderProductItem = ({ item }: { item: Product }) => (
        <View style={styles.productTile}>
            <Image source={{ uri: `data:image/png;base64,${item.imageBase64}` }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
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

    const renderItem = ({ item}: { item: { id: string; caption: string; image: any } }) => (
        <View style={styles.carouselItem}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.overlayTitle}>{item.caption}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={{ marginTop: 12, marginBottom: 24 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.header1}>
                        MagicOf
                        <Text style={{ color: colorPalette.accent }}>Coffee</Text>
                    </Text>
                </TouchableOpacity>
            </View>
           
            <View style={{marginVertical: 12}}>
                <Text style={[styles.header2, { marginBottom: 12 }]}>
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
                        getItemLayout={(_, index) => (
                            { length: flatListElementWidth, offset: (flatListElementWidth) * index, index }
                        )}
                        onMomentumScrollEnd={(event) => {
                            setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / width));
                        }}
                    />
                    <View style={styles.dotsContainer}>
                        {homeScreenCarouselData.map((_, index) => (
                            <View key={index} style={[
                                styles.dot,
                                { backgroundColor: index === currentIndex ? colorPalette.accent : colorPalette.disabled }
                            ]} />
                        ))}
                    </View>
                </View>
            </View>
           
            {/* Search Bar */}
            <View style={styles.searchContainer}>
    <View style={styles.searchInput}>
        
        <TextInput
            placeholder="Search for products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#A0A0A0"
            style={{ flex: 1, color: '#333' }}
        />
    </View>
    <TouchableOpacity style={styles.filterButton} onPress={handleSearch}>
    <Ionicons name="search-outline" size={18} color="#A0A0A0" style={{ marginRight: 5 }} />
        <Text style={styles.filterButtonText}>Search</Text>
    </TouchableOpacity>
</View>
           
            {/* Product List */}
            <View style={{ marginVertical: 12 }}>
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.productList}
                />
            </View>
            <View>
                <Text style={[styles.header2, { marginBottom: 12 }]}>
                    Our
                    <Text style={{ color: colorPalette.accent }}> providers</Text>
                </Text>
                <CustomMap />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colorPalette.background,
    },
    header1: {
        fontSize: 32,
        color: colorPalette.primary,
        fontFamily: 'Righteous_400Regular',
    },
    header2: {
        fontSize: 24,
        color: colorPalette.primary,
        fontFamily: 'Righteous_400Regular',
    },
    carousel: {
        width: '100%',
    },
    carouselItem: {
        width: flatListElementWidth,
        height: 200,
    },
    overlayTitle: {
        width: '60%',
        position: 'absolute',
        bottom: 20,
        left: 20,
        color: colorPalette.background,
        fontWeight: 'bold',
        fontSize: 28,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
        marginRight: 10,
        color: '#333',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filterButtonText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 5,
    },
    productList: {
        justifyContent: 'space-between',
    },
    productTile: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        width: (width - 60) / 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    productDescription: {
        fontSize: 12,
        color: '#666',
    },
    productPrice: {
        fontSize: 16,
        color: colorPalette.primary,
        marginTop: 5,
    },
    addButton: {
        backgroundColor: colorPalette.accent,
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
export default HomeScreen;
