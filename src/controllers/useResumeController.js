/**
 * Resume Controller - Connects Resume Model to View (MVC Controller)
 */
import { useState, useEffect } from 'react';
import { resumeModel } from '../models/api.js';

export function useResumeController() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    resumeModel
      .getData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
