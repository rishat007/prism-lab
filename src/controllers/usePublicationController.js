/**
 * Publication Controller - Connects Publication Model to View (MVC Controller)
 */
import { useState, useEffect } from 'react';
import { publicationModel } from '../models/api.js';

export function usePublicationController() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    publicationModel
      .getData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
