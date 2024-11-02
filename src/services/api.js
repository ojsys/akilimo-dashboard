// src/services/api.js
export const fetchAkilimoData = async (credentials) => {
    try {
      const response = await fetch(`/api/stats/requests`, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`),
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Data fetched successfully:', {
        totalRecords: data.content?.length || 0,
        totalElements: data.totalElements
      });
  
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };