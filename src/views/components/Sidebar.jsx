/**
 * Sidebar - Nav links with dropdowns for items with children
 * Nav items come from /api/site (admin-controlled).
 */
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useContactController } from '../../controllers/useContactController.js';
import { usePrismLabController } from '../../controllers/usePrismLabController.js';
import { useSiteController } from '../../controllers/useSiteController.js';
import './Sidebar.css';

function SidebarItem({ item }) {
  const { pathname } = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const pathMatches = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
  const [open, setOpen] = useState(pathMatches);

  useEffect(() => {
    if (pathMatches) setOpen(true);
  }, [pathMatches]);

  if (hasChildren) {
    const subId = `sidebar-sub-${item.id}`;
    return (
      <li className="sidebar-item sidebar-item--dropdown">
        <div className={'sidebar-dropdown-trigger' + (open ? ' open' : '')}>
          <NavLink to={item.path} className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
            {item.label}
          </NavLink>
          <button
            type="button"
            className="sidebar-dropdown-toggle"
            onClick={(e) => { e.preventDefault(); setOpen(!open); }}
            aria-expanded={open}
            aria-controls={subId}
            aria-label={open ? `Collapse ${item.label}` : `Expand ${item.label}`}
          >
            <span className="sidebar-chevron" aria-hidden>▼</span>
          </button>
        </div>
        <ul id={subId} className={'sidebar-sublist' + (open ? ' open' : '')}>
          {item.children.map((child) => (
            <li key={child.id} className="sidebar-item sidebar-item--sub">
              <NavLink
                to={child.path}
                className={({ isActive }) => 'sidebar-link sidebar-link--sub' + (isActive ? ' active' : '')}
                end={child.path === item.path}
              >
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="sidebar-item">
      <NavLink
        to={item.path}
        className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
        end={item.path === '/'}
      >
        {item.label}
      </NavLink>
    </li>
  );
}

export default function Sidebar() {
  const { data: contactData } = useContactController();
  const { data: prismData } = usePrismLabController();
  const { sidebar } = useSiteController();

  const labName = prismData?.title ?? 'PRISM Lab';
  const imageUrl = contactData?.sidebarImageUrl ?? contactData?.imageUrl ?? '';

  // Static profile information - not connected to any admin content
  const PROFILE_INFO = {
    name: 'Dr. Pretom Roy Ovi',
    title: 'Assistant Professor',
    department: 'Department of Data Science',
    university: 'University Of North Texas',
    pronouns: 'Pronouns: he/him',
    researchAreas: [
      'Federated Learning',
      'Security and Privacy',
      'Distributed Learning',
      'Large Language Modeling'
    ]
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-header">{labName}</h2>
      <nav className="sidebar-nav">
        <ul className="sidebar-list">
          {Array.isArray(sidebar) && sidebar.map((item) => (
            <SidebarItem key={item.id} item={item} />
          ))}
        </ul>
      </nav>
      <div className="sidebar-profile">
        {imageUrl ? (
          <img src={imageUrl} alt={PROFILE_INFO.name} className="sidebar-profile-image" />
        ) : (
          <div className="sidebar-profile-image sidebar-profile-image--placeholder" aria-hidden />
        )}
        <p className="sidebar-profile-text sidebar-profile-name">{PROFILE_INFO.name}</p>
        <p className="sidebar-profile-text sidebar-profile-title">{PROFILE_INFO.title}</p>
        <p className="sidebar-profile-text sidebar-profile-department">{PROFILE_INFO.department}</p>
        <p className="sidebar-profile-text sidebar-profile-university">{PROFILE_INFO.university}</p>
        <p className="sidebar-profile-text sidebar-profile-pronouns">{PROFILE_INFO.pronouns}</p>
        <div className="sidebar-profile-research">
          {PROFILE_INFO.researchAreas.map((area, i) => (
            <span key={i} className="sidebar-profile-research-area">{area}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}
