import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  if (loading) {
    return <div className="search-page"><div className="loading">Loading...</div></div>;
  }

  if (error) {
    return <div className="search-page"><div className="error">Error: {error}</div></div>;
  }

  return (
    <div className="search-page">
      <div className="search-results-container">
        <h1 className="search-title">Search Results</h1>
        <p className="search-query">Results for "{searchQuery}"</p>
        
        <div className="artwork-grid">
          {searchResults.map((artwork) => (
            <div key={artwork.id} className="artwork-card">
              <div className="artwork-image-container">
                <img src={artwork.imageurl} alt={artwork.title} className="artwork-image" />
              </div>
              <div className="artwork-info">
                <h3 className="artwork-title">{artwork.title}</h3>
                <p className="artwork-artist">{artwork.artistname}</p>
                <p className="artwork-museum">{artwork.museumname}</p>
                <div className="artwork-stats">
                  <span className="stat">👁 {artwork.viewcount}</span>
                  <span className="stat">❤️ {artwork.favcount}</span>
                  <span className="stat">⭐ {artwork.avgrating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
