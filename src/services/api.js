// src/services/api.js
export const fetchAkilimoData = async (credentials) => {
    try {
      const authToken = btoa(`${credentials.username}:${credentials.password}`);
      
      const response = await fetch('/api/stats/requests/json', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      const rawData = await response.json();
      
      // The API is returning { content: Array(117932) }
      return {
        content: rawData.content,
        totalElements: rawData.content.length
      };
  
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };