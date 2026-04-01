/**
 * Resume View - Same layout as Publications: green banner + white content
 */
import { useResumeController } from '../../controllers/useResumeController.js';
import LinkifiedText from '../components/LinkifiedText.jsx';
import './Page.css';

export default function ResumeView() {
  const { data, loading, error } = useResumeController();

  if (loading) return <div className="page-with-banner"><div className="page-content-area"><p>Loading…</p></div></div>;
  if (error) return <div className="page-with-banner"><div className="page-content-area"><p>Error: {error}</p></div></div>;

  const title = data?.title ?? 'Resume';

  return (
    <div className="page-with-banner">
      <div className="page-banner-wrap">
        <div className="page-banner">
          <h1><LinkifiedText text={title} keyPrefix="resume-title" /></h1>
        </div>
      </div>
      <div className="page-content-area">
        <p className="lead"><LinkifiedText text={data?.summary ?? 'Lab director and research profile.'} keyPrefix="resume-summary" /></p>
      </div>
    </div>
  );
}
