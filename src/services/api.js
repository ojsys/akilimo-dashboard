// src/services/api.js
export const fetchAkilimoData = async (credentials) => {
    try {
      console.log('Fetching data through proxy...');
      
      const response = await fetch('/api/stats/requests/json', {
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
      
      // Debug log to see the actual structure
      console.log('Raw API response:', data);
      console.log('Response type:', typeof data);
      console.log('Has content property:', 'content' in data);
      
      // Check if it's an array directly
      if (Array.isArray(data)) {
        console.log('Data is an array with length:', data.length);
        return {
          content: data,
          totalElements: data.length,
          totalPages: 1
        };
      }
      
      // If it's paginated response
      if (data.content && Array.isArray(data.content)) {
        console.log('Data is paginated with length:', data.content.length);
        return {
          content: data.content,
          totalElements: data.totalElements || data.content.length,
          totalPages: data.totalPages || 1
        };
      }
  
      // If we can't determine the structure, log it
      console.error('Unexpected data structure:', data);
      throw new Error('Unexpected API response structure');
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };