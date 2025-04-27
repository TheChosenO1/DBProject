import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import profileService from '../../../services/profileService';
import authService from '../../../services/authService';

const ProfileHeader = () => {
  console.log('ProfileHeader');
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [token, setToken] = useState(null);
  console.log('user', user);
  console.log('token', token);
  useEffect(() => {
    console.log('useEffect');
    const fetchProfileData = async () => {
      console.log('fetchProfileData');
      if (user?.userid) {
        console.log('user ID found: ', user.userid);
        try {
          const data = await profileService.getProfile(user.userid);
          console.log('Profile Data:', data);
          setProfileData(data);
          
          // Get and set token
          const currentToken = authService.getToken();
          console.log('User Token:', currentToken);
          setToken(currentToken);
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
      <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
      
      {/* User Basic Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">User Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{profileData.user.firstName} {profileData.user.lastName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{profileData.user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Activity Stats</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600">Reviews</p>
            <p className="font-medium">{profileData.reviews.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Notes</p>
            <p className="font-medium">{profileData.notes.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Art Seen</p>
            <p className="font-medium">{profileData.artSeen.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Favorites</p>
            <p className="font-medium">{profileData.favs.length}</p>
          </div>
        </div>
      </div>

      {/* Token Display (for development purposes) */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2">Authentication Token</h3>
        <div className="break-all">
          <p className="text-sm font-mono">{token}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;