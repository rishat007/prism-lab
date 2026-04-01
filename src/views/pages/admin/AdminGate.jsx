/**
 * Admin gate - show login or dashboard based on token
 */
import { useState, useEffect, useRef } from 'react';
import { getToken, verifyAdmin } from '../../../models/adminApi.js';
import AdminLogin from './AdminLogin.jsx';
import AdminDashboard from './AdminDashboard.jsx';

export default function AdminGate() {
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const verifying = useRef(false);

  useEffect(() => {
    const token = getToken();
    if (!token || !token.trim()) {
      setChecked(true);
      return;
    }
    if (verifying.current) return;
    verifying.current = true;
    verifyAdmin()
      .then(() => {
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setChecked(true);
        verifying.current = false;
      });
  }, []);

  if (!checked) return <div className="admin-page"><p>Loading…</p></div>;
  if (authenticated) return <AdminDashboard />;
  return <AdminLogin />;
}
