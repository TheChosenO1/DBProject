import React, { useState, useEffect, useRef, useCallback } from 'react';
import ArtworkFrame from './components/ArtworkFrame';
import './ExploreArt.css';

const ExploreArt = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(null);

  const fetchArtworks = async (pageNum) => {
    try {
      const response = await fetch(`http://localhost:4000/api/art/carousel?page=${pageNum}`);
      if (!response.ok) {
        throw new Error('Failed to fetch artworks');
      }
      const data = await response.json();
      
      if (pageNum === 1) {
        setArtworks(data.artworks);
      } else {
        setArtworks(prev => [...prev, ...data.artworks]);
      }
      
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [handleObserver]);

  useEffect(() => {
    fetchArtworks(page);
  }, [page]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="explore-art">
      <h1 className="explore-title">Explore Art</h1>
      <div className="artwork-grid">
        {artworks.map((artwork) => (
          <ArtworkFrame key={artwork.id} artwork={artwork} />
        ))}
      </div>
      
      {/* Loading indicator */}
      <div ref={loadingRef} className="loading-indicator">
        {loading && <div className="loading">Loading artworks...</div>}
        {!hasMore && <div className="no-more">No more artworks to load</div>}
      </div>
    </div>
  );
};

export default ExploreArt;
