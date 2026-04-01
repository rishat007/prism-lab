/**
 * AdminSocialLinks - Manage social media links
 */
import { useState } from 'react';
import { useSocialLinksController } from '../../../controllers/useSocialLinksController.js';
import './Admin.css';

export default function AdminSocialLinks({ onNotify }) {
  const { loading, error, links, createLink, updateLink, deleteLink, reorder } = useSocialLinksController();
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editUrl, setEditUrl] = useState('');

  async function handleAdd(e) {
    e.preventDefault();
    if (!newLabel.trim() || !newUrl.trim()) return;
    
    setSubmitting(true);
    try {
      await createLink(newLabel, newUrl, newIcon || newLabel.toLowerCase().replace(/\s+/g, '-'));
      setNewLabel('');
      setNewUrl('');
      setNewIcon('');
      onNotify?.('Social link added successfully.', 'success');
    } catch (err) {
      console.error('Failed to add link:', err);
      onNotify?.(err?.message || 'Failed to add social link.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStartEdit(link) {
    setEditingId(link.id);
    setEditLabel(link.label);
    setEditUrl(link.url);
  }

  async function handleSaveEdit(id) {
    if (!editLabel.trim() || !editUrl.trim()) return;
    
    setSubmitting(true);
    try {
      await updateLink(id, { label: editLabel, url: editUrl });
      setEditingId(null);
      onNotify?.('Social link updated successfully.', 'success');
    } catch (err) {
      console.error('Failed to update link:', err);
      onNotify?.(err?.message || 'Failed to update social link.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this social link?')) return;
    
    setSubmitting(true);
    try {
      await deleteLink(id);
      onNotify?.('Social link deleted successfully.', 'success');
    } catch (err) {
      console.error('Failed to delete link:', err);
      onNotify?.(err?.message || 'Failed to delete social link.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMoveUp(index) {
    if (index === 0) return;
    const newOrder = links.map((l, i) => ({
      id: l.id,
      order: i === index ? i : i === index - 1 ? i + 2 : i + 1,
    }));
    setSubmitting(true);
    try {
      await reorder(newOrder);
      onNotify?.('Social link order updated.', 'info');
    } catch (err) {
      console.error('Failed to reorder:', err);
      onNotify?.(err?.message || 'Failed to reorder social links.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMoveDown(index) {
    if (index === links.length - 1) return;
    const newOrder = links.map((l, i) => ({
      id: l.id,
      order: i === index ? i + 2 : i === index + 1 ? i : i + 1,
    }));
    setSubmitting(true);
    try {
      await reorder(newOrder);
      onNotify?.('Social link order updated.', 'info');
    } catch (err) {
      console.error('Failed to reorder:', err);
      onNotify?.(err?.message || 'Failed to reorder social links.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-section">
      <h2>Social Media Links</h2>
      
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-form-card">
        <h3>Add New Link</h3>
        <form className="admin-form-grid" onSubmit={handleAdd}>
          <label>
            <span>Label</span>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g., LinkedIn"
              disabled={submitting}
            />
          </label>
          <label>
            <span>URL</span>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://linkedin.com"
              disabled={submitting}
            />
          </label>
          <label>
            <span>Icon ID</span>
            <input
              type="text"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              placeholder="linkedin (auto-generated if empty)"
              disabled={submitting}
            />
          </label>
          <button type="submit" disabled={submitting || !newLabel.trim() || !newUrl.trim()}>
            {submitting ? 'Adding...' : 'Add Link'}
          </button>
        </form>
      </div>

      <div className="admin-form-card">
        <h3>Manage Links</h3>
        {loading ? (
          <p>Loading links...</p>
        ) : links.length === 0 ? (
          <p>No social links configured.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Label</th>
                <th>URL</th>
                <th>Icon</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link, index) => (
                <tr key={link.id}>
                  <td>
                    {editingId === link.id ? (
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        disabled={submitting}
                      />
                    ) : (
                      link.label
                    )}
                  </td>
                  <td>
                    {editingId === link.id ? (
                      <input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        disabled={submitting}
                      />
                    ) : (
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.url}
                      </a>
                    )}
                  </td>
                  <td>{link.icon}</td>
                  <td>{link.order}</td>
                  <td>
                    <div className="admin-actions">
                      {editingId === link.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(link.id)}
                            disabled={submitting}
                            className="btn-small btn-success"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            disabled={submitting}
                            className="btn-small"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(link)}
                            disabled={submitting}
                            className="btn-small"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={submitting || index === 0}
                            className="btn-small"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={submitting || index === links.length - 1}
                            className="btn-small"
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => handleDelete(link.id)}
                            disabled={submitting}
                            className="btn-small btn-danger"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
