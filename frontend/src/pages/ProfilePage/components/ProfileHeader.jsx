import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import profileService from '../../../services/profileService';


  
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
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      {/* Stats Section */}
      <div className="space-y-6">
        {/* Favorites Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Favorites ({profileData.favs.length})</h3>
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
                <div key={fav.id} className="flex-none">
                  <img 
                    src={fav.artwork_image} 
                    alt={fav.artwork_name}
                    className="favorite-artwork-thumbnail"
                  />
                  <p className="mt-1 text-xs text-gray-700 font-medium text-center max-w-[96px] truncate">
                    {fav.artwork_name}
                  </p>
                </div>
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
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Art Seen ({profileData.artSeen.length})</h3>
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
                <div key={art.id} className="flex-none">
                  <img 
                    src={art.artwork_image} 
                    alt={art.artwork_name}
                    className="favorite-artwork-thumbnail"
                  />
                  <p className="mt-1 text-xs text-gray-700 font-medium text-center max-w-[96px] truncate">
                    {art.artwork_name}
                  </p>
                </div>
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

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">
            Reviews ({profileData.reviews.length})
          </h3>
          <div className="favorites-container relative">
            <button
              onClick={() => handleScroll('left', reviewsScrollRef)}
              className="scroll-button scroll-left"
              aria-label="Scroll left reviews"
            >
              ‹
            </button>

            <div ref={reviewsScrollRef} className="favorites-scroll-container">
              {profileData.reviews.map((review) => {
                // pick a color by rating
                const getColor = (r) => {
                  switch (r) {
                    case 1: return '#e53e3e';   // red
                    case 2: return '#dd6b20';  // orange
                    case 3: return '#d69e2e';  // yellow
                    case 4: return '#38a169';  // green
                    case 5: return '#2f855a';  // dark green
                    default: return '#718096';
                  }
                };
                // truncate text to ~80 chars
                const raw = review.review_text || '';
                const snippet = raw.length > 80
                  ? raw.slice(0, 80) + '…'
                  : raw;

                return (
                  <div key={review.id} className="review-card">
                    <div
                      className="review-stars"
                      style={{ color: getColor(review.rating) }}
                    >
                      {renderStars(review.rating)}
                    </div>
                    <div className="review-snippet">
                      {snippet}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleScroll('right', reviewsScrollRef)}
              className="scroll-button scroll-right"
              aria-label="Scroll right reviews"
            >
              ›
            </button>
          </div>
        </div>


      <div className="bg-gray-50 p-4 rounded-lg">
  <h3 className="text-xl font-bold mb-4">
    Notes ({profileData.notes.length})
  </h3>
  <div className="favorites-container relative">
    <button
      onClick={() => handleScroll('left', notesScrollRef)}
      className="scroll-button scroll-left"
      aria-label="Scroll left notes"
    >‹</button>

    <div ref={notesScrollRef} className="favorites-scroll-container">
        {profileData.notes.map((note) => {
        // truncate the note text
        const raw = note.note_text || '';
        const snippet = raw.length > 80
          ? raw.slice(0, 80) + '…'
          : raw;

        return (
          <div key={note.id} className="note-card">
            <div className="note-title">
              {note.artwork_name}
            </div>
            <div className="note-snippet">
              {snippet}
            </div>
          </div>
        );
      })}
    </div>

    <button
      onClick={() => handleScroll('right', notesScrollRef)}
      className="scroll-button scroll-right"
      aria-label="Scroll right notes"
    >›</button>
  </div>
</div>
      </div>
    </div>
  );
};

export default ProfileHeader;