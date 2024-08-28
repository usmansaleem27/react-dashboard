import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check local storage on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // Empty dependency array

  // Function to log in the user
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3007/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      throw error; // Ensure that the error is propagated
    }
  };

  // Function to log out the user manually
  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
