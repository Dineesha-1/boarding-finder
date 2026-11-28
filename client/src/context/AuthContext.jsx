import { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Address of our backend server
const API = 'http://localhost:5000/api/auth';

// Create a context to share the logged-in user with the whole app
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Read the saved user from localStorage so login survives a page refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Log in: send email and password to the backend, then save the user
  const login = async (email, password) => {
    const res = await axios.post(`${API}/login`, { email, password });
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  };

  // Register: send the form data to the backend, then save the new user
  const register = async (formData) => {
    const res = await axios.post(`${API}/register`, formData);
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  };

  // Log out: clear the user from state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so other files can easily use the auth data
export const useAuth = () => useContext(AuthContext);