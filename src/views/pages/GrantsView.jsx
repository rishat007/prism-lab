/**
 * Grants View - Same layout as Publications: green banner + white content
 */
import { useGrantController } from '../../controllers/useGrantController.js';
import LinkifiedText from '../components/LinkifiedText.jsx';
import './Page.css';

export default function GrantsView() {
  const { data, loading, error } = useGrantController();

  if (loading) return <div className="page-with-banner"><div className="page-content-area"><p>Loading…</p></div></div>;
  if (error) return <div className="page-with-banner"><div className="page-content-area"><p>Error: {error}</p></div></div>;

  const grants = data?.grants ?? [];

  return (
    <div className="page-with-banner">
      <div className="page-banner-wrap">
        <div className="page-banner">
          <h1>Grants</h1>
        </div>
      </div>
      <div className="page-content-area">
        <p className="lead">Funded projects and grants.</p>
        <ul className="card-list">
          {grants.map((grant) => (
            <li key={grant.id} className="card">
              <h3><LinkifiedText text={grant.title} keyPrefix={`grant-title-${grant.id}`} /></h3>
              <p className="meta"><LinkifiedText text={`${grant.agency ?? ''}${grant.agency && grant.period ? ' · ' : ''}${grant.period ?? ''}`} keyPrefix={`grant-meta-${grant.id}`} /></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
