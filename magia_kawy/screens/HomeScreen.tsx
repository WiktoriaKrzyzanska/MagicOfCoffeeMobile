import React, { useState, useEffect, useRef } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import homeScreenCarouselData from "@/utils/homeScreenCarouselData";
import colorPalette from "@/utils/colorPalette";
import CustomMap from "@/components/CustomMap";

const { width } = Dimensions.get('window');
const flatListElementWidth = width - 40;

const HomeScreen = () => {
    const navigation = useNavigation();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const renderItem = ({ item } : {item: {id: string; caption: string; image: any}}) => (
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
            {/* TODO: Search bar, filters tab */}
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
            {/* TODO: Filters */}
            {/* TODO: List of products */}
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
});
export default HomeScreen;
