/**
 * Grant Controller - Connects Grant Model to View (MVC Controller)
 */
import { useState, useEffect } from 'react';
import { grantModel } from '../models/api.js';

export function useGrantController() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    grantModel
      .getData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
