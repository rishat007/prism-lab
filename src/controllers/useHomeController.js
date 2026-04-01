/**
 * Home Controller - Connects Home Model to View (MVC Controller)
 */
import { useState, useEffect } from 'react';
import { homeModel } from '../models/api.js';

function fetchHome(setData, setLoading, setError) {
  setLoading(true);
  homeModel
    .getData()
    .then(setData)
    .catch((err) => setError(err?.message ?? 'Failed to load'))
    .finally(() => setLoading(false));
}

export function useHomeController() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHome(setData, setLoading, setError);
  }, []);

  // Refetch when window regains focus (e.g. after saving in admin and switching back)
  useEffect(() => {
    function onFocus() {
      fetchHome(setData, setLoading, setError);
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return { data, loading, error };
}
