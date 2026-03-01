import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if token exists and fetch user profile
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await getProfile();
          setUser(data);
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Register new user
  const register = async (formData) => {
    const { data } = await registerUser(formData);
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  // Login existing user
  const login = async (formData) => {
    const { data } = await loginUser(formData);
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update user state after profile edit
  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);