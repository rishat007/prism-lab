/**
 * Teaching Controller - Connects Teaching Model to View (MVC Controller)
 */
import { useState, useEffect } from 'react';
import { teachingModel } from '../models/api.js';

export function useTeachingController() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    teachingModel
      .getData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
