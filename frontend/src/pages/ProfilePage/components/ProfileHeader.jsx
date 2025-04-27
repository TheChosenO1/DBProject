import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import profileService from '../../../services/profileService';
import './ProfileHeader.css';

const ProfileHeader = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const favoritesScrollRef = useRef(null);
  const artSeenScrollRef = useRef(null);
  const reviewsScrollRef = useRef(null);
  const notesScrollRef = useRef(null);

  const handleScroll = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = 300;
      const newScrollPosition = ref.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      ref.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.userid) {
        try {
          const data = await profileService.getProfile(user.userid);
          setProfileData(data);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  if (!profileData) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-header-container">
      <div className="profile-info-section">
        <h2 className="profile-info-title">Profile Information</h2>
        <div className="profile-email">
          <span className="profile-email-label">Email: </span>{profileData.user.email}
        </div>
      </div>

      <div className="stats-container">
        {/* Favorites Section */}
        <div className="section-container">
          <h3 className="section-title">Favorites ({profileData.favs.length})</h3>
          <div className="favorites-container relative">
            <button 
              onClick={() => handleScroll('left', favoritesScrollRef)}
              className="scroll-button scroll-left"
              aria-label="Scroll left favorites"
            >
              &#8249;
            </button>
            <div 
              ref={favoritesScrollRef}
              className="favorites-scroll-container"
            >
              {profileData.favs.map((fav) => (
                <Link to={`/artreview/${fav.artworkid}`} key={fav.id} className="thumbnail-link">
                  <div className="thumbnail-container">
                    <img 
                      src={fav.artwork_image} 
                      alt={fav.artwork_name}
                      className="artwork-thumbnail"
                    />
                    <p className="thumbnail-title">{fav.artwork_name}</p>
                  </div>
                </Link>
              ))}
            </div>
            <button 
              onClick={() => handleScroll('right', favoritesScrollRef)}
              className="scroll-button scroll-right"
              aria-label="Scroll right favorites"
            >
              &#8250;
            </button>
          </div>
        </div>

        {/* Art Seen Section */}
        <div className="section-container">
          <h3 className="section-title">Art Seen ({profileData.artSeen.length})</h3>
          <div className="favorites-container relative">
            <button 
              onClick={() => handleScroll('left', artSeenScrollRef)}
              className="scroll-button scroll-left"
              aria-label="Scroll left art seen"
            >
              &#8249;
            </button>
            <div 
              ref={artSeenScrollRef}
              className="favorites-scroll-container"
            >
              {profileData.artSeen.map((art) => (
                <Link to={`/artreview/${art.artworkid}`} key={art.id} className="thumbnail-link">
                  <div className="thumbnail-container">
                    <img 
                      src={art.artwork_image} 
                      alt={art.artwork_name}
                      className="artwork-thumbnail"
                    />
                    <p className="thumbnail-title">{art.artwork_name}</p>
                  </div>
                </Link>
              ))}
            </div>
            <button 
              onClick={() => handleScroll('right', artSeenScrollRef)}
              className="scroll-button scroll-right"
              aria-label="Scroll right art seen"
            >
              &#8250;
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="section-container">
          <h3 className="section-title">Reviews ({profileData.reviews.length})</h3>
          <div className="favorites-container relative">
            <button 
              onClick={() => handleScroll('left', reviewsScrollRef)}
              className="scroll-button scroll-left"
              aria-label="Scroll left reviews"
            >
              &#8249;
            </button>
            <div 
              ref={reviewsScrollRef}
              className="favorites-scroll-container"
            >
              {profileData.reviews.map((review) => (
                <Link to={`/artreview/${review.artworkid}`} key={review.id} className="thumbnail-link">
                  <div className="thumbnail-container">
                    <img 
                      src={review.artwork_image} 
                      alt={review.artwork_name}
                      className="artwork-thumbnail"
                    />
                    <div className="review-content">
                      <p className="thumbnail-title">{review.artwork_name}</p>
                      <p className="rating-stars">{renderStars(review.rating)}</p>
                      <p className="review-text">{review.review_text}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <button 
              onClick={() => handleScroll('right', reviewsScrollRef)}
              className="scroll-button scroll-right"
              aria-label="Scroll right reviews"
            >
              &#8250;
            </button>
          </div>
        </div>

        {/* Notes Section */}
        <div className="section-container">
          <h3 className="section-title">Notes ({profileData.notes.length})</h3>
          <div className="favorites-container relative">
            <button 
              onClick={() => handleScroll('left', notesScrollRef)}
              className="scroll-button scroll-left"
              aria-label="Scroll left notes"
            >
              &#8249;
            </button>
            <div 
              ref={notesScrollRef}
              className="favorites-scroll-container"
            >
              {profileData.notes.map((note) => (
                <Link to={`/artreview/${note.artworkid}`} key={note.id} className="thumbnail-link">
                  <div className="thumbnail-container">
                    <img 
                      src={note.artwork_image} 
                      alt={note.artwork_name}
                      className="artwork-thumbnail"
                    />
                    <div className="note-content">
                      <p className="thumbnail-title">{note.artwork_name}</p>
                      <p className="note-text">{note.note_text}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <button 
              onClick={() => handleScroll('right', notesScrollRef)}
              className="scroll-button scroll-right"
              aria-label="Scroll right notes"
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;