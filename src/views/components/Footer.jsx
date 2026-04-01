/**
 * Footer - UNT eagle logo, lab name from admin, contact, UNT
 */
import { useState, useEffect } from 'react';
import { usePrismLabController } from '../../controllers/usePrismLabController.js';
import './Footer.css';

/** UNT eagle logo in footer left */
const EAGLE_LOGO_URL = '/eagle-logo.png';
/** Lab logo above PRISM Lab text */
const LAB_LOGO_URL = '/prism-lab-logo.png';

const LinkedInSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const TwitterSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const GitHubSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
const ScholarSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden>
    <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
  </svg>
);

const ICON_MAP = {
  linkedin: LinkedInSvg,
  twitter: TwitterSvg,
  github: GitHubSvg,
  scholar: ScholarSvg,
};

const DEFAULT_SOCIAL_LINKS = [
  { id: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn', icon: 'linkedin', order: 1 },
  { id: 'twitter', url: 'https://twitter.com', label: 'X (Twitter)', icon: 'twitter', order: 2 },
  { id: 'github', url: 'https://github.com', label: 'GitHub', icon: 'github', order: 3 },
  { id: 'scholar', url: 'https://scholar.google.com', label: 'Google Scholar', icon: 'scholar', order: 4 },
];

export default function Footer() {
  const { data: prismData } = usePrismLabController();
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);
  const [loadingLinks, setLoadingLinks] = useState(true);

  const labName = prismData?.title ?? 'PRISM Lab';
  const labTagline = prismData?.description ?? 'Privacy Aware & Intelligent System Modeling Lab';

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        setLoadingLinks(true);
        const res = await fetch('/api/social');
        if (res.ok) {
          const data = await res.json();
          if (data.data && Array.isArray(data.data)) {
            setSocialLinks(data.data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
          }
        }
      } catch (err) {
        console.warn('Failed to load social links, using defaults:', err);
        setSocialLinks(DEFAULT_SOCIAL_LINKS);
      } finally {
        setLoadingLinks(false);
      }
    }

    fetchSocialLinks();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-eagle-column">
          <div className="footer-social-section">
            <p className="footer-follow">Follow Us</p>
            <div className="footer-socials">
              {!loadingLinks && socialLinks.map(({ id, url, label, icon }) => {
                const Icon = ICON_MAP[icon] || ICON_MAP.scholar;
                return (
                  <a key={id} href={url} target="_blank" rel="noopener noreferrer" className="footer-social" aria-label={label}>
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
          <a href="https://unt.edu" target="_blank" rel="noopener noreferrer" aria-label="University of North Texas">
            <img src={EAGLE_LOGO_URL} alt="" className="footer-eagle-logo" />
          </a>
        </div>
        <div className="footer-inner">
          <div className="footer-left">
            <a href="/" className="footer-lab-logo-wrap" aria-label={`${labName} Home`}>
              <img src={LAB_LOGO_URL} alt="" className="footer-lab-logo" />
            </a>
            <span className="footer-name">{labTagline}</span>
            <p className="footer-contact">
              Directed by Dr. Pretom Roy Ovi<br />
              <a href="mailto:Pretomroy.Ovi@unt.edu">Pretomroy.Ovi@unt.edu</a>
            </p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span className="footer-unt">University of North Texas</span>
          <span className="footer-copy">© {labName}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
