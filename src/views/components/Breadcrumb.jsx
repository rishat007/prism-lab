/**
 * Breadcrumb - Home / [lab name] / [current page] (lab name from Admin → PRISM Lab)
 */
import { Link, useLocation } from 'react-router-dom';
import { usePrismLabController } from '../../controllers/usePrismLabController.js';

const LABELS = {
  '': 'Home',
  'resume': 'Resume',
  'research': 'Research',
  'research/areas': 'Areas',
  'research/projects': 'Projects',
  'teaching': 'Teaching',
  'teaching/courses': 'Courses',
  'teaching/materials': 'Materials',
  'publications': 'Publications',
  'grants': 'Grants',
  'prism-lab': 'PRISM Lab',
  'students': 'Students',
  'contact': 'Contact',
};

function pathToBreadcrumbs(pathname, labName = 'PRISM Lab') {
  const segments = pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
  const crumbs = [{ path: '/', label: 'Home' }];

  if (pathname === '/') return crumbs;

  // Always show lab (name from admin) between Home and other content
  crumbs.push({ path: '/prism-lab', label: labName });

  let acc = '';
  for (const seg of segments) {
    if (seg === 'prism-lab') continue; // already added
    acc += (acc ? '/' : '') + seg;
    const label = LABELS[acc] || seg.replace(/-/g, ' ');
    crumbs.push({ path: '/' + acc, label });
  }
  return crumbs;
}

export default function Breadcrumb() {
  const location = useLocation();
  const { data: prismData } = usePrismLabController();
  const labName = prismData?.title ?? 'PRISM Lab';
  const crumbs = pathToBreadcrumbs(location.pathname, labName);

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={c.path}>
          {i === 0 ? (
            <Link to={c.path}>Home</Link>
          ) : i === crumbs.length - 1 ? (
            c.label
          ) : (
            <Link to={c.path}>{c.label}</Link>
          )}
          {i < crumbs.length - 1 && <span className="breadcrumb-sep"> / </span>}
        </span>
      ))}
    </nav>
  );
}
