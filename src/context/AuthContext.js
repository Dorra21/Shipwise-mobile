import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Debug: Log whenever isLoggedIn changes
  useEffect(() => {
    console.log('🔐 Auth State Changed:', isLoggedIn ? 'LOGGED IN' : 'LOGGED OUT');
  }, [isLoggedIn]);

  const login = () => {
    console.log('✅ LOGIN function called');
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log('❌ LOGOUT function called');
    console.log('Current state before logout:', isLoggedIn);
    setIsLoggedIn(false);
    console.log('State should now be false');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};