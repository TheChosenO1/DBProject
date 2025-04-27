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
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Profile Information</h2>
        <div className="text-gray-600 text-lg">
          <span className="font-medium">Email: </span>{profileData.user.email}
        </div>
      </div>

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

        {/* Reviews Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Reviews ({profileData.reviews.length})</h3>
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
                <div key={review.id} className="flex-none">
                  <img 
                    src={review.artwork_image} 
                    alt={review.artwork_name}
                    className="favorite-artwork-thumbnail"
                  />
                  <div className="mt-1 text-center max-w-[96px]">
                    <p className="text-xs text-gray-700 font-medium truncate">
                      {review.artwork_name}
                    </p>
                    <div className="mt-1 px-1">
                      <p className="text-xs text-yellow-500 font-medium">
                        {renderStars(review.rating)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2 text-left">
                        {review.review_text}
                      </p>
                    </div>
                  </div>
                </div>
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
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Notes ({profileData.notes.length})</h3>
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
                <div key={note.id} className="flex-none">
                  <img 
                    src={note.artwork_image} 
                    alt={note.artwork_name}
                    className="favorite-artwork-thumbnail"
                  />
                  <div className="mt-1 text-center max-w-[96px]">
                    <p className="text-xs text-gray-700 font-medium truncate">
                      {note.artwork_name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 text-left px-1">
                      {note.note_text}
                    </p>
                  </div>
                </div>
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