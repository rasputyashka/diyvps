import { useState } from 'react';
import { AuthState } from '../types';

export function useAuth() {
  // Mock authentication state - replace with actual authentication logic
  const [auth] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  return auth;
}