// src/services/api.js
import { useAuthStore } from '../lib/auth';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.akilimo.org/v1';

const getBasicAuthHeader = (username, password) => {
  const authString = `${username}:${password}`;
  const encodedAuth = btoa(authString);
  const headerValue = `Basic ${encodedAuth}`;
  
  // Debug logging
  console.log('Auth string (before encoding):', authString);
  console.log('Encoded auth:', encodedAuth);
  console.log('Full header:', headerValue);
  
  return headerValue;
};

export const fetchAkilimoData = async (credentials) => {
  if (!credentials?.username || !credentials?.password) {
    console.error('Missing credentials:', credentials);
    throw new Error('Missing credentials');
  }

  try {
    const authHeader = getBasicAuthHeader(credentials.username, credentials.password);
    
    console.log('Making request to:', `${API_URL}/stats/requests`);
    console.log('With headers:', {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    });

    const response = await fetch(`${API_URL}/stats/requests`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

    if (response.status === 401) {
      const errorText = await response.text();
      console.log('401 error details:', errorText);
      throw new Error('Invalid credentials');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};