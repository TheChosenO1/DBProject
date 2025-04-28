import authService from './authService';

const API_URL = 'http://localhost:4000/api';

class UploadService {
  async addToFavorites(artworkId) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_URL}/upload/fav`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artworkId : artworkId}),
      });

      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }

      return await response.json();
    } catch (error) {
      console.error('Add to favorites error:', error);
      throw error;
    }
  }

  async removeFromFavorites(artworkId) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
  
    try {
      const response = await fetch(`${API_URL}/upload/fav/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artworkId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }
  
      // Check if there's content before trying to parse JSON
      if (response.status === 204) {
        return { success: true };
      }
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Remove from favorites error:', error);
      throw error;
    }
  }

  async markAsSeen(artworkId) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_URL}/upload/artseen`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artworkId : artworkId}),
      });

      if (!response.ok) {
        throw new Error('Failed to mark artwork as seen');
      }

      return await response.json();
    } catch (error) {
      console.error('Mark as seen error:', error);
      throw error;
    }
  }

  async removeFromSeen(artworkId) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_URL}/upload/artseen/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artworkId : artworkId}),
      });

      if (!response.ok) {
        throw new Error('Failed to remove from seen');
      }

      return await response.json();
    } catch (error) {
      console.error('Remove from seen error:', error);
      throw error;
    }
  }

  async addReview(artworkId, rating, reviewText) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_URL}/upload/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artworkId : artworkId, rating : rating, reviewText : reviewText }),
      });

      if (!response.ok) {
        throw new Error('Failed to add review');
      }

      return await response.json();
    } catch (error) {
      console.error('Add review error:', error);
      throw error;
    }
  }

  async removeReview(reviewId) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_URL}/upload/review/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId : reviewId}),
      });

      if (!response.ok) {
        throw new Error('Failed to remove review');
      }

      return await response.json();
    } catch (error) {
      console.error('Remove review error:', error);
      throw error;
    }
  }

  async addNote(artworkId, noteText) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_URL}/upload/note`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artworkId : artworkId, noteText : noteText}),
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      return await response.json();
    } catch (error) {
      console.error('Add note error:', error);
      throw error;
    }
  }

  async editNote(noteId, noteText) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_URL}/upload/note/edit`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId : noteId, noteText : noteText }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit note');
      }

      return await response.json();
    } catch (error) {
      console.error('Edit note error:', error);
      throw error;
    }
  }

  async removeNote(noteId) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_URL}/upload/note/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId : noteId}),
      });

      if (!response.ok) {
        throw new Error('Failed to remove note');
      }

      return await response.json();
    } catch (error) {
      console.error('Remove note error:', error);
      throw error;
    }
  }
}

export default new UploadService();
