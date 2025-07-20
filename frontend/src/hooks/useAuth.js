import { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { ethers } from 'ethers';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useAuth = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if token is valid on mount
  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  // Clear auth when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      logout();
    }
  }, [isConnected]);

  const validateToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
    }
  };

  const login = async () => {
    if (!address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Get nonce from server
      const nonceResponse = await fetch(`${API_BASE_URL}/auth/nonce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletAddress: address })
      });

      if (!nonceResponse.ok) {
        throw new Error('Failed to get authentication challenge');
      }

      const { nonce, message } = await nonceResponse.json();

      // Step 2: Sign the message with wallet
      const signature = await signMessageAsync({ message });

      // Step 3: Verify signature with server
      const verifyResponse = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message
        })
      });

      if (!verifyResponse.ok) {
        throw new Error('Authentication failed');
      }

      const { token: authToken, user: userData } = await verifyResponse.json();

      // Store token and user data
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);

      return { token: authToken, user: userData };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const isAuthenticated = !!token && !!user;

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    validateToken
  };
};