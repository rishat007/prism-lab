/**
 * Teaching View - Different content for overview, courses, and materials
 */
import { useLocation, Link } from 'react-router-dom';
import { useTeachingController } from '../../controllers/useTeachingController.js';
import LinkifiedText from '../components/LinkifiedText.jsx';
import './Page.css';

export default function TeachingView() {
  const { pathname } = useLocation();
  const { data, loading, error } = useTeachingController();

  if (loading) return <div className="page-with-banner"><div className="page-content-area"><p>Loading…</p></div></div>;
  if (error) return <div className="page-with-banner"><div className="page-content-area"><p>Error: {error}</p></div></div>;

  const courses = data?.courses ?? [];
  const materials = data?.materials ?? [];

  const isCourses = pathname.endsWith('/courses');
  const isMaterials = pathname.endsWith('/materials');

  let bannerTitle = 'Teaching';
  let content = null;

  if (isCourses) {
    bannerTitle = 'Courses';
    content = (
      <>
        <p className="lead">Courses taught in the lab.</p>
        <ul className="card-list">
          {courses.map((c) => (
            <li key={c.id} className="card">
              <h3><LinkifiedText text={c.name} keyPrefix={`course-name-${c.id}`} /></h3>
              <p className="meta"><LinkifiedText text={c.code} keyPrefix={`course-code-${c.id}`} /></p>
            </li>
          ))}
        </ul>
      </>
    );
  } else if (isMaterials) {
    bannerTitle = 'Materials';
    content = (
      <>
        <p className="lead">Course materials, handouts, and reading lists.</p>
        <ul className="card-list">
          {materials.map((m) => (
            <li key={m.id} className="card">
              <h3><LinkifiedText text={m.title} keyPrefix={`material-title-${m.id}`} /></h3>
              <p><LinkifiedText text={m.description} keyPrefix={`material-desc-${m.id}`} /></p>
              {m.type && <p className="meta"><LinkifiedText text={m.type} keyPrefix={`material-type-${m.id}`} /></p>}
            </li>
          ))}
        </ul>
      </>
    );
  } else {
    bannerTitle = 'Teaching';
    content = (
      <>
        <p className="lead">Courses and materials.</p>
        <ul className="card-list">
          {courses.slice(0, 2).map((c) => (
            <li key={c.id} className="card">
              <h3><LinkifiedText text={c.name} keyPrefix={`overview-course-name-${c.id}`} /></h3>
              <p className="meta"><LinkifiedText text={c.code} keyPrefix={`overview-course-code-${c.id}`} /></p>
            </li>
          ))}
        </ul>
        <p className="lead mt-3">Browse <Link to="/teaching/courses">courses</Link> and <Link to="/teaching/materials">materials</Link>.</p>
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
