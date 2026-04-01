/**
 * Contact View - PRISM Lab header, members grid, map section, lab details
 */
import { useContactController } from '../../controllers/useContactController.js';
import LinkifiedText from '../components/LinkifiedText.jsx';
import './Page.css';
import './Contact.css';

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Extract src URL from an <iframe> HTML string, or return as-is if already a URL */
function extractMapSrc(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (trimmed.startsWith('<')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    return match ? match[1] : '';
  }
  return trimmed;
}

/** Format a phone number for display (US-style) */
function formatPhone(phone) {
  const digits = phone.replace(/[^+\d]/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `1-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

function MemberCard({ person }) {
  return (
    <div className="contact-member-card">
      <div className="contact-member-photo-wrap">
        {person.imageUrl ? (
          <img src={person.imageUrl} alt={person.name} className="contact-member-photo" />
        ) : (
          <div className="contact-member-placeholder" aria-hidden>{getInitials(person.name)}</div>
        )}
      </div>
      <h3 className="contact-member-name"><LinkifiedText text={person.name} keyPrefix={`member-name-${person.id}`} /></h3>
      {person.title && <p className="contact-member-title"><LinkifiedText text={person.title} keyPrefix={`member-title-${person.id}`} /></p>}
      <div className="contact-member-links">
        {person.email && (
          <a href={`mailto:${person.email}`}>📧 {person.email}</a>
        )}
        {person.phone && (
          <a href={`tel:${person.phone.replace(/[^+\d]/g, '')}`}>📞 {formatPhone(person.phone)}</a>
        )}
      </div>
    </div>
  );
}

export default function ContactView() {
  const { data, loading, error } = useContactController();

  if (loading) return <div className="page-with-banner"><div className="page-content-area"><p>Loading…</p></div></div>;
  if (error) return <div className="page-with-banner"><div className="page-content-area"><p>Error: {error}</p></div></div>;

  const header = data?.header ?? {};
  const members = data?.members ?? {};
  const map = data?.map ?? {};
  const labDetails = data?.labDetails ?? {};

  const addressLines = map.addressLines ?? [];
  const mapLinks = map.mapLinks ?? [];
  const people = (members.people ?? []).filter((p) => p.visible !== false);
  const mapSrc = extractMapSrc(map.mapEmbedSrc);

  return (
    <div className="page-with-banner">
      <div className="page-banner-wrap" />
      <div className="page-content-area contact-page-content">

        {/* Section 1: Header with logo + title */}
        {header.visible !== false && (
          <div className="contact-header">
            {header.logoUrl && (
              <img src={header.logoUrl} alt="PRISM Lab" className="contact-header-logo" />
            )}
            <h1 className="contact-header-title"><LinkifiedText text={header.title || 'PRISM Lab'} keyPrefix="contact-header-title" /></h1>
            {header.subtitle && <p className="contact-header-subtitle"><LinkifiedText text={header.subtitle} keyPrefix="contact-header-subtitle" /></p>}
          </div>
        )}

        {/* Section 2: Members grid */}
        {members.visible !== false && people.length > 0 && (
          <div className="contact-members-section">
            <h2 className="contact-section-title"><LinkifiedText text={members.label || 'Lab Members'} keyPrefix="contact-members-label" /></h2>
            <div className="contact-members-grid">
              {people.map((person) => (
                <MemberCard key={person.id} person={person} />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Map + location details */}
        {map.visible !== false && (
          <div className="contact-map-section">
            <h2 className="contact-section-title">Location</h2>
            <div className="contact-map-row">
              <div className="contact-map-wrap">
                {mapSrc ? (
                  <iframe
                    title="Location map"
                    src={mapSrc}
                    className="contact-map-iframe"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="contact-map-fallback">
                    <a href={map.addressUrl || '#'} target="_blank" rel="noopener noreferrer">
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>
              {(addressLines.length > 0 || mapLinks.length > 0) && (
                <div className="contact-map-details">
                  {addressLines.length > 0 && (
                    <div className="contact-map-address">
                      <strong>Address:</strong><br />
                      {map.addressUrl ? (
                        <a href={map.addressUrl} target="_blank" rel="noopener noreferrer">
                          {addressLines.map((line, i) => (
                            <span key={i}><LinkifiedText text={line} keyPrefix={`contact-address-link-${i}`} />{i < addressLines.length - 1 ? <br /> : null}</span>
                          ))}
                        </a>
                      ) : (
                        addressLines.map((line, i) => (
                          <span key={i}><LinkifiedText text={line} keyPrefix={`contact-address-${i}`} />{i < addressLines.length - 1 ? <br /> : null}</span>
                        ))
                      )}
                    </div>
                  )}
                  {mapLinks.length > 0 && (
                    <>
                      <strong style={{ fontSize: '0.9rem', color: '#555' }}>Map / Directions:</strong>
                      <ul className="contact-map-links-list">
                        {mapLinks.map((link, i) => (
                          <li key={i}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 4: Lab details */}
        {labDetails.visible !== false && (
          <div>
            <h2 className="contact-section-title">Lab Details</h2>
            <div className="contact-lab-details">
              {labDetails.room && (
                <div className="contact-lab-detail-item">
                  <span className="contact-lab-detail-label">Room</span>
                  <span className="contact-lab-detail-value"><LinkifiedText text={labDetails.room} keyPrefix="lab-room" /></span>
                </div>
              )}
              {labDetails.department && (
                <div className="contact-lab-detail-item">
                  <span className="contact-lab-detail-label">Department</span>
                  <span className="contact-lab-detail-value"><LinkifiedText text={labDetails.department} keyPrefix="lab-dept" /></span>
                </div>
              )}
              {labDetails.email && (
                <div className="contact-lab-detail-item">
                  <span className="contact-lab-detail-label">Email</span>
                  <span className="contact-lab-detail-value">
                    <a href={`mailto:${labDetails.email}`}>{labDetails.email}</a>
                  </span>
                </div>
              )}
              {labDetails.phone && (
                <div className="contact-lab-detail-item">
                  <span className="contact-lab-detail-label">Phone</span>
                  <span className="contact-lab-detail-value">
                    <a href={`tel:${labDetails.phone.replace(/[^+\d]/g, '')}`}>{formatPhone(labDetails.phone)}</a>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
