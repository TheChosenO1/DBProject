import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import profileService from '../../../services/profileService';

const ProfileHeader = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);

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
          <div className="flex gap-3 overflow-x-auto pb-2 max-h-32">
            {profileData.favs.map((fav) => (
              <div key={fav.id} className="flex-none">
                <img 
                  src={fav.artwork_image} 
                  alt={fav.artwork_name}
                  className="favorite-artwork-thumbnail"
                />
                <p className="mt-1 text-xs text-gray-700 font-medium text-center max-w-[96px] truncate">{fav.artwork_name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Art Seen</h3>
          <p className="text-gray-900 text-lg">{profileData.artSeen.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Reviews</h3>
          <p className="text-gray-900 text-lg">{profileData.reviews.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Notes</h3>
          <p className="text-gray-900 text-lg">{profileData.notes.length}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;