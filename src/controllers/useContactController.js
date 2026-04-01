/**
 * Contact Controller - Connects Contact Model to View (MVC Controller)
 */
import { useState, useEffect } from 'react';
import { contactModel } from '../models/api.js';

export function useContactController() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    contactModel
      .getData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
