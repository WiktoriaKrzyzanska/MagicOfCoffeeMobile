import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.0.107:8082/coffee/cart';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('Brak tokena w cache');
    return token;
  } catch (error) {
    console.error('Błąd podczas pobierania tokena:', error);
    throw error;
  }
};

export const getCart = async (userId) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    const token = await getToken();

    const response = await axios.get(`${API_BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
    });
    return response.data; 
  } catch (error) {
    console.error('Błąd podczas pobierania koszyka:', error);
    throw error;
  }
};

export const addToCart = async (cartItem) => {
  try {
    const token = await getToken();
    await axios.post(`${API_BASE_URL}/add`, cartItem, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Błąd podczas dodawania do koszyka:', error);
    throw error;
  }
};

export const removeFromCart = async (cartItem) => {
  try {
    const token = await getToken();
    const userId = await AsyncStorage.getItem("userId"); 
    
    const requestBody = {
      userId: parseInt(userId, 10), 
      productId: cartItem.productId,
      quantity: 0, 
    };

    await axios.post(`${API_BASE_URL}/remove`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Błąd podczas usuwania z koszyka:', error);
    throw error;
  }
};


export const updateQuantity = async (cartItem) => {
  try {
    const token = await getToken();
    const userId = await AsyncStorage.getItem("userId"); 

    const requestBody = {
      userId: parseInt(userId, 10),
      productId: cartItem.productId,
      quantity: cartItem.quantity, 
    };

    await axios.post(`${API_BASE_URL}/update`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji ilości:', error);
    throw error;
  }
};


export const addSubscription = async (subscription) => {
  try {
    const token = await getToken();
    await axios.post(`${API_BASE_URL}/subscription`, subscription, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Błąd podczas dodawania subskrypcji:', error);
    throw error;
  }
};
