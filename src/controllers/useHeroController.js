/**
 * Hero Controller - fetches hero slides for carousel
 */
import { useState, useEffect } from 'react';
import { heroModel } from '../models/api.js';

export function useHeroController() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    heroModel
      .getData()
      .then((data) => setSlides(data?.slides ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { slides, loading, error };
}
