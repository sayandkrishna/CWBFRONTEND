// src/App.tsx

import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HeroPage from './pages/HeroPage'; // Import the new HeroPage
import DashboardPage from './pages/DashboardPage'; // Import the DashboardPage

// Main App Component to manage navigation and authentication state
function App() {
  // State to track the current page ('hero', 'login', or 'signup')
  const [currentPage, setCurrentPage] = useState('hero');
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to navigate to a specific page
  const navigate = (page: 'hero' | 'login' | 'signup') => {
    setCurrentPage(page);
  };

  // Function to handle successful login/signup
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    // Redirect to hero page after logout
    setCurrentPage('hero');
  };

  // Renders the correct component based on the current state
  const renderPage = () => {
    if (isAuthenticated) {
      return <DashboardPage onLogout={handleLogout} />;
    }
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={() => navigate('signup')} onLoginSuccess={handleAuthSuccess} onBack={() => navigate('hero')} />;
      case 'signup':
        return <SignupPage onNavigate={() => navigate('login')} onSignupSuccess={handleAuthSuccess} onBack={() => navigate('hero')} />;
      case 'hero':
      default:
        return <HeroPage onLogin={() => navigate('login')} onSignup={() => navigate('signup')} />;
    }
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
}

// A simple Dashboard page shown after login/signup

export default App;