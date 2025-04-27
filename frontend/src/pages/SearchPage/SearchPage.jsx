import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance'); // Sortby:  relevance ? popularity
  const [sortOrder, setSortOrder] = useState('desc'); // sortOrder: descending ? ascending

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(searchQuery)}&sortBy=${sortBy}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error('Error fetching search results {searchQuery}:', searchQuery, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery, sortBy]);

  // Sortby: relevance ? popularity
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // Update URL to reflect the sort option (optional)
    setSearchParams({ q: searchQuery, sortBy: newSortBy, order: sortOrder });
  };

  // sortOrder: descending ? ascending
  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);

    setSearchParams({ q: searchQuery, sortBy: sortBy, order: newOrder });
  };

  // Apply the sort order to the results, if ascending, reverse the results, else keep as is
  const displayResults = (sortOrder === 'asc' 
    ? [...searchResults].reverse() 
    : searchResults);

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
        
        <div className="sort-controls">
          <div className="sort-type">
            <span className="sort-label">Sort by:</span>
            <button 
              className={`sort-button ${sortBy === 'relevance' ? 'active' : ''}`}
              onClick={() => handleSortChange('relevance')}
            >
              Relevance
            </button>
            <button 
              className={`sort-button ${sortBy === 'popularity' ? 'active' : ''}`}
              onClick={() => handleSortChange('popularity')}
            >
              Popularity
            </button>
          </div>
          
          <div className="sort-order">
            <button 
              className="sort-order-button"
              onClick={toggleSortOrder}
              title={sortOrder === 'desc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              {sortOrder === 'desc' ? '↓ Descending' : '↑ Ascending'}
            </button>
          </div>
        </div>
        
        <div className="artwork-grid">
          {displayResults.map((artwork) => (
            <Link 
              to={`/artreview/${artwork.id}`} 
              key={artwork.id} 
            >
              <div className="artwork-card">
                <div className="artwork-image-container">
                  <img src={artwork.imageurl} alt={artwork.title} className="artwork-image" />
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">{artwork.title}</h3>
                  <p className="artwork-artist">{artwork.artistname}</p>
                  <p className="artwork-museum">{artwork.museumname}</p>
                  <div className="artwork-stats">
                    <span className="stat">★ {artwork.avgrating.toFixed(1)}</span>
                    <span className="stat">🤍️ {artwork.favcount}</span>
                    <span className="stat">🔍 {artwork.viewcount}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;