/**
 * Student Controller - Connects Student Model to View (MVC Controller)
 */
import { useState, useEffect } from 'react';
import { studentModel } from '../models/api.js';

export function useStudentController() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    studentModel
      .getData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
