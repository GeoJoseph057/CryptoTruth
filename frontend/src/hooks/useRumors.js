import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useRumors = () => {
  const [rumors, setRumors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRumors = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/rumors`);
      if (!response.ok) {
        throw new Error('Failed to fetch rumors');
      }

      const data = await response.json();
      setRumors(data.rumors || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching rumors:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitRumor = async (rumorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rumors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rumorData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rumor');
      }

      const newRumor = await response.json();
      setRumors(prev => [newRumor, ...prev]);
      return newRumor;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    rumors,
    loading,
    error,
    fetchRumors,
    submitRumor,
  };
};