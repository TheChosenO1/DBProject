import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logo from './pictures/logo.png';
import searchIcon from './pictures/search.png';
import userIcon from './pictures/default-user-profile.png';
import cameraIcon from './pictures/camera.png';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="ChateâuNYC Logo" className="navbar-logo" />
          <span className="brand-text">ChateâuNYC</span>
        </Link>
      </div>

      <div className="navbar-center">
        <div className="search-container">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search Art"
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-right">
        <Link to="/explore" className="nav-link">
          <span>Explore Art</span>
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/upload" className="nav-link">
              <img src={cameraIcon} alt="Upload" className="nav-icon" />
              <span>Upload</span>
            </Link>
            <Link to="/local-art" className="nav-link">
              <span>Local Art</span>
            </Link>
            <Link to="/profile" className="nav-link">
              <img 
                src={userIcon} 
                alt={user?.first_name || 'Profile'} 
                className="nav-icon profile-icon" 
              />
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              <span>Login</span>
            </Link>
            <Link to="/signup" className="nav-link">
              <span>Sign Up</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
