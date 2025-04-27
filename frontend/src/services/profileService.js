import authService from './authService';

const API_URL = 'http://localhost:4000/api';

class ProfileService {
  async getProfile(userId) {
    const token = authService.getToken();
    console.log('Token:', token);
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_URL}/users/${userId}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }
}

export default new ProfileService(); 