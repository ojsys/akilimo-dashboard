export const fetchAkilimoData = async (credentials) => {
    try {
      // Set size to total number of records (120539 from what we saw earlier)
      const response = await fetch(`/api/stats/requests?size=150000`, {
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
  