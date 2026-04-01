/**
 * Research Controller - Connects Research Model to View (MVC Controller)
 */
import { useState, useEffect } from 'react';
import { researchModel } from '../models/api.js';

export function useResearchController() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    researchModel
      .getData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
