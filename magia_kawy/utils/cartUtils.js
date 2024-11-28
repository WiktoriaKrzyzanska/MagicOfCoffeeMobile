import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://xxx.xxx.x.xxx:8082/coffee/cart';

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
    const token = await getToken();
    const response = await axios.get(`${API_BASE_URL}/1`, {
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
    await axios.post(`${API_BASE_URL}/remove`, cartItem, {
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
    await axios.post(`${API_BASE_URL}/update`, cartItem, {
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
