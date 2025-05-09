import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ExploreArt from './pages/ExplorePage/ExploreArt.jsx';
import SearchPage from './pages/SearchPage/SearchPage';
import ArtReviewPage from './pages/ArtReviewPage/ArtReviewPage';
// Import styles
import './styles/variables.css';
import './styles/global.css';
import './styles/typography.css';
import './styles/utilities.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/explore" element={<ExploreArt />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/artreview" element={<ArtReviewPage />} />
              <Route path="/artreview/:artId" element={<ArtReviewPage />} />
              {/* Here is where can add more routes to the pages as they are implemented :() */}
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
