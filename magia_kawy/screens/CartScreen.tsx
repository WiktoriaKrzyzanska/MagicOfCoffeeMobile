import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, Image, Pressable } from 'react-native';
import { getCart } from '../utils/cartUtils';
import { useDarkMode } from '@/contexts/DarkModeProvider'; 


interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageBase64: string;
  description: string;
  levelOfBitterness: number;
  rating: number;
  taste: string;
}

interface Cart {
  id: string;
  totalPrice: number;
  items: CartItem[];
}

interface CartScreenProps {
  userId: number;
}

const CartScreen: React.FC<CartScreenProps> = ({ userId }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const { isDarkMode } = useDarkMode(); 


  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart(userId);

      setCart({
        id: data.id,
        totalPrice: data.totalPrice,
        items: data.items.map((item: any) => ({
          id: item.id,
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageBase64: item.product.imageBase64,
          description: item.product.description,
          levelOfBitterness: item.product.levelOfBitterness,
          rating: item.product.rating,
          taste: item.product.taste,
        })),
      });
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się pobrać koszyka.');
    }
  };

  const handleItemPress = (item: CartItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handlePayment = () => {
    Alert.alert('Przejdź do płatności', 'Funkcja płatności wkrótce będzie dostępna.');
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={[styles.cartItem, isDarkMode ? styles.cartItemDarkMode : null]}>
        <Text style={[styles.productName, isDarkMode ? styles.productNameDarkMode : null]}>{item.name}</Text>
        <Text style={[styles.quantityText, isDarkMode ? styles.quantityTextDarkMode : null]}>
          Ilość: {item.quantity}
        </Text>
        <Text style={[styles.productPrice, isDarkMode ? styles.productPriceDarkMode : null]}>
          {item.price.toFixed(2)} zł
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!cart || cart.items.length === 0) {
    return (
      <View style={[styles.container, isDarkMode ? { backgroundColor: '#171616' } : { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.title, isDarkMode ? styles.titleDarkMode : null]}>Koszyk jest pusty</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode ? { backgroundColor: '#171616' } : { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, isDarkMode ? styles.titleDarkMode : null]}>Koszyk</Text>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceLabel}>Łączna cena:</Text>
        <Text style={styles.totalPriceValue}>{cart.totalPrice.toFixed(2)} zł</Text>
      </View>
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={handlePayment}
      >
        <Text style={styles.paymentButtonText}>Przejdź do płatności</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[styles.modalContent, isDarkMode ? styles.modalContentDarkMode : null]}
          >
            {selectedItem?.imageBase64 ? (
              <Image
                source={{ uri: `data:image/png;base64,${selectedItem.imageBase64}` }}
                style={styles.productImage}
              />
            ) : (
              <Text style={[styles.modalText, isDarkMode ? styles.modalTextDarkMode : null]}>
                Brak obrazu
              </Text>
            )}
            <Text style={[styles.modalTitle, isDarkMode ? styles.modalTitleDarkMode : null]}>
              {selectedItem?.name}
            </Text>
            <View style={styles.modalSeparator} />
            <Text style={[styles.modalText, isDarkMode ? styles.modalTextDarkMode : null]}>
              {selectedItem?.description}
            </Text>
            <View style={styles.modalSeparator} />
            <Text style={[styles.modalDetail, isDarkMode ? styles.modalDetailDarkMode : null]}>
              <Text style={styles.modalLabel}>Kwasowość:</Text> {selectedItem?.levelOfBitterness || 'Brak danych'}
            </Text>
            <Text style={[styles.modalDetail, isDarkMode ? styles.modalDetailDarkMode : null]}>
              <Text style={styles.modalLabel}>Ocena:</Text> {selectedItem?.rating || 'Brak danych'}
            </Text>
            <Text style={[styles.modalDetail, isDarkMode ? styles.modalDetailDarkMode : null]}>
              <Text style={styles.modalLabel}>Smak:</Text> {selectedItem?.taste || 'Brak danych'}
            </Text>
            <Pressable
              style={[
                styles.closeButton,
                isDarkMode ? styles.closeButtonDarkMode : styles.closeButtonLightMode,
              ]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Zamknij</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  modalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  cartItemDarkMode: {
    backgroundColor: '#FFA500',
  },
  productName: {
    fontSize: 16,
    color: '#FFA500',
    flex: 2,
  },
  modalSeparator: { 
    height: 1, 
    backgroundColor: '#DDD', 
    marginVertical: 10, 
    width: '80%',
     alignSelf: 'center'
   },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },modalTitle: { 
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10 
  },
  modalTitleDarkMode: {
    color: '#000' 
  },
  closeButtonLightMode: {
    backgroundColor: '#FFA500',
  },
  closeButtonDarkMode: {
    backgroundColor: '#000', 
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },  
  productNameDarkMode: {
    color: '#000',
  },
  quantityText: {
    fontSize: 16,
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  quantityTextDarkMode: {
    color: '#000',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'right',
  },
  productPriceDarkMode: {
    color: '#000',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 10,
  },
  totalPriceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  paymentButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFA500',
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: "Righteous_400Regular",
  },
  titleDarkMode: {
    color: '#FFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalContentDarkMode: {
    backgroundColor: '#FFA500',
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  modalTextDarkMode: {
    color: '#000',
  },
  modalDetail: {
    fontSize: 14,
    marginVertical: 5,
    color: '#000',
  },
  modalDetailDarkMode: {
    color: '#000',
  }
});

export default CartScreen;
