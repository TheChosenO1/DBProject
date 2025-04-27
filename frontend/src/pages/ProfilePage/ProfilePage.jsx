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
        <h1 className="profile-name">
            {user ? (
              <>
                {user.first_name}
                <br />
                {user.last_name}
              </>
            ) : (
              <>
                First_Name
                <br />
                Last_Name
              </>
            )}
          </h1>
           {/* painting emoji on the right */}
          <span className="profile-emoji" role="img" aria-label="painting">🖼️</span>
        </div>
        <p className="profile-subtitle">
          {user?.email}
        </p>
        <ProfileHeader />
          <div className="profile-actions">
            <Button onClick={handleSignOut} className="sign-out-button">
              Sign Out
            </Button>
          </div>
      </div>


    </div>
  );
};

export default ProfilePage; 