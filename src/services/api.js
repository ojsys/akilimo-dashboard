// src/services/api.js
export const fetchAkilimoData = async () => {
    try {
      const response = await fetch('https://api.akilimo.org/v1/stats/requests?size=10', {
        headers: {
          // Add your authentication headers here if needed
        }
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };