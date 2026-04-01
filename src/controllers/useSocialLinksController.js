/**
 * useSocialLinksController - Manage social links
 */
import { useState, useEffect } from 'react';
import { getSocialLinks as fetchSocialLinks, addSocialLink, updateSocialLink, deleteSocialLink, reorderSocialLinks } from '../models/adminApi.js';

export function useSocialLinksController() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchSocialLinks();
      setLinks(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load social links');
    } finally {
      setLoading(false);
    }
  }

  async function createLink(label, url, icon) {
    try {
      setError(null);
      const res = await addSocialLink(label, url, icon);
      setLinks([...links, res.data]);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to create social link');
      throw err;
    }
  }

  async function updateLink(id, updates) {
    try {
      setError(null);
      const res = await updateSocialLink(id, updates);
      setLinks(links.map(l => l.id === id ? res.data : l));
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to update social link');
      throw err;
    }
  }

  async function deleteLink(id) {
    try {
      setError(null);
      await deleteSocialLink(id);
      setLinks(links.filter(l => l.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete social link');
      throw err;
    }
  }

  async function reorder(order) {
    try {
      setError(null);
      const res = await reorderSocialLinks(order);
      setLinks(res.data || []);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to reorder social links');
      throw err;
    }
  }

  return {
    loading,
    error,
    links,
    fetchLinks,
    createLink,
    updateLink,
    deleteLink,
    reorder,
  };
}
