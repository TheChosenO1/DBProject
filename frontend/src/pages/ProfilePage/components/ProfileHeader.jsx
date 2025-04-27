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
      <div className="space-y-4 max-w-xs">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Reviews</h3>
          <p className="text-gray-900 text-lg">{profileData.reviews.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Notes</h3>
          <p className="text-gray-900 text-lg">{profileData.notes.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Art Seen</h3>
          <p className="text-gray-900 text-lg">{profileData.artSeen.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Favorites</h3>
          <p className="text-gray-900 text-lg">{profileData.favs.length}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;