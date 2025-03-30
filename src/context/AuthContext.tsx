import { createContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const API_URL = 'http://localhost:5000/api';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Set auth token for axios requests
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        setAuthToken(token);

        try {
          const res = await axios.get(`${API_URL}/auth/me`);
          setUser(res.data.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error loading user:', error);
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setAuthToken(null);
        }
      }

      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      const { token, user } = res.data;

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setAuthToken(token);

      navigate('/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });

      const { token, user } = res.data;

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setAuthToken(token);

      navigate('/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
    navigate('/login');
  };

  // Update user data (e.g., after transaction)
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
