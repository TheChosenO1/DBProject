import authService from './authService';

const API_URL = 'http://localhost:4000/api';

class ArtService {
  async getArtDetails(artworkId) {
    const token = authService.getToken();
    console.log('Token:', token);
    if (!token) {
      throw new Error('No authentication token found (getting art details)');
    }

    try {
      const response = await fetch(`${API_URL}/details`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artworkId: artworkId }),
      }); // could be string or int .... don't know what will work or not 

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      console.log('Profile Data Response:', data);
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }
}

export default new ArtService(); 