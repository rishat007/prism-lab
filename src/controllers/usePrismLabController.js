/**
 * PRISM Lab Controller - Connects prism model to PrismLabView
 */
import { useState, useEffect } from 'react';
import { prismModel } from '../models/api.js';

function fetchPrism(setData, setLoading, setError) {
  setLoading(true);
  prismModel
    .getData()
    .then(setData)
    .catch((err) => setError(err?.message ?? 'Failed to load'))
    .finally(() => setLoading(false));
}

export function usePrismLabController() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrism(setData, setLoading, setError);
  }, []);

  // Refetch when window regains focus (e.g. after saving in admin and switching back)
  useEffect(() => {
    function onFocus() {
      fetchPrism(setData, setLoading, setError);
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return { data, loading, error };
}
