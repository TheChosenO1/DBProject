import React from 'react';
import PropTypes from 'prop-types';
import './ArtworkFrame.css';

const ArtworkFrame = ({ artwork }) => {
  return (
    <div className="artwork-card">
      <img 
        src={artwork.image_url} 
        alt={artwork.name} 
        className="artwork-image"
      />
      <div className="artwork-info">
        <h3 className="artwork-name">{artwork.name}</h3>
      </div>
    </div>
  );
};

ArtworkFrame.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
  }).isRequired,
};

export default ArtworkFrame; 