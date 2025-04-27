import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './ArtworkFrame.css';

const ArtworkFrame = ({ artwork }) => {
  return (
    <Link to={`/artreview/${artwork.id}`} className="artwork-link">
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
    </Link>
  );
};


// artwork id can be a string or a number, some musuems may have a string id (i.e. A13) and some may have a number id
// i doin't think is necesary but its good to se ethe types of what we are dealing with 
ArtworkFrame.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.number.isRequired,
    ]).isRequired,
    name: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
  }).isRequired,
};

export default ArtworkFrame; 