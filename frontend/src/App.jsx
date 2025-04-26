import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';

// Import styles
import './styles/variables.css';
import './styles/global.css';
import './styles/typography.css';
import './styles/utilities.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes as they are implemented */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
