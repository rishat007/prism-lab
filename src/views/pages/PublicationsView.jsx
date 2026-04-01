/**
 * Publications View - Sectioned layout with rich-text entries (HTML).
 * Supports per-section visibility, optional year-based subsections,
 * numbered lists, and green hyperlinks matching reference design.
 */
import { usePublicationController } from '../../controllers/usePublicationController.js';
import { linkifyHtmlContent } from '../../utils/linkify.js';
import LinkifiedText from '../components/LinkifiedText.jsx';
import './Page.css';
import './Publications.css';

/* ── Helpers ── */

/** Group entries by `year` field, sorted descending. Entries without year go to "Other". */
function groupEntriesByYear(entries) {
  const map = {};
  (entries ?? []).forEach((e) => {
    const y = String(e.year ?? '').trim() || 'Other';
    if (!map[y]) map[y] = [];
    map[y].push(e);
  });
  return Object.entries(map).sort((a, b) => {
    if (a[0] === 'Other') return 1;
    if (b[0] === 'Other') return -1;
    return Number(b[0]) - Number(a[0]);
  });
}

/** Render a single entry — its `text` field may contain safe HTML (bold, italic, links). */
function EntryItem({ entry }) {
  const html = linkifyHtmlContent(entry.text || '');
  return (
    <li
      className="pub-entry"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ── Main view ── */

export default function PublicationsView() {
  const { data, loading, error } = usePublicationController();

  if (loading) return <div className="page-with-banner"><div className="page-content-area"><p>Loading…</p></div></div>;
  if (error) return <div className="page-with-banner"><div className="page-content-area"><p>Error: {error}</p></div></div>;

  const sections = (data?.sections ?? []).filter((s) => s.visible !== false);

  return (
    <div className="page-with-banner publications-page">
      <div className="page-banner-wrap">
        <div className="page-banner">
          <h1>Publications</h1>
        </div>
      </div>

      <div className="page-content-area publications-content">
        {sections.length === 0 && (
          <p className="lead">No publications yet. Add content via the admin dashboard.</p>
        )}

        {sections.map((section) => {
          const visibleEntries = (section.entries ?? []).filter((e) => e.visible !== false);
          const useYearGroups = section.groupByYear === true;

          return (
            <section key={section.id} className="pub-section">
              <h2 className="pub-section-title">
                <LinkifiedText text={section.label} keyPrefix={`pub-section-label-${section.id}`} />
                {section.summary && (
                  <span className="pub-section-summary"> <LinkifiedText text={section.summary} keyPrefix={`pub-section-summary-${section.id}`} /></span>
                )}
              </h2>

              {useYearGroups ? (
                groupEntriesByYear(visibleEntries).map(([year, yearEntries], gi) => (
                  <div key={year} className="pub-year-group">
                    <h3 className="pub-year-heading">{year}</h3>
                    <ol className="pub-list" start={1}>
                      {yearEntries.map((entry) => (
                        <EntryItem key={entry.id} entry={entry} />
                      ))}
                    </ol>
                  </div>
                ))
              ) : (
                <ol className="pub-list">
                  {visibleEntries.map((entry) => (
                    <EntryItem key={entry.id} entry={entry} />
                  ))}
                </ol>
              )}

              {visibleEntries.length === 0 && (
                <p className="pub-empty">No entries in this section yet.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
