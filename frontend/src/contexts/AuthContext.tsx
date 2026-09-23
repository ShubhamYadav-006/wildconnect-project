import { useState, useEffect, ReactNode } from 'react';
import { User, authService } from '../services/auth.service';
import { AuthContext } from './authContextDef';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Synchronize with backend profile to ensure authoritative role
      authService.getProfile().then((freshProfile) => {
        if (freshProfile) {
          setUser(freshProfile);
        }
      }).catch(() => {
        // If profile fetch fails due to expired/invalid token, clean up
        authService.logout();
        setUser(null);
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;