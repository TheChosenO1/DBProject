import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logo from './pictures/logo.png';
import searchIcon from './pictures/search.png';
import userIcon from './pictures/default-user-profile.png';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="ChateâuNYC Logo" className="navbar-logo" />
          <span className="brand-text">ChateâuNYC</span>
        </Link>
      </div>

      <div className="navbar-center">
        <form onSubmit={handleSearch} className="search-container">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search Art"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="navbar-right">
        <Link to="/explore" className="nav-link">
          <span>Explore Art</span>
        </Link>
        {isAuthenticated ? (
          <>
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
