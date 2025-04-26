import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../styles/auth.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const { signup, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmError('');

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      return;
    }

    await signup(email, password);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Welcome to ChateâuNYC!</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          {confirmError && <div className="auth-error">{confirmError}</div>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Sign Up</Button>
          <p className="auth-link">
            Have an account? <Link to="/login">Sign in by clicking here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage; 