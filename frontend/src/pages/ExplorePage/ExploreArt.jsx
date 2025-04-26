import React, { useState, useEffect } from 'react';
import './components/ExploreArt.css';

const ExploreArt = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/art/carousel');
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        const data = await response.json();
        setArtworks(data.artworks);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return <div className="loading">Loading artworks...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="explore-art">
      <h1 className="explore-title">Explore Art</h1>
      <div className="artwork-grid">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="artwork-card">
            <img 
              src={artwork.image_url} 
              alt={artwork.name} 
              className="artwork-image"
            />
            <div className="artwork-info">
              <h3 className="artwork-name">{artwork.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreArt;
