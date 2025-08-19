// src/App.tsx

import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HeroPage from './pages/HeroPage'; // Import the new HeroPage

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
const DashboardPage = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <section className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to CWB CHAT WITH DATA BASE</h1>
        <p className="text-lg text-gray-400 mb-8">You have successfully logged in.</p>
        <button
          onClick={onLogout}
          className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Logout
        </button>
      </div>
    </section>
  );
};

export default App;