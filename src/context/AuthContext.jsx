import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { access_token } = response;
      
      // Store token
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Create user object from registration/credentials
      // Since backend doesn't return user data on login, we'll store email
      const userData = {
        email: credentials.email,
        // We'll get full user data later if needed
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      // Registration returns user data
      const registeredUser = response;
      
      // After successful registration, automatically log in
      const loginResult = await login({
        email: userData.email,
        password: userData.password
      });
      
      if (loginResult.success) {
        // Update user data with registration response
        const fullUserData = {
          id: registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email,
          group_id: registeredUser.group_id,
        };
        localStorage.setItem('user', JSON.stringify(fullUserData));
        setUser(fullUserData);
      }
      
      return loginResult;
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  // Update user data
  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
