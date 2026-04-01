/**
 * Home View - Quick links below full-width hero (hero rendered in MainLayout)
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHomeController } from '../../controllers/useHomeController.js';
import { useSiteController } from '../../controllers/useSiteController.js';
import { DEFAULT_HOME_BODY } from '../../content/defaultHomeBody.js';
import LinkifiedText from '../components/LinkifiedText.jsx';
import './Page.css';
import './HomeView.css';
import './PrismLab.css';

export default function HomeView() {
  const { data: homeData, loading, error } = useHomeController();
  const { navbar } = useSiteController();
  const ctaLinks = navbar.filter((item) => item.path !== '/');
  const [activeResearchArea, setActiveResearchArea] = useState(null);

  function normalizeBody(raw) {
    const obj = raw && typeof raw === 'object' ? raw : {};

    const bio = obj.biography && typeof obj.biography === 'object' ? obj.biography : {};
    const edu = obj.education && typeof obj.education === 'object' ? obj.education : {};
    const res = obj.research && typeof obj.research === 'object' ? obj.research : {};

    const normalized = {
      biography: {
        ...DEFAULT_HOME_BODY.biography,
        ...bio,
        visible: bio?.visible !== false,
        paragraphs: Array.isArray(bio.paragraphs) ? bio.paragraphs : DEFAULT_HOME_BODY.biography.paragraphs,
      },
      education: {
        ...DEFAULT_HOME_BODY.education,
        ...edu,
        visible: edu?.visible !== false,
        items: Array.isArray(edu.items)
          ? edu.items.map((item) => ({
              ...(item || {}),
              visible: item?.visible !== false,
              showYears: item?.showYears !== false,
              showArea: item?.showArea !== false,
              showDissertationTitle: item?.showDissertationTitle !== false,
            }))
          : DEFAULT_HOME_BODY.education.items.map((item) => ({ ...item, visible: true, showYears: true, showArea: true, showDissertationTitle: true })),
      },
      research: {
        ...DEFAULT_HOME_BODY.research,
        ...res,
        visible: res?.visible !== false,
        sections: Array.isArray(res.sections)
          ? res.sections.map((section) => ({
              ...(section || {}),
              visible: section?.visible !== false,
              imageUrl: typeof section?.imageUrl === 'string' ? section.imageUrl : '',
              summary: typeof section?.summary === 'string' ? section.summary : '',
              details: typeof section?.details === 'string' ? section.details : '',
              paragraphs: Array.isArray(section?.paragraphs) ? section.paragraphs : [],
            }))
          : DEFAULT_HOME_BODY.research.sections.map((section) => ({ ...section, visible: true })),
      },
    };

    // If admin accidentally saved the placeholder template, show the real default content instead.
    const looksLikeTemplate =
      normalized?.biography?.paragraphs?.some?.((p) => typeof p === 'string' && p.toLowerCase().includes('paragraph 1')) ||
      normalized?.education?.items?.some?.((it) => typeof it?.degree === 'string' && it.degree.includes('...')) ||
      (typeof normalized?.research?.intro === 'string' && normalized.research.intro.toLowerCase().includes('intro paragraph'));
    return looksLikeTemplate ? DEFAULT_HOME_BODY : normalized;
  }

  const body = normalizeBody(homeData?.body);
  const visibleResearchSections = useMemo(() => {
    if (!Array.isArray(body?.research?.sections)) return [];
    return body.research.sections.filter((sec) => sec?.visible !== false);
  }, [body]);

  function summarizeParagraph(text, maxLength = 120) {
    const value = typeof text === 'string' ? text.trim() : '';
    if (!value) return '';
    if (value.length <= maxLength) return value;
    return `${value.slice(0, maxLength).trimEnd()}…`;
  }

  useEffect(() => {
    if (!activeResearchArea) return;
    function onEsc(e) {
      if (e.key === 'Escape') setActiveResearchArea(null);
    }
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [activeResearchArea]);

  if (loading) {
    return (
      <div className="page-content-area home-page-content">
        <p>Loading…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="page-content-area home-page-content">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="page-content-area home-page-content">
      <div className="home-body" id="top">
        <section className="home-section" aria-labelledby="bio-title">
          {body?.biography?.visible !== false && (
            <>
              <h2 id="bio-title" className="home-section-title">{body?.biography?.heading ?? 'Biography'}</h2>
              {body?.biography?.kicker ? <p className="home-section-kicker">{body.biography.kicker}</p> : null}
              <div className="home-prose">
                {Array.isArray(body?.biography?.paragraphs) && body.biography.paragraphs.map((p, i) => (
                  <p key={i}><LinkifiedText text={p} keyPrefix={`bio-${i}`} /></p>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="home-section" aria-labelledby="edu-title">
          {body?.education?.visible !== false && (
            <>
              <h2 id="edu-title" className="home-section-title">{body?.education?.heading ?? 'Education'}</h2>

              <div className="home-edu">
                {Array.isArray(body?.education?.items) && body.education.items
                  .filter((item) => item?.visible !== false)
                  .map((item, i) => (
                    <div key={i} className="home-edu-item">
                      <h3 className="home-edu-degree"><LinkifiedText text={item?.degree} keyPrefix={`edu-degree-${i}`} /></h3>
                      {item?.years && item?.showYears !== false ? <p className="home-edu-meta"><LinkifiedText text={item.years} keyPrefix={`edu-years-${i}`} /></p> : null}
                      {item?.institution ? <p className="home-edu-meta"><LinkifiedText text={item.institution} keyPrefix={`edu-institution-${i}`} /></p> : null}
                      {item?.area && item?.showArea !== false ? <p className="home-edu-detail"><em>Area:</em> <LinkifiedText text={item.area} keyPrefix={`edu-area-${i}`} /></p> : null}
                      {item?.dissertationTitle && item?.showDissertationTitle !== false ? <p className="home-edu-detail"><em>Dissertation Title:</em> <LinkifiedText text={item.dissertationTitle} keyPrefix={`edu-dissertation-${i}`} /></p> : null}
                    </div>
                  ))}
              </div>
            </>
          )}
        </section>

        <section className="home-section" aria-labelledby="research-title">
          {body?.research?.visible !== false && (
            <>
              <h2 id="research-title" className="home-section-title">{body?.research?.heading ?? 'Current Research Areas'}</h2>
              <div className="home-prose">
                {body?.research?.intro ? <p><LinkifiedText text={body.research.intro} keyPrefix="research-intro" /></p> : null}
                {(body?.research?.scholarUrl || body?.research?.orcidUrl) ? (
                  <p>
                    {body?.research?.scholarUrl ? <a href={body.research.scholarUrl} target="_blank" rel="noopener noreferrer">Google Scholar</a> : null}
                    {body?.research?.scholarUrl && body?.research?.orcidUrl ? ' • ' : null}
                    {body?.research?.orcidUrl ? <a href={body.research.orcidUrl} target="_blank" rel="noopener noreferrer">ORCID</a> : null}
                  </p>
                ) : null}
              </div>

              {visibleResearchSections.length > 0 && (
                <div className="home-research-cards-wrap">
                  <div className="prism-research-grid">
                    {visibleResearchSections.map((sec, idx) => {
                      const paragraphs = Array.isArray(sec?.paragraphs)
                        ? sec.paragraphs.filter((p) => typeof p === 'string' && p.trim())
                        : [];
                      const title = sec?.title || `Research Area ${idx + 1}`;
                      const summary = summarizeParagraph(sec?.summary || paragraphs[0] || sec?.details || '');
                      const details = sec?.details || paragraphs.join(' ') || summary;
                      return (
                        <button
                          key={`${title}-${idx}`}
                          type="button"
                          className="prism-research-card"
                          onClick={() => setActiveResearchArea({ title, summary, details })}
                        >
                          <div className="prism-research-card-content">
                            <h3><LinkifiedText text={title} keyPrefix={`home-research-title-${idx}`} /></h3>
                            <p><LinkifiedText text={summary} keyPrefix={`home-research-summary-${idx}`} /></p>
                            <span className="prism-research-readmore">Click to view details</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
        {/* ── Page closing strip ── */}
        <div className="home-cta-strip">
          <p className="home-cta-tagline">Explore the lab</p>
          <nav className="home-cta-links" aria-label="Quick navigation">
            {ctaLinks.map((item) => (
              <Link key={item.id} to={item.path} className="home-cta-btn">{item.label}</Link>
            ))}
          </nav>
        </div>
      </div>

      {activeResearchArea && (
        <div className="prism-modal-backdrop" onClick={() => setActiveResearchArea(null)} role="presentation">
          <div
            className="prism-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeResearchArea.title} details`}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="prism-modal-close" onClick={() => setActiveResearchArea(null)} aria-label="Close details">×</button>
            <h3><LinkifiedText text={activeResearchArea.title} keyPrefix="home-research-modal-title" /></h3>
            {activeResearchArea.summary ? <p className="prism-modal-summary"><LinkifiedText text={activeResearchArea.summary} keyPrefix="home-research-modal-summary" /></p> : null}
            <p className="prism-modal-details"><LinkifiedText text={activeResearchArea.details || activeResearchArea.summary || ''} keyPrefix="home-research-modal-details" /></p>
          </div>
        </div>
      )}

    </div>
  );
}
