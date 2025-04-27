import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import userIcon from '../../components/pictures/default-user-profile.png';
import ProfileHeader from './components/ProfileHeader';
import './ProfilePage.css';

const ProfilePage = () => {
  console.log('ProfilePage');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    console.log('handleSignOut');
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <img 
            src={userIcon} 
            alt={user?.first_name || 'Profile'} 
            className="profile-image"
          />
          <h1 className="profile-name">
            {user ? `${user.first_name} ${user.last_name}` : 'First_Name Last_Name'}
          </h1>
          <p className="profile-subtitle">User since date of account creation</p>
          <div className="profile-actions">
            <Button onClick={handleSignOut} className="sign-out-button">
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Profile Header Component with detailed information */}
        <ProfileHeader />
      </div>
    </div>
  );
};

export default ProfilePage; 