import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, googleLogin } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('befit_token');
      const storedUser = localStorage.getItem('befit_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse stored auth', e);
      localStorage.removeItem('befit_token');
      localStorage.removeItem('befit_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    const { token: jwtToken, user: userData } = response.data;
    localStorage.setItem('befit_token', jwtToken);
    localStorage.setItem('befit_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (email, password, firstName, lastName, age, height, weight) => {
    const payload = { email, password, firstName, lastName };
    if (age !== undefined && age !== '') payload.age = Number(age);
    if (height !== undefined && height !== '') payload.height = Number(height);
    if (weight !== undefined && weight !== '') payload.weight = Number(weight);

    await registerUser(payload);
    // After register, automatically log the user in
    return await login(email, password);
  };

  const updateUser = (updatedUserData) => {
    const merged = { ...user, ...updatedUserData };
    localStorage.setItem('befit_user', JSON.stringify(merged));
    setUser(merged);
    return merged;
  };

  const handleGoogleLogin = async (credential) => {
    const response = await googleLogin(credential);
    const { token: jwtToken, user: userData } = response.data;
    localStorage.setItem('befit_token', jwtToken);
    localStorage.setItem('befit_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('befit_token');
    localStorage.removeItem('befit_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        updateUser,
        loginWithGoogle: handleGoogleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
