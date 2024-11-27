import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth as authApi } from '../api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize auth state from localStorage
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const navigate = useNavigate();

  // Update localStorage whenever auth state changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password);
      if (response.message === 'User logined successfully') {
        setIsAuthenticated(true);
        navigate('/');
        toast.success('Logged in successfully');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to login');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}