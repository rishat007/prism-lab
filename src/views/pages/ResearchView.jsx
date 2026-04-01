/**
 * Research View - Different content for overview, areas, and projects
 */
import { useLocation, Link } from 'react-router-dom';
import { useResearchController } from '../../controllers/useResearchController.js';
import LinkifiedText from '../components/LinkifiedText.jsx';
import './Page.css';

export default function ResearchView() {
  const { pathname } = useLocation();
  const { data, loading, error } = useResearchController();

  if (loading) return <div className="page-with-banner"><div className="page-content-area"><p>Loading…</p></div></div>;
  if (error) return <div className="page-with-banner"><div className="page-content-area"><p>Error: {error}</p></div></div>;

  const areas = data?.areas ?? [];
  const projects = data?.projects ?? [];

  const isAreas = pathname.endsWith('/areas');
  const isProjects = pathname.endsWith('/projects');

  let bannerTitle = 'Research';
  let content = null;

  if (isAreas) {
    bannerTitle = 'Research Areas';
    content = (
      <>
        <p className="lead">Our research focuses on privacy-aware and intelligent system modeling.</p>
        <ul className="card-list">
          {areas.map((area) => (
            <li key={area.id} className="card">
              <h3><LinkifiedText text={area.title} keyPrefix={`area-title-${area.id}`} /></h3>
              <p><LinkifiedText text={area.description} keyPrefix={`area-desc-${area.id}`} /></p>
            </li>
          ))}
        </ul>
      </>
    );
  } else if (isProjects) {
    bannerTitle = 'Projects';
    content = (
      <>
        <p className="lead">Current and past research projects in the lab.</p>
        <ul className="card-list">
          {projects.map((proj) => (
            <li key={proj.id} className="card">
              <h3><LinkifiedText text={proj.title} keyPrefix={`project-title-${proj.id}`} /></h3>
              <p><LinkifiedText text={proj.description} keyPrefix={`project-desc-${proj.id}`} /></p>
              {proj.status && <p className="meta"><LinkifiedText text={proj.status} keyPrefix={`project-status-${proj.id}`} /></p>}
            </li>
          ))}
        </ul>
      </>
    );
  } else {
    bannerTitle = 'Research';
    content = (
      <>
        <p className="lead">Our research focuses on privacy-aware and intelligent system modeling.</p>
        <ul className="card-list">
          {areas.slice(0, 2).map((area) => (
            <li key={area.id} className="card">
              <h3><LinkifiedText text={area.title} keyPrefix={`overview-area-title-${area.id}`} /></h3>
              <p><LinkifiedText text={area.description} keyPrefix={`overview-area-desc-${area.id}`} /></p>
            </li>
          ))}
        </ul>
        <p className="lead mt-3">Explore our <Link to="/research/areas">research areas</Link> and <Link to="/research/projects">projects</Link>.</p>
      </>
    );
  }

  return (
    <div className="page-with-banner">
      <div className="page-banner-wrap">
        <div className="page-banner">
          <h1>{bannerTitle}</h1>
        </div>
      </div>
      <div className="page-content-area">
        {content}
      </div>
    </div>
  );
}
