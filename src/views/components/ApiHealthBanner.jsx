/**
 * API health banner - shows when backend is unreachable so user knows to start backend first
 */
import { useState, useEffect } from 'react';

export default function ApiHealthBanner() {
  const [unreachable, setUnreachable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api')
      .then((res) => {
        if (cancelled) return;
        // Only treat as unreachable on network failure; 4xx/5xx mean backend responded
      })
      .catch(() => {
        if (!cancelled) setUnreachable(true);
      });
    return () => { cancelled = true; };
  }, []);

  if (!unreachable) return null;

  return (
    <div className="api-health-banner" role="alert">
      <strong>API not reachable.</strong> Start the backend first: <code>npm run dev:backend</code> (in project root). Then restart the frontend so the proxy uses the correct port.
    </div>
  );
}
