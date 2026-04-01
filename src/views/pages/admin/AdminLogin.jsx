/**
 * Admin Login - submit username and password for JWT token
 */
import { useState } from 'react';
import { loginAdmin, setToken } from '../../../models/adminApi.js';
import './Admin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Enter both username and password.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await loginAdmin(username.trim(), password.trim());
      if (!response?.token) throw new Error('Missing login token from server');
      setToken(response.token);
      window.location.reload();
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-page admin-page--login">
      <div className="admin-login-card">
        <h1>Admin Login</h1>
        <p className="admin-login-sub">PRISM Lab content management</p>
        {error && <p className="admin-error">{error}</p>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </label>
          <p className="admin-login-hint">Default credentials: <code>admin</code> / <code>AdminPass@123</code></p>
          <button type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
}
