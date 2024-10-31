// src/services/api.js
import { useAuthStore } from '../lib/auth';

const API_URL = import.meta.env.VITE_API_URL;
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

export const fetchAkilimoData = async (page = 1, size = 10) => {
  const token = useAuthStore.getState().token;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(
      `${API_URL}/stats/requests?page=${page}&size=${size}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (response.status === 401) {
      useAuthStore.getState().logout();
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    console.error('Error fetching data:', error);
    throw error;
  }
};