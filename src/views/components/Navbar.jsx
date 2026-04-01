/**
 * Navbar - UNT logo, PRISM Lab brand, nav links (two-row layout)
 * Research has a dropdown with subsections.
 * Brand text: "Dr. Pretom Roy Ovi" on Home, "PRISM Lab" on other pages.
 * Nav items come from /api/site (admin-controlled).
 */
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useHomeController } from '../../controllers/useHomeController.js';
import { usePrismLabController } from '../../controllers/usePrismLabController.js';
import { useContactController } from '../../controllers/useContactController.js';
import { useSiteController } from '../../controllers/useSiteController.js';
import './Navbar.css';

const LOGO_URL = '/unt-lettermark-eagle-logo.svg';

function NavItem({ item }) {
  const hasChildren = item.children && item.children.length > 0;
  const [open, setOpen] = useState(false);

  if (hasChildren) {
    return (
      <div
        className="nav-item nav-item-dropdown"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <NavLink to={item.path} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          {item.label}
          <span className="nav-chevron" aria-hidden>▼</span>
        </NavLink>
        <ul className={`dropdown ${open ? 'open' : ''}`}>
          {item.children.map((child) => (
            <li key={child.id}>
              <NavLink
                to={child.path}
                className={({ isActive }) => 'dropdown-link' + (isActive ? ' active' : '')}
                end={child.path === item.path}
              >
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
      end={item.path === '/'}
    >
      {item.label}
    </NavLink>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { data: homeData } = useHomeController();
  const { data: prismData } = usePrismLabController();
  const { data: contactData } = useContactController();
  const { navbar } = useSiteController();
  const isHome = pathname === '/' || pathname === '' || pathname === '/index.html';
  // Home page: professor name from Home content; other pages: lab name from PRISM Lab content
  const brandText = isHome
    ? (homeData?.title ?? contactData?.name ?? contactData?.lab ?? 'Mention place please')
    : (prismData?.title ?? 'PRISM Lab');

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-logo-wrap" aria-label="UNT Home">
          <img src={LOGO_URL} alt="UNT" className="navbar-logo" />
        </a>
        <div className="navbar-title-wrap">
          <span className="navbar-vline" aria-hidden />
          <span className="navbar-brand">{brandText}</span>
        </div>
        <nav className="nav">
          {Array.isArray(navbar) && navbar.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>
      </div>
      <div className="navbar-line" aria-hidden />
    </header>
  );
}
