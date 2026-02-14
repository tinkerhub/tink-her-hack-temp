import React, { useState } from 'react';
import Calculator from './components/Calculator';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [isLocked, setIsLocked] = useState(true); // Start locked (showing calculator)
  const [user, setUser] = useState(null);

  const handleUnlock = (enteredCode) => {
    // Secret code to access the auth screen (1234=)
    if (enteredCode === '1234=') {
      setIsLocked(false);
      return true;
    }

    // If user is logged in, verify their personal secret code
    if (user && user.secret_code === enteredCode) {
      setIsLocked(false);
      return true;
    }

    return false;
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLocked(false); // Unlock after successful login
  };

  const handleLogout = () => {
    setUser(null);
    setIsLocked(true); // Lock to show calculator after logout
  };

  return (
    <div className="app">
      {isLocked ? (
        <Calculator onUnlock={handleUnlock} user={user} />
      ) : !user ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
