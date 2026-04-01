/**
 * Admin Dashboard - Organized layout with sidebar navigation
 */
import { useState, useEffect, useRef } from 'react';
import {
  setToken,
  logoutAdmin,
  getAdminContent,
  putAdminContent,
  uploadHero,
  uploadContactPhoto,
  uploadContactMemberPhoto,
  uploadSidebarPhoto,
  uploadHomeHeroPhoto,
  uploadStudentPhoto,
  deleteHeroSlide,
  reorderHeroSlides,
  getAdminNav,
  postNavItem,
  putNavItem,
  deleteNavItem,
} from '../../../models/adminApi.js';
import { heroModel } from '../../../models/api.js';
import { DEFAULT_HOME_BODY } from '../../../content/defaultHomeBody.js';
import AdminSocialLinks from './AdminSocialLinks.jsx';
import './Admin.css';

const SECTIONS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'resume', label: 'Resume', icon: '📄' },
  { id: 'research', label: 'Research', icon: '🔬' },
  { id: 'teaching', label: 'Teaching', icon: '📚' },
  { id: 'publications', label: 'Publications', icon: '📑' },
  { id: 'grants', label: 'Grants', icon: '💰' },
  { id: 'prism', label: 'PRISM Lab', icon: '🏛️' },
  { id: 'students', label: 'Students', icon: '👥' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
];

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'content', label: 'Content', icon: '📝' },
  { id: 'navigation', label: 'Navigation', icon: '🧭' },
  { id: 'social', label: 'Social Links', icon: '🔗' },
  { id: 'media', label: 'Media', icon: '🖼️' },
];

export default function AdminDashboard() {
  const [menu, setMenu] = useState('dashboard');
  const [content, setContent] = useState({});
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadCaption, setUploadCaption] = useState('');
  const [contactPhotoUploading, setContactPhotoUploading] = useState(false);
  const [sidebarPhotoUploading, setSidebarPhotoUploading] = useState(false);
  const [homeHeroPhotoUploading, setHomeHeroPhotoUploading] = useState(false);
  const [selectedSection, setSelectedSection] = useState('home');
  const [notice, setNotice] = useState(null);
  const noticeTimerRef = useRef(null);

  function showNotice(message, type = 'success', durationMs = 2600) {
    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }
    setNotice({ message, type });
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice(null);
      noticeTimerRef.current = null;
    }, durationMs);
  }

  function reportError(message) {
    const normalized = typeof message === 'string' ? message.trim() : String(message || '').trim();
    if (!normalized) {
      setError('');
      return;
    }
    const text = normalized;
    setError(text);
    showNotice(text, 'error', 3200);
  }

  function logout() {
    logoutAdmin()
      .catch(() => null)
      .finally(() => {
        setToken(null);
        window.location.reload();
      });
  }

  const [contentVersion, setContentVersion] = useState(0);

  function loadContent() {
    setLoading(true);
    setError('');
    getAdminContent()
      .then((data) => { setContent(data); setContentVersion((v) => v + 1); })
      .catch((err) => reportError(err.message))
      .finally(() => setLoading(false));
  }

  function loadHero() {
    heroModel.getData().then((data) => setSlides(data?.slides ?? []));
  }

  useEffect(() => {
    loadContent();
    loadHero();
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    };
  }, []);

  function handleSaveSection(section, data) {
    setSaving(true);
    setError('');
    putAdminContent(section, data)
      .then(() => {
        setContent((prev) => ({ ...prev, [section]: data }));
        showNotice(`${SECTIONS.find((s) => s.id === section)?.label || section} saved successfully.`, 'success');
      })
      .catch((err) => reportError(err.message))
      .finally(() => setSaving(false));
  }

  function handleUploadHero(e) {
    e.preventDefault();
    const file = e.target.image?.files?.[0];
    if (!file) { reportError('Select an image.'); return; }
    setError('');
    uploadHero(file, uploadCaption)
      .then(() => {
        setUploadCaption('');
        e.target.reset();
        loadHero();
        showNotice('Hero slide uploaded successfully.', 'success');
      })
        .catch((err) => reportError(err.message));
  }

  function handleDeleteSlide(id) {
    if (!confirm('Delete this slide?')) return;
    deleteHeroSlide(id)
      .then(() => {
        loadHero();
        showNotice('Hero slide deleted successfully.', 'success');
      })
      .catch((err) => reportError(err.message));
  }

  function handleContactPhotoUpload(e) {
    e.preventDefault();
    const file = e.target.photo?.files?.[0];
    if (!file) { reportError('Select an image.'); return; }
    setError('');
    setContactPhotoUploading(true);
    uploadContactPhoto(file)
      .then(() => {
        e.target.reset();
        loadContent();
        showNotice('Contact photo uploaded successfully.', 'success');
      })
        .catch((err) => reportError(err.message))
      .finally(() => setContactPhotoUploading(false));
  }

  function handleSidebarPhotoUpload(e) {
    e.preventDefault();
    const file = e.target.photo?.files?.[0];
    if (!file) { reportError('Select an image.'); return; }
    setError('');
    setSidebarPhotoUploading(true);
    uploadSidebarPhoto(file)
      .then(() => {
        e.target.reset();
        loadContent();
        showNotice('Sidebar photo uploaded successfully.', 'success');
      })
        .catch((err) => reportError(err.message))
      .finally(() => setSidebarPhotoUploading(false));
  }

  function handleHomeHeroPhotoUpload(e) {
    e.preventDefault();
    const file = e.target.photo?.files?.[0];
    if (!file) { reportError('Select an image.'); return; }
    setError('');
    setHomeHeroPhotoUploading(true);
    uploadHomeHeroPhoto(file)
      .then(() => {
        e.target.reset();
        loadContent();
        showNotice('Home hero photo uploaded successfully.', 'success');
      })
        .catch((err) => reportError(err.message))
      .finally(() => setHomeHeroPhotoUploading(false));
  }

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin</h2>
          <a href="/" className="admin-sidebar-view">View site</a>
        </div>
        <nav className="admin-sidebar-nav">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-sidebar-item ${menu === item.id ? 'active' : ''}`}
              onClick={() => setMenu(item.id)}
            >
              <span className="admin-sidebar-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button type="button" className="admin-logout-btn" onClick={logout}>Logout</button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-toast-stack" aria-live="polite" aria-atomic="true">
          {notice && <div className={`admin-toast admin-toast-${notice.type}`}>{notice.message}</div>}
        </div>
        <header className="admin-main-header">
          <h1>{MENU_ITEMS.find((m) => m.id === menu)?.label ?? 'Admin'}</h1>
        </header>
        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        {menu === 'dashboard' && (
          <DashboardOverview
            content={content}
            slides={slides}
            onSelectSection={(id) => { setMenu('content'); setSelectedSection(id); }}
            onOpenMedia={() => setMenu('media')}
            onOpenNavigation={() => setMenu('navigation')}
          />
        )}

        {menu === 'content' && (
          <ContentSection
            content={content}
            contentVersion={contentVersion}
            loading={loading}
            saving={saving}
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
            onSave={handleSaveSection}
            onNotify={showNotice}
            onHomeHeroUpload={handleHomeHeroPhotoUpload}
            onContactPhotoUpload={handleContactPhotoUpload}
            homeHeroUploading={homeHeroPhotoUploading}
            contactPhotoUploading={contactPhotoUploading}
          />
        )}

        {menu === 'navigation' && (
          <NavigationSection onError={reportError} onNotify={showNotice} />
        )}

        {menu === 'social' && (
          <AdminSocialLinks onNotify={showNotice} />
        )}

        {menu === 'media' && (
          <MediaSection
            slides={slides}
            content={content}
            contentVersion={contentVersion}
            uploadCaption={uploadCaption}
            onUploadCaption={setUploadCaption}
            onUploadHero={handleUploadHero}
            onDeleteSlide={handleDeleteSlide}
            onHomeHeroUpload={handleHomeHeroPhotoUpload}
            onContactPhotoUpload={handleContactPhotoUpload}
            onSidebarPhotoUpload={handleSidebarPhotoUpload}
            homeHeroUploading={homeHeroPhotoUploading}
            contactPhotoUploading={contactPhotoUploading}
            sidebarPhotoUploading={sidebarPhotoUploading}
          />
        )}
      </main>
    </div>
  );
}

function DashboardOverview({ content, slides, onSelectSection, onOpenMedia, onOpenNavigation }) {
  const sectionCount = Object.keys(content).filter((k) => content[k] && Object.keys(content[k] || {}).length > 0).length;
  return (
    <div className="admin-dashboard-overview">
      <div className="admin-cards">
        <div className="admin-card">
          <span className="admin-card-icon">📝</span>
          <h3>Content Sections</h3>
          <p>{sectionCount} sections with content</p>
          <button type="button" className="admin-card-btn" onClick={() => onSelectSection('home')}>Edit Content</button>
        </div>
        <div className="admin-card">
          <span className="admin-card-icon">🖼️</span>
          <h3>Hero Slides</h3>
          <p>{slides.length} slide(s)</p>
          <button type="button" className="admin-card-btn" onClick={onOpenMedia}>Manage Media</button>
        </div>
        <div className="admin-card">
          <span className="admin-card-icon">🧭</span>
          <h3>Navigation</h3>
          <p>Manage navbar & sidebar links</p>
          <button type="button" className="admin-card-btn" onClick={onOpenNavigation}>Edit Navigation</button>
        </div>
        <div className="admin-card">
          <span className="admin-card-icon">⚡</span>
          <h3>Quick Actions</h3>
          <p>Edit key sections</p>
          <div className="admin-quick-links">
            {SECTIONS.slice(0, 4).map((s) => (
              <button key={s.id} type="button" className="admin-quick-link" onClick={() => onSelectSection(s.id)}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentSection({
  content,
  contentVersion,
  loading,
  saving,
  selectedSection,
  onSelectSection,
  onSave,
  onNotify,
  onHomeHeroUpload,
  onContactPhotoUpload,
  homeHeroUploading,
  contactPhotoUploading,
}) {
  return (
    <div className="admin-content-section">
      <div className="admin-content-sidebar">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`admin-content-tab ${selectedSection === s.id ? 'active' : ''}`}
            onClick={() => onSelectSection(s.id)}
          >
            <span>{s.icon}</span> {s.label}
          </button>
        ))}
      </div>
      <div className="admin-content-editor">
        {loading ? (
          <p>Loading…</p>
        ) : selectedSection ? (
          <ContentEditorBlock
            sectionId={selectedSection}
            sectionLabel={SECTIONS.find((s) => s.id === selectedSection)?.label}
            data={content[selectedSection]}
            onSave={(data) => onSave(selectedSection, data)}
            onNotify={onNotify}
            saving={saving}
            contentVersion={contentVersion}
            onHomeHeroUpload={selectedSection === 'home' ? onHomeHeroUpload : null}
            onContactPhotoUpload={selectedSection === 'contact' ? onContactPhotoUpload : null}
            homeHeroUploading={homeHeroUploading}
            contactPhotoUploading={contactPhotoUploading}
          />
        ) : (
          <p>Select a section to edit.</p>
        )}
      </div>
    </div>
  );
}

function ContentEditorBlock({
  sectionId,
  sectionLabel,
  data,
  onSave,
  onNotify,
  saving,
  contentVersion,
  onHomeHeroUpload,
  onContactPhotoUpload,
  homeHeroUploading,
  contactPhotoUploading,
}) {
  const isSimpleSection = ['resume', 'research', 'teaching', 'grants'].includes(sectionId);

  return (
    <div className="admin-editor-block">
      <h3>{sectionLabel}</h3>
      {sectionId === 'home' && onHomeHeroUpload && (
        <ImageUploadBlock
          label="Home hero image (full-width banner)"
          imageUrl={data?.imageUrl}
          onUpload={onHomeHeroUpload}
          uploading={homeHeroUploading}
          cacheBust={contentVersion}
        />
      )}
      {sectionId === 'contact' && onContactPhotoUpload && (
        null /* Contact photos now managed inside ContactFormEditor */
      )}
      {sectionId === 'home' ? (
        <HomeFormEditor data={data} onSave={onSave} saving={saving} onNotify={onNotify} />
      ) : sectionId === 'prism' ? (
        <PrismLabFormEditor data={data} onSave={onSave} saving={saving} onNotify={onNotify} />
      ) : sectionId === 'students' ? (
        <StudentFormEditor data={data} onSave={onSave} saving={saving} onNotify={onNotify} />
      ) : sectionId === 'publications' ? (
        <PublicationFormEditor data={data} onSave={onSave} saving={saving} onNotify={onNotify} />
      ) : sectionId === 'contact' ? (
        <ContactFormEditor data={data} onSave={onSave} saving={saving} onNotify={onNotify} />
      ) : isSimpleSection ? (
        <JsonEditor data={data} onSave={onSave} saving={saving} rows={8} onNotify={onNotify} />
      ) : (
        <JsonEditor data={data} onSave={onSave} saving={saving} rows={14} hint={SECTION_HINTS[sectionId]} onNotify={onNotify} />
      )}
    </div>
  );
}

function HomeFormEditor({ data, onSave, saving, onNotify }) {
  function normalizeHomeBody(raw) {
    const obj = raw && typeof raw === 'object' ? raw : {};
    const bio = obj.biography && typeof obj.biography === 'object' ? obj.biography : {};
    const edu = obj.education && typeof obj.education === 'object' ? obj.education : {};
    const research = obj.research && typeof obj.research === 'object' ? obj.research : {};

    return {
      biography: {
        ...DEFAULT_HOME_BODY.biography,
        ...bio,
        visible: bio?.visible !== false,
        paragraphs: Array.isArray(bio?.paragraphs) ? bio.paragraphs : DEFAULT_HOME_BODY.biography.paragraphs,
      },
      education: {
        ...DEFAULT_HOME_BODY.education,
        ...edu,
        visible: edu?.visible !== false,
        items: Array.isArray(edu?.items)
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
        ...research,
        visible: research?.visible !== false,
        sections: Array.isArray(research?.sections)
          ? research.sections.map((section) => {
              const paragraphs = Array.isArray(section?.paragraphs)
                ? section.paragraphs.filter((p) => typeof p === 'string' && p.trim())
                : [];
              const summary = typeof section?.summary === 'string' && section.summary.trim()
                ? section.summary
                : (paragraphs[0] || '');
              const details = typeof section?.details === 'string' && section.details.trim()
                ? section.details
                : paragraphs.join(' ');

              return {
                ...(section || {}),
                visible: section?.visible !== false,
                imageUrl: typeof section?.imageUrl === 'string' ? section.imageUrl : '',
                summary,
                details,
                paragraphs: paragraphs.length ? paragraphs : [''],
              };
            })
          : DEFAULT_HOME_BODY.research.sections.map((section) => ({ ...section, visible: true })),
      },
    };
  }

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    tagline: '',
    heroName: '',
    heroTitle: '',
    ...data,
  });
  const [body, setBody] = useState(normalizeHomeBody(data?.body));
  const [researchCardUploading, setResearchCardUploading] = useState(null);

  useEffect(() => { setForm((f) => ({ ...f, ...data })); }, [data]);
  useEffect(() => { setBody(normalizeHomeBody(data?.body)); }, [data]);

  function updateBioField(key, value) {
    setBody((b) => ({ ...b, biography: { ...b.biography, [key]: value } }));
  }
  function updateBioParagraph(idx, value) {
    setBody((b) => {
      const paragraphs = [...b.biography.paragraphs];
      paragraphs[idx] = value;
      return { ...b, biography: { ...b.biography, paragraphs } };
    });
  }
  function addBioParagraph() {
    setBody((b) => ({ ...b, biography: { ...b.biography, paragraphs: [...b.biography.paragraphs, ''] } }));
  }
  function removeBioParagraph(idx) {
    setBody((b) => ({ ...b, biography: { ...b.biography, paragraphs: b.biography.paragraphs.filter((_, i) => i !== idx) } }));
  }

  function updateEducationField(key, value) {
    setBody((b) => ({ ...b, education: { ...b.education, [key]: value } }));
  }
  function updateEducationItem(idx, key, value) {
    setBody((b) => {
      const items = [...b.education.items];
      items[idx] = { ...items[idx], [key]: value };
      return { ...b, education: { ...b.education, items } };
    });
  }
  function addEducationItem() {
    setBody((b) => ({
      ...b,
      education: {
        ...b.education,
        items: [
          ...b.education.items,
          {
            degree: '',
            years: '',
            institution: '',
            area: '',
            dissertationTitle: '',
            visible: true,
            showYears: true,
            showArea: true,
            showDissertationTitle: true,
          },
        ],
      },
    }));
  }
  function removeEducationItem(idx) {
    if (!confirm('Remove this education item?')) return;
    setBody((b) => ({ ...b, education: { ...b.education, items: b.education.items.filter((_, i) => i !== idx) } }));
  }
  function moveEducationItem(idx, dir) {
    setBody((b) => {
      const items = [...b.education.items];
      const target = idx + dir;
      if (target < 0 || target >= items.length) return b;
      [items[idx], items[target]] = [items[target], items[idx]];
      return { ...b, education: { ...b.education, items } };
    });
  }

  function updateResearchField(key, value) {
    setBody((b) => ({ ...b, research: { ...b.research, [key]: value } }));
  }
  function updateResearchSection(idx, key, value) {
    setBody((b) => {
      const sections = [...b.research.sections];
      sections[idx] = { ...sections[idx], [key]: value };
      return { ...b, research: { ...b.research, sections } };
    });
  }
  function addResearchSection() {
    setBody((b) => ({
      ...b,
      research: {
        ...b.research,
        sections: [...b.research.sections, { title: '', summary: '', details: '', imageUrl: '', paragraphs: [''], visible: true }],
      },
    }));
  }
  function removeResearchSection(idx) {
    if (!confirm('Remove this research section?')) return;
    setBody((b) => ({ ...b, research: { ...b.research, sections: b.research.sections.filter((_, i) => i !== idx) } }));
  }
  function moveResearchSection(idx, dir) {
    setBody((b) => {
      const sections = [...b.research.sections];
      const target = idx + dir;
      if (target < 0 || target >= sections.length) return b;
      [sections[idx], sections[target]] = [sections[target], sections[idx]];
      return { ...b, research: { ...b.research, sections } };
    });
  }
  function handleResearchCardPhotoUpload(secIdx, e) {
    const file = e.target?.files?.[0];
    if (!file) return;
    setResearchCardUploading(String(secIdx));
    uploadContactMemberPhoto(file)
      .then(({ imageUrl }) => {
        updateResearchSection(secIdx, 'imageUrl', imageUrl);
        onNotify?.('Research card image uploaded successfully.', 'success');
      })
      .catch((err) => onNotify?.(err.message, 'error'))
      .finally(() => setResearchCardUploading(null));
  }

  function resetHomeBodyToDefault() {
    if (!confirm('Reset all Home body sections to default content?')) return;
    setBody(normalizeHomeBody(DEFAULT_HOME_BODY));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const normalizedSections = (body?.research?.sections || []).map((section) => {
      const summary = typeof section?.summary === 'string' ? section.summary.trim() : '';
      const details = typeof section?.details === 'string' ? section.details.trim() : '';
      const imageUrl = typeof section?.imageUrl === 'string' ? section.imageUrl.trim() : '';
      const existingParagraphs = Array.isArray(section?.paragraphs)
        ? section.paragraphs.filter((p) => typeof p === 'string' && p.trim())
        : [];
      const mergedDetails = details || existingParagraphs.join(' ');
      const mergedSummary = summary || existingParagraphs[0] || '';

      return {
        ...section,
        imageUrl,
        summary: mergedSummary,
        details: mergedDetails,
        paragraphs: mergedDetails ? [mergedDetails] : (mergedSummary ? [mergedSummary] : ['']),
      };
    });

    onSave({
      ...form,
      body: {
        ...body,
        research: {
          ...body.research,
          sections: normalizedSections,
        },
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form-grid">
      <label>
        <span>Navbar/Breadcrumb Title</span>
        <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Dr. Pretom Roy Ovi" />
      </label>
      <label>
        <span>Subtitle</span>
        <input type="text" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} placeholder="Privacy Aware & Intelligent System Modeling" />
      </label>
      <label>
        <span>Tagline</span>
        <input type="text" value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} placeholder="Advancing privacy-preserving research." />
      </label>
      <label>
        <span>Hero Name (home banner)</span>
        <input type="text" value={form.heroName} onChange={(e) => setForm((f) => ({ ...f, heroName: e.target.value }))} placeholder="Pretom Roy Ovi, PhD" />
      </label>
      <label className="admin-form-full">
        <span>Hero Title (home banner)</span>
        <input type="text" value={form.heroTitle} onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))} placeholder="Assistant Professor | Director of PRISM Lab" />
      </label>

      <div className="admin-form-full" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h4 style={{ margin: 0 }}>Biography Section</h4>
          <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <input type="checkbox" checked={body.biography.visible !== false} onChange={(e) => updateBioField('visible', e.target.checked)} />
            Show section on page
          </label>
        </div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem' }}>Heading</span>
          <input type="text" value={body.biography.heading || ''} onChange={(e) => updateBioField('heading', e.target.value)} style={{ width: '100%' }} />
        </label>
        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem' }}>Kicker</span>
          <input type="text" value={body.biography.kicker || ''} onChange={(e) => updateBioField('kicker', e.target.value)} style={{ width: '100%' }} />
        </label>
        {body.biography.paragraphs.map((p, i) => (
          <div key={i} style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Paragraph {i + 1}</span>
              {body.biography.paragraphs.length > 1 && (
                <button type="button" className="admin-delete-btn" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }} onClick={() => removeBioParagraph(i)}>Remove</button>
              )}
            </div>
            <textarea rows={4} value={p || ''} onChange={(e) => updateBioParagraph(i, e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
          </div>
        ))}
        <button type="button" className="admin-card-btn" style={{ fontSize: '0.85rem' }} onClick={addBioParagraph}>+ Add Biography Paragraph</button>
      </div>

      <div className="admin-form-full" style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h4 style={{ margin: 0 }}>Education Section</h4>
          <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <input type="checkbox" checked={body.education.visible !== false} onChange={(e) => updateEducationField('visible', e.target.checked)} />
            Show section on page
          </label>
        </div>
        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem' }}>Heading</span>
          <input type="text" value={body.education.heading || ''} onChange={(e) => updateEducationField('heading', e.target.value)} style={{ width: '100%' }} />
        </label>
        {body.education.items.map((item, idx) => (
          <div key={idx} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '0.9rem', marginBottom: '0.8rem', background: item.visible === false ? '#fafafa' : '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.45rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Education #{idx + 1}{item.visible === false ? ' (hidden)' : ''}</span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button type="button" disabled={idx === 0} onClick={() => moveEducationItem(idx, -1)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>↑</button>
                <button type="button" disabled={idx === body.education.items.length - 1} onClick={() => moveEducationItem(idx, 1)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>↓</button>
                <button type="button" onClick={() => updateEducationItem(idx, 'visible', !item.visible)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>{item.visible !== false ? '👁 Hide' : '👁‍🗨 Show'}</button>
                <button type="button" className="admin-delete-btn" style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem' }} onClick={() => removeEducationItem(idx)}>Delete</button>
              </div>
            </div>
            <label style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
              <input
                type="checkbox"
                checked={item.showYears !== false}
                onChange={(e) => updateEducationItem(idx, 'showYears', e.target.checked)}
              />
              Show "Years" field on page
            </label>
            <label style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
              <input
                type="checkbox"
                checked={item.showArea !== false}
                onChange={(e) => updateEducationItem(idx, 'showArea', e.target.checked)}
              />
              Show "Area" field on page
            </label>
            <label style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
              <input
                type="checkbox"
                checked={item.showDissertationTitle !== false}
                onChange={(e) => updateEducationItem(idx, 'showDissertationTitle', e.target.checked)}
              />
              Show "Dissertation Title" field on page
            </label>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}><span style={{ fontSize: '0.85rem' }}>Degree</span>
              <input type="text" value={item.degree || ''} onChange={(e) => updateEducationItem(idx, 'degree', e.target.value)} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}><span style={{ fontSize: '0.85rem' }}>Years</span>
              <input type="text" value={item.years || ''} onChange={(e) => updateEducationItem(idx, 'years', e.target.value)} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}><span style={{ fontSize: '0.85rem' }}>Institution</span>
              <input type="text" value={item.institution || ''} onChange={(e) => updateEducationItem(idx, 'institution', e.target.value)} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}><span style={{ fontSize: '0.85rem' }}>Area</span>
              <input type="text" value={item.area || ''} onChange={(e) => updateEducationItem(idx, 'area', e.target.value)} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'block' }}><span style={{ fontSize: '0.85rem' }}>Dissertation Title</span>
              <textarea rows={2} value={item.dissertationTitle || ''} onChange={(e) => updateEducationItem(idx, 'dissertationTitle', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
            </label>
          </div>
        ))}
        <button type="button" className="admin-card-btn" style={{ fontSize: '0.85rem' }} onClick={addEducationItem}>+ Add Education Item</button>
      </div>

      <div className="admin-form-full" style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h4 style={{ margin: 0 }}>Research Section</h4>
          <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <input type="checkbox" checked={body.research.visible !== false} onChange={(e) => updateResearchField('visible', e.target.checked)} />
            Show section on page
          </label>
        </div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}><span style={{ fontSize: '0.85rem' }}>Heading</span>
          <input type="text" value={body.research.heading || ''} onChange={(e) => updateResearchField('heading', e.target.value)} style={{ width: '100%' }} />
        </label>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}><span style={{ fontSize: '0.85rem' }}>Intro</span>
          <textarea rows={3} value={body.research.intro || ''} onChange={(e) => updateResearchField('intro', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <label style={{ flex: 1, minWidth: '220px' }}><span style={{ fontSize: '0.85rem' }}>Google Scholar URL</span>
            <input type="text" value={body.research.scholarUrl || ''} onChange={(e) => updateResearchField('scholarUrl', e.target.value)} style={{ width: '100%' }} />
          </label>
          <label style={{ flex: 1, minWidth: '220px' }}><span style={{ fontSize: '0.85rem' }}>ORCID URL</span>
            <input type="text" value={body.research.orcidUrl || ''} onChange={(e) => updateResearchField('orcidUrl', e.target.value)} style={{ width: '100%' }} />
          </label>
        </div>

        {body.research.sections.map((section, secIdx) => (
          <div key={secIdx} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '0.9rem', marginBottom: '0.8rem', background: section.visible === false ? '#fafafa' : '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.45rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Research Card #{secIdx + 1}{section.visible === false ? ' (hidden)' : ''}</span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button type="button" disabled={secIdx === 0} onClick={() => moveResearchSection(secIdx, -1)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>↑</button>
                <button type="button" disabled={secIdx === body.research.sections.length - 1} onClick={() => moveResearchSection(secIdx, 1)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>↓</button>
                <button type="button" onClick={() => updateResearchSection(secIdx, 'visible', !section.visible)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>{section.visible !== false ? '👁 Hide' : '👁‍🗨 Show'}</button>
                <button type="button" className="admin-delete-btn" style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem' }} onClick={() => removeResearchSection(secIdx)}>Delete</button>
              </div>
            </div>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Picture (optional)</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                {section.imageUrl ? <img src={section.imageUrl} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ccc' }} /> : null}
                <input type="file" accept="image/*" onChange={(e) => handleResearchCardPhotoUpload(secIdx, e)} disabled={researchCardUploading === String(secIdx)} />
                {researchCardUploading === String(secIdx) && <small>Uploading…</small>}
              </div>
              <input type="text" value={section.imageUrl || ''} onChange={(e) => updateResearchSection(secIdx, 'imageUrl', e.target.value)} placeholder="Or paste image URL" style={{ width: '100%', marginTop: '0.35rem' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}><span style={{ fontSize: '0.85rem' }}>Title</span>
              <input type="text" value={section.title || ''} onChange={(e) => updateResearchSection(secIdx, 'title', e.target.value)} style={{ width: '100%' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Card Summary</span>
              <textarea rows={2} value={section.summary || ''} onChange={(e) => updateResearchSection(secIdx, 'summary', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
            </label>

            <label>
              <span style={{ fontSize: '0.85rem' }}>Modal Details</span>
              <textarea rows={4} value={section.details || ''} onChange={(e) => updateResearchSection(secIdx, 'details', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
            </label>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button type="button" className="admin-card-btn" style={{ fontSize: '0.85rem' }} onClick={addResearchSection}>+ Add Research Card</button>
          <button type="button" className="admin-hint-toggle" onClick={resetHomeBodyToDefault}>Reset Home Body to Default</button>
        </div>
      </div>

      <button type="submit" disabled={saving} className="admin-save-btn">{saving ? 'Saving…' : 'Save Home'}</button>
    </form>
  );
}

function PrismLabFormEditor({ data, onSave, saving, onNotify }) {
  const DEFAULT_PARAGRAPHS = [
    'The PRISM Lab is focused on solving real-world challenges by developing privacy-preserving machine learning systems that are both secure and efficient. By leveraging federated learning and federated unlearning, we address the critical issue of data privacy in decentralized environments, enabling the training of models without the need to share raw data. This ensures sensitive information remains protected while still allowing for meaningful insights and predictions. Additionally, our federated unlearning techniques allow for the removal of specific data from models, ensuring data integrity without sacrificing model performance.',
    'Our work on optimizing large language models (LLMs) addresses the practical need for more efficient, cost-effective AI systems. By integrating privacy-enhancing methods such as differential privacy and federated learning, we ensure user data remains secure while improving model accuracy and efficiency. We also explore advanced techniques like distillation, quantization, and pruning to reduce computational overhead and enhance model performance, making them more adaptable to low-resource settings and domains with limited data. Through these combined efforts, the PRISM Lab is solving key problems in AI, creating systems that are both scalable and privacy-conscious while delivering high-performing results across diverse applications.',
  ];

  const DEFAULT_ANNOUNCEMENTS = [
    {
      id: 'hiring-fall2026',
      type: 'hiring',
      title: 'Seeking PhD Students – Fall 2026',
      body: 'I am seeking highly motivated PhD students to join my lab in Fall 2026. As a professor leading cutting-edge research in Privacy-Enhanced Machine Learning, Federated Learning, Large Language Modeling, Visual Question Answering, Data Mining, Health Informatics, and Cybersecurity, I am committed to tackling complex challenges at the intersection of AI, privacy, and security. My lab focuses on interdisciplinary projects that aim to make a real-world impact. I am looking for passionate students, who are eager to contribute to innovative research and push the boundaries of these fields. If you\'re driven by curiosity and a desire to make a meaningful difference, I invite you to apply and join our collaborative research efforts.',
      visible: true,
    },
  ];

  const DEFAULT_RESEARCH_AREAS = [
    {
      id: 'federated-unlearning',
      title: 'Federated Unlearning',
      summary: 'Removing client influence from federated models without full retraining.',
      details: 'We design scalable unlearning protocols for decentralized learning systems so specific participants or samples can be removed while preserving utility, fairness, and communication efficiency.',
      imageUrl: '',
      visible: true,
    },
    {
      id: 'llm-unlearning',
      title: 'LLM Unlearning',
      summary: 'Selective forgetting in large language models with minimal performance loss.',
      details: 'Our work studies data deletion and safety-driven removal in foundation models, combining efficient post-hoc unlearning strategies with robust evaluation to reduce residual memorization.',
      imageUrl: '',
      visible: true,
    },
    {
      id: 'cyber-security',
      title: 'Cyber Security',
      summary: 'Secure and privacy-preserving AI against poisoning, leakage, and model attacks.',
      details: 'We investigate adversarial and privacy threats in distributed ML, including data poisoning, model inversion, and gradient leakage, then build defense pipelines suitable for real deployments.',
      imageUrl: '',
      visible: true,
    },
    {
      id: 'llm-reasoning',
      title: 'LLM Reasoning',
      summary: 'Improving reasoning quality, robustness, and efficiency of language models.',
      details: 'The lab explores prompting, distillation, and alignment techniques that improve multi-step reasoning and reliability while lowering inference cost in domain-specific applications.',
      imageUrl: '',
      visible: true,
    },
  ];

  const DEFAULT_MISSION_VISSION = {
    title: 'Mission and Vission',
    paragraphs: [
      'The PRISM Lab envisions a future where high-performing AI can be used everywhere people need it most without requiring sensitive data to be collected, shared, or centralized. The lab aims to make privacy-preserving intelligence the norm in decentralized environments by enabling organizations and communities to benefit from robust predictions and decision support while keeping personal and proprietary information protected. PRISM also strives for AI systems that remain accountable over time, where models can be updated responsibly and data can be removed when required, so trust, compliance, and long-term integrity are built into the lifecycle of learning systems.',
      'The PRISM Lab’s mission is to solve real-world problems by engineering machine learning systems that are secure, efficient, and practical to deploy at scale. The lab advances federated learning to train models across distributed data sources without exposing raw data, and develops federated unlearning methods that support reliable data removal without degrading model utility. In parallel, PRISM focuses on making large language models more efficient and cost-effective by combining privacy-enhancing techniques such as differential privacy with model optimization approaches including distillation, quantization, and pruning. Through these efforts, the lab delivers scalable, privacy-conscious AI that performs strongly across diverse applications, including settings with limited compute, limited data, or strict privacy requirements.',
    ],
  };

  const TYPES = ['hiring', 'publication', 'celebration', 'general'];
  const [researchAreaPhotoUploading, setResearchAreaPhotoUploading] = useState(null);

  const [form, setForm] = useState({
    title: '',
    logoUrl: '/prismLogo.svg',
    bannerText: '',
    bannerSubtitle: '',
    showResearchAreas: true,
    showAnnouncements: true,
    showMissionVission: true,
    ...data,
    paragraphs: Array.isArray(data?.paragraphs) && data.paragraphs.length ? data.paragraphs : DEFAULT_PARAGRAPHS,
    researchAreas: Array.isArray(data?.researchAreas) && data.researchAreas.length ? data.researchAreas : DEFAULT_RESEARCH_AREAS,
    announcements: Array.isArray(data?.announcements) && data.announcements.length ? data.announcements : DEFAULT_ANNOUNCEMENTS,
    missionVission: data?.missionVission && typeof data.missionVission === 'object'
      ? {
          ...DEFAULT_MISSION_VISSION,
          ...data.missionVission,
          paragraphs: Array.isArray(data?.missionVission?.paragraphs) ? data.missionVission.paragraphs : DEFAULT_MISSION_VISSION.paragraphs,
        }
      : DEFAULT_MISSION_VISSION,
  });

  useEffect(() => {
    setForm((f) => ({
      ...f,
      ...data,
      paragraphs: Array.isArray(data?.paragraphs) && data.paragraphs.length ? data.paragraphs : f.paragraphs,
      researchAreas: Array.isArray(data?.researchAreas) && data.researchAreas.length ? data.researchAreas : f.researchAreas,
      showResearchAreas: data?.showResearchAreas !== false,
      announcements: Array.isArray(data?.announcements) && data.announcements.length ? data.announcements : f.announcements,
      showAnnouncements: data?.showAnnouncements !== false,
      showMissionVission: data?.showMissionVission !== false,
      missionVission: data?.missionVission && typeof data.missionVission === 'object'
        ? {
            ...f.missionVission,
            ...data.missionVission,
            paragraphs: Array.isArray(data?.missionVission?.paragraphs)
              ? data.missionVission.paragraphs
              : f.missionVission?.paragraphs || DEFAULT_MISSION_VISSION.paragraphs,
          }
        : f.missionVission,
    }));
  }, [data]);

  /* ── Paragraph helpers ── */
  function updateParagraph(idx, val) {
    setForm((f) => {
      const p = [...f.paragraphs];
      p[idx] = val;
      return { ...f, paragraphs: p };
    });
  }
  function addParagraph() {
    setForm((f) => ({ ...f, paragraphs: [...f.paragraphs, ''] }));
  }
  function removeParagraph(idx) {
    setForm((f) => ({ ...f, paragraphs: f.paragraphs.filter((_, i) => i !== idx) }));
  }

  /* ── Research area helpers ── */
  function updateResearchArea(idx, key, val) {
    setForm((f) => {
      const items = [...f.researchAreas];
      items[idx] = { ...items[idx], [key]: val };
      return { ...f, researchAreas: items };
    });
  }
  function addResearchArea() {
    setForm((f) => ({
      ...f,
      researchAreas: [
        ...f.researchAreas,
        { id: `area-${Date.now()}`, title: '', summary: '', details: '', imageUrl: '', visible: true },
      ],
    }));
  }
  function removeResearchArea(idx) {
    if (!confirm('Remove this research area?')) return;
    setForm((f) => ({ ...f, researchAreas: f.researchAreas.filter((_, i) => i !== idx) }));
  }
  function moveResearchArea(idx, dir) {
    setForm((f) => {
      const items = [...f.researchAreas];
      const target = idx + dir;
      if (target < 0 || target >= items.length) return f;
      [items[idx], items[target]] = [items[target], items[idx]];
      return { ...f, researchAreas: items };
    });
  }

  function handleResearchAreaPhotoUpload(idx, e) {
    const file = e.target?.files?.[0];
    if (!file) return;
    setResearchAreaPhotoUploading(String(idx));
    uploadContactMemberPhoto(file)
      .then(({ imageUrl }) => {
        updateResearchArea(idx, 'imageUrl', imageUrl);
        onNotify?.('Research area image uploaded successfully.', 'success');
      })
      .catch((err) => onNotify?.(err.message, 'error'))
      .finally(() => setResearchAreaPhotoUploading(null));
  }

  /* ── Announcement helpers ── */
  function updateAnnouncement(idx, key, val) {
    setForm((f) => {
      const a = [...f.announcements];
      a[idx] = { ...a[idx], [key]: val };
      return { ...f, announcements: a };
    });
  }
  function addAnnouncement() {
    setForm((f) => ({
      ...f,
      announcements: [
        ...f.announcements,
        { id: `ann-${Date.now()}`, type: 'general', title: '', body: '', visible: true },
      ],
    }));
  }
  function removeAnnouncement(idx) {
    if (!confirm('Remove this announcement?')) return;
    setForm((f) => ({ ...f, announcements: f.announcements.filter((_, i) => i !== idx) }));
  }
  function moveAnnouncement(idx, dir) {
    setForm((f) => {
      const a = [...f.announcements];
      const target = idx + dir;
      if (target < 0 || target >= a.length) return f;
      [a[idx], a[target]] = [a[target], a[idx]];
      return { ...f, announcements: a };
    });
  }

  /* ── Mission & Vission helpers ── */
  function updateMissionField(key, value) {
    setForm((f) => ({ ...f, missionVission: { ...f.missionVission, [key]: value } }));
  }
  function updateMissionParagraph(idx, value) {
    setForm((f) => {
      const paragraphs = [...(f.missionVission?.paragraphs || [])];
      paragraphs[idx] = value;
      return { ...f, missionVission: { ...f.missionVission, paragraphs } };
    });
  }
  function addMissionParagraph() {
    setForm((f) => ({
      ...f,
      missionVission: { ...f.missionVission, paragraphs: [...(f.missionVission?.paragraphs || []), ''] },
    }));
  }
  function removeMissionParagraph(idx) {
    if (!confirm('Remove this mission/vission paragraph?')) return;
    setForm((f) => ({
      ...f,
      missionVission: {
        ...f.missionVission,
        paragraphs: (f.missionVission?.paragraphs || []).filter((_, i) => i !== idx),
      },
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form-grid">
      {/* ── Basic fields ── */}
      <label>
        <span>Page Title</span>
        <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="PRISM Lab" />
        <small className="admin-field-hint">Used in navbar, sidebar, footer, and breadcrumb.</small>
      </label>
      <label className="admin-form-full">
        <span>Top Header Title (PRISM page)</span>
        <input type="text" value={form.bannerText ?? ''} onChange={(e) => setForm((f) => ({ ...f, bannerText: e.target.value }))} placeholder="e.g. Privacy Aware & Intelligent System Modeling (PRISM) Lab" />
      </label>
      <label>
        <span>Top Header Subtitle</span>
        <input type="text" value={form.bannerSubtitle ?? ''} onChange={(e) => setForm((f) => ({ ...f, bannerSubtitle: e.target.value }))} placeholder="University of North Texas" />
      </label>
      <label className="admin-form-full">
        <span>Top Header Logo URL</span>
        <input type="text" value={form.logoUrl ?? ''} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))} placeholder="/prismLogo.svg" />
      </label>

      {/* ── Description paragraphs ── */}
      <div className="admin-form-full" style={{ marginTop: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem' }}>Description Paragraphs</h4>
        <small className="admin-field-hint" style={{ display: 'block', marginBottom: '0.75rem' }}>
          Each paragraph appears in order on the PRISM Lab page next to the logo.
        </small>
        {form.paragraphs.map((p, i) => (
          <div key={i} style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Paragraph {i + 1}</span>
              {form.paragraphs.length > 1 && (
                <button type="button" className="admin-delete-btn" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }} onClick={() => removeParagraph(i)}>Remove</button>
              )}
            </div>
            <textarea rows={4} value={p} onChange={(e) => updateParagraph(i, e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
          </div>
        ))}
        <button type="button" className="admin-card-btn" style={{ fontSize: '0.85rem' }} onClick={addParagraph}>+ Add Paragraph</button>
      </div>

      {/* ── Announcements ── */}
      <div className="admin-form-full" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <h4 style={{ margin: 0 }}>Research Areas</h4>
          <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.showResearchAreas !== false}
              onChange={(e) => setForm((f) => ({ ...f, showResearchAreas: e.target.checked }))}
            />
            Show section on page
          </label>
        </div>
        <small className="admin-field-hint" style={{ display: 'block', marginBottom: '0.75rem' }}>
          Add, edit, reorder, show/hide, or delete research area cards. Clicking each card opens details in a modal on the PRISM page.
        </small>

        {form.researchAreas.map((item, i) => (
          <div key={item.id || i} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', background: item.visible === false ? '#fafafa' : '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>#{i + 1}{item.visible === false ? ' (hidden)' : ''}</span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button type="button" disabled={i === 0} onClick={() => moveResearchArea(i, -1)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>↑</button>
                <button type="button" disabled={i === form.researchAreas.length - 1} onClick={() => moveResearchArea(i, 1)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>↓</button>
                <button type="button" onClick={() => updateResearchArea(i, 'visible', !item.visible)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                  {item.visible !== false ? '👁 Hide' : '👁‍🗨 Show'}
                </button>
                <button type="button" className="admin-delete-btn" style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem' }} onClick={() => removeResearchArea(i)}>Delete</button>
              </div>
            </div>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Picture (optional)</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ccc' }} /> : null}
                <input type="file" accept="image/*" onChange={(e) => handleResearchAreaPhotoUpload(i, e)} disabled={researchAreaPhotoUploading === String(i)} />
                {researchAreaPhotoUploading === String(i) && <small>Uploading…</small>}
              </div>
              <input type="text" value={item.imageUrl || ''} onChange={(e) => updateResearchArea(i, 'imageUrl', e.target.value)} placeholder="Or paste image URL" style={{ width: '100%', marginTop: '0.35rem' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Title</span>
              <input type="text" value={item.title || ''} onChange={(e) => updateResearchArea(i, 'title', e.target.value)} placeholder="e.g. Federated Unlearning" style={{ width: '100%' }} />
            </label>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Card Summary</span>
              <textarea rows={2} value={item.summary || ''} onChange={(e) => updateResearchArea(i, 'summary', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
            </label>

            <label>
              <span style={{ fontSize: '0.85rem' }}>Modal Details</span>
              <textarea rows={4} value={item.details || ''} onChange={(e) => updateResearchArea(i, 'details', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
            </label>
          </div>
        ))}
        <button type="button" className="admin-card-btn" style={{ fontSize: '0.85rem' }} onClick={addResearchArea}>+ Add Research Area</button>
      </div>

      {/* ── Announcements ── */}
      <div className="admin-form-full" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <h4 style={{ margin: 0 }}>Announcements</h4>
          <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.showAnnouncements !== false}
              onChange={(e) => setForm((f) => ({ ...f, showAnnouncements: e.target.checked }))}
            />
            Show section on page
          </label>
        </div>
        <small className="admin-field-hint" style={{ display: 'block', marginBottom: '0.75rem' }}>
          Create, edit, reorder, show/hide, or delete announcements. Hidden announcements are saved but not shown to visitors.
        </small>

        {form.announcements.map((a, i) => (
          <div key={a.id || i} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', background: a.visible === false ? '#fafafa' : '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>#{i + 1}{a.visible === false ? ' (hidden)' : ''}</span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button type="button" disabled={i === 0} onClick={() => moveAnnouncement(i, -1)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>↑</button>
                <button type="button" disabled={i === form.announcements.length - 1} onClick={() => moveAnnouncement(i, 1)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>↓</button>
                <button type="button" onClick={() => updateAnnouncement(i, 'visible', !a.visible)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.8rem' }}>
                  {a.visible !== false ? '👁 Hide' : '👁‍🗨 Show'}
                </button>
                <button type="button" className="admin-delete-btn" style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem' }} onClick={() => removeAnnouncement(i)}>Delete</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <label style={{ flex: 1, minWidth: '180px' }}>
                <span style={{ fontSize: '0.85rem' }}>Type</span>
                <select value={a.type || 'general'} onChange={(e) => updateAnnouncement(i, 'type', e.target.value)} style={{ width: '100%' }}>
                  {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </label>
              <label style={{ flex: 3, minWidth: '200px' }}>
                <span style={{ fontSize: '0.85rem' }}>Title</span>
                <input type="text" value={a.title} onChange={(e) => updateAnnouncement(i, 'title', e.target.value)} placeholder="Announcement title" style={{ width: '100%' }} />
              </label>
            </div>
            <label>
              <span style={{ fontSize: '0.85rem' }}>Body</span>
              <textarea rows={4} value={a.body} onChange={(e) => updateAnnouncement(i, 'body', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
            </label>
          </div>
        ))}
        <button type="button" className="admin-card-btn" style={{ fontSize: '0.85rem' }} onClick={addAnnouncement}>+ Add Announcement</button>
      </div>

      {/* ── Mission and Vission ── */}
      <div className="admin-form-full" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <h4 style={{ margin: 0 }}>Mission and Vission</h4>
          <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.showMissionVission !== false}
              onChange={(e) => setForm((f) => ({ ...f, showMissionVission: e.target.checked }))}
            />
            Show section on page
          </label>
        </div>
        <small className="admin-field-hint" style={{ display: 'block', marginBottom: '0.75rem' }}>
          Edit title and paragraphs, add new paragraphs, remove unwanted ones, or hide the whole section.
        </small>

        <label style={{ display: 'block', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.85rem' }}>Section Title</span>
          <input
            type="text"
            value={form.missionVission?.title || ''}
            onChange={(e) => updateMissionField('title', e.target.value)}
            placeholder="Mission and Vission"
            style={{ width: '100%' }}
          />
        </label>

        {(form.missionVission?.paragraphs || []).map((p, i) => (
          <div key={i} style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Paragraph {i + 1}</span>
              <button type="button" className="admin-delete-btn" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }} onClick={() => removeMissionParagraph(i)}>Remove</button>
            </div>
            <textarea rows={4} value={p || ''} onChange={(e) => updateMissionParagraph(i, e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
          </div>
        ))}
        <button type="button" className="admin-card-btn" style={{ fontSize: '0.85rem' }} onClick={addMissionParagraph}>+ Add Mission/Vission Paragraph</button>
      </div>

      <button type="submit" disabled={saving} className="admin-save-btn" style={{ marginTop: '1rem' }}>{saving ? 'Saving…' : 'Save PRISM Lab'}</button>
    </form>
  );
}

/* ================================================================
   StudentFormEditor - Full CRUD for sections & students with photo upload
   ================================================================ */
const DEFAULT_SECTIONS = [
  { id: 'graduate', label: 'Graduate Students', visible: true, students: [] },
  { id: 'undergraduate', label: 'Undergraduate Students', visible: true, students: [] },
  { id: 'highschool', label: 'High School Students', visible: true, students: [] },
  { id: 'alumni', label: 'Alumni', visible: true, students: [] },
];

function makeBlankStudent() {
  return {
    id: `stu-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    name: '',
    title: '',
    department: '',
    scholarUrl: '',
    education: [''],
    researchInterests: [''],
    bio: '',
    email: '',
    imageUrl: '',
    linkedinUrl: '',
  };
}

function StudentFormEditor({ data, onSave, saving, onNotify }) {
  const [sections, setSections] = useState(
    Array.isArray(data?.sections) && data.sections.length ? data.sections : DEFAULT_SECTIONS,
  );
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [uploading, setUploading] = useState(null); // studentId currently uploading

  useEffect(() => {
    if (Array.isArray(data?.sections) && data.sections.length) {
      setSections(data.sections);
    }
  }, [data]);

  /* ── Section helpers ── */
  function toggleSectionVisible(secIdx) {
    setSections((prev) => prev.map((s, i) => i === secIdx ? { ...s, visible: !s.visible } : s));
    onNotify?.('Student section visibility updated.', 'info');
  }

  function updateSectionLabel(secIdx, val) {
    setSections((prev) => prev.map((s, i) => i === secIdx ? { ...s, label: val } : s));
  }

  /* ── Student helpers ── */
  function addStudent(secIdx) {
    setSections((prev) => prev.map((s, i) => i === secIdx ? { ...s, students: [...s.students, makeBlankStudent()] } : s));
    onNotify?.('Student added. Click Save Students to publish changes.', 'info');
  }

  function removeStudent(secIdx, stuIdx) {
    if (!confirm('Remove this student?')) return;
    setSections((prev) => prev.map((s, i) => i === secIdx ? { ...s, students: s.students.filter((_, j) => j !== stuIdx) } : s));
    onNotify?.('Student removed. Click Save Students to publish changes.', 'info');
  }

  function moveStudent(secIdx, stuIdx, dir) {
    setSections((prev) => prev.map((s, i) => {
      if (i !== secIdx) return s;
      const arr = [...s.students];
      const target = stuIdx + dir;
      if (target < 0 || target >= arr.length) return s;
      [arr[stuIdx], arr[target]] = [arr[target], arr[stuIdx]];
      return { ...s, students: arr };
    }));
    onNotify?.('Student order updated. Click Save Students to publish changes.', 'info');
  }

  function updateStudent(secIdx, stuIdx, key, val) {
    setSections((prev) => prev.map((s, i) => {
      if (i !== secIdx) return s;
      const students = s.students.map((stu, j) => j === stuIdx ? { ...stu, [key]: val } : stu);
      return { ...s, students };
    }));
  }

  /* ── List field helpers (education, researchInterests) ── */
  function updateListItem(secIdx, stuIdx, field, itemIdx, val) {
    setSections((prev) => prev.map((s, i) => {
      if (i !== secIdx) return s;
      const students = s.students.map((stu, j) => {
        if (j !== stuIdx) return stu;
        const arr = [...(stu[field] || [])];
        arr[itemIdx] = val;
        return { ...stu, [field]: arr };
      });
      return { ...s, students };
    }));
  }

  function addListItem(secIdx, stuIdx, field) {
    setSections((prev) => prev.map((s, i) => {
      if (i !== secIdx) return s;
      const students = s.students.map((stu, j) => j === stuIdx ? { ...stu, [field]: [...(stu[field] || []), ''] } : stu);
      return { ...s, students };
    }));
    onNotify?.('List item added. Click Save Students to publish changes.', 'info');
  }

  function removeListItem(secIdx, stuIdx, field, itemIdx) {
    setSections((prev) => prev.map((s, i) => {
      if (i !== secIdx) return s;
      const students = s.students.map((stu, j) => {
        if (j !== stuIdx) return stu;
        return { ...stu, [field]: (stu[field] || []).filter((_, k) => k !== itemIdx) };
      });
      return { ...s, students };
    }));
    onNotify?.('List item removed. Click Save Students to publish changes.', 'info');
  }

  /* ── Photo upload ── */
  async function handlePhotoUpload(secIdx, stuIdx, file) {
    const student = sections[secIdx]?.students?.[stuIdx];
    if (!student || !file) return;
    setUploading(student.id);
    try {
      const result = await uploadStudentPhoto(file);
      updateStudent(secIdx, stuIdx, 'imageUrl', result.imageUrl);
      onNotify?.('Student photo uploaded successfully.', 'success');
    } catch (err) {
      onNotify?.('Photo upload failed: ' + err.message, 'error');
    } finally {
      setUploading(null);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ sections });
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form-grid">
      <div className="admin-form-full">
        <small className="admin-field-hint" style={{ display: 'block', marginBottom: '1rem' }}>
          Manage students by section. Click a section to expand, then add/edit/remove students. Each student can have a photo, bio, education, research interests, and links.
        </small>

        <div className="admin-collapsible-grid">
          {sections.map((sec, secIdx) => {
            const isExpanded = expandedSection === secIdx;
            return (
              <div key={sec.id} className={`admin-collapsible-card ${sec.visible === false ? 'is-hidden' : ''} ${isExpanded ? 'is-expanded' : ''}`}>
              {/* Section header */}
              <div
                className={`admin-collapsible-header ${isExpanded ? 'is-expanded' : ''}`}
                onClick={() => setExpandedSection(isExpanded ? null : secIdx)}
              >
                <div className="admin-collapsible-main">
                  <span className="admin-chevron">{isExpanded ? '▾' : '▸'}</span>
                  <strong>{sec.label}</strong>
                  <span className="admin-count-chip">{sec.students.length} student{sec.students.length !== 1 ? 's' : ''}</span>
                  {sec.visible === false && <span className="admin-hidden-chip">HIDDEN</span>}
                </div>
                <div className="admin-collapsible-actions" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => toggleSectionVisible(secIdx)} style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>
                    {sec.visible !== false ? '👁 Hide' : '👁‍🗨 Show'}
                  </button>
                </div>
              </div>

              {/* Expanded section body */}
              {isExpanded && (
                <div style={{ padding: '0.75rem 1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Section Label:</span>
                    <input type="text" value={sec.label} onChange={(e) => updateSectionLabel(secIdx, e.target.value)} style={{ flex: 1 }} />
                  </label>

                  {sec.students.map((stu, stuIdx) => {
                    const isStudentExpanded = expandedStudent === `${secIdx}-${stuIdx}`;
                    return (
                      <div key={stu.id} className="admin-subcard">
                        {/* Student header row */}
                        <div
                          className="admin-subcard-header"
                          onClick={() => setExpandedStudent(isStudentExpanded ? null : `${secIdx}-${stuIdx}`)}
                        >
                          <div className="admin-collapsible-main">
                            <span className="admin-chevron">{isStudentExpanded ? '▾' : '▸'}</span>
                            {stu.imageUrl && <img src={stu.imageUrl} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />}
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{stu.name || '(unnamed)'}</span>
                            {stu.title && <span style={{ fontSize: '0.8rem', color: '#666' }}>— {stu.title}</span>}
                          </div>
                          <div className="admin-collapsible-actions" onClick={(e) => e.stopPropagation()}>
                            <button type="button" disabled={stuIdx === 0} onClick={() => moveStudent(secIdx, stuIdx, -1)} style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}>↑</button>
                            <button type="button" disabled={stuIdx === sec.students.length - 1} onClick={() => moveStudent(secIdx, stuIdx, 1)} style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}>↓</button>
                            <button type="button" className="admin-delete-btn" style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }} onClick={() => removeStudent(secIdx, stuIdx)}>Delete</button>
                          </div>
                        </div>

                        {/* Expanded student editor */}
                        {isStudentExpanded && (
                          <div style={{ padding: '0.75rem', borderTop: '1px solid #eee' }}>
                            {/* Photo upload */}
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                              <div style={{ width: 100, textAlign: 'center' }}>
                                {stu.imageUrl ? (
                                  <img src={stu.imageUrl} alt="" style={{ width: 100, height: 120, objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} />
                                ) : (
                                  <div style={{ width: 100, height: 120, borderRadius: '6px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#aaa' }}>No Photo</div>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ fontSize: '0.7rem', marginTop: '0.3rem', width: '100%' }}
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handlePhotoUpload(secIdx, stuIdx, f);
                                  }}
                                  disabled={uploading === stu.id}
                                />
                                {uploading === stu.id && <span style={{ fontSize: '0.7rem', color: '#006747' }}>Uploading…</span>}
                              </div>
                              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Name *</span>
                                  <input type="text" value={stu.name} onChange={(e) => updateStudent(secIdx, stuIdx, 'name', e.target.value)} />
                                </label>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Title / Role</span>
                                  <input type="text" value={stu.title || ''} onChange={(e) => updateStudent(secIdx, stuIdx, 'title', e.target.value)} placeholder="e.g. Ph.D. Student" />
                                </label>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', gridColumn: 'span 2' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Department</span>
                                  <input type="text" value={stu.department || ''} onChange={(e) => updateStudent(secIdx, stuIdx, 'department', e.target.value)} />
                                </label>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Email</span>
                                  <input type="email" value={stu.email || ''} onChange={(e) => updateStudent(secIdx, stuIdx, 'email', e.target.value)} />
                                </label>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Image URL (auto or manual)</span>
                                  <input type="text" value={stu.imageUrl || ''} onChange={(e) => updateStudent(secIdx, stuIdx, 'imageUrl', e.target.value)} placeholder="Auto-filled on upload" />
                                </label>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Google Scholar URL</span>
                                  <input type="url" value={stu.scholarUrl || ''} onChange={(e) => updateStudent(secIdx, stuIdx, 'scholarUrl', e.target.value)} />
                                </label>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>LinkedIn URL</span>
                                  <input type="url" value={stu.linkedinUrl || ''} onChange={(e) => updateStudent(secIdx, stuIdx, 'linkedinUrl', e.target.value)} />
                                </label>
                              </div>
                            </div>

                            {/* Education list */}
                            <div style={{ marginBottom: '0.75rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#006747' }}>Education</span>
                              {(stu.education || []).map((ed, edIdx) => (
                                <div key={edIdx} style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem' }}>
                                  <input type="text" value={ed} onChange={(e) => updateListItem(secIdx, stuIdx, 'education', edIdx, e.target.value)} style={{ flex: 1 }} placeholder="e.g. B.S. Computer Science, MIT, 2020" />
                                  <button type="button" onClick={() => removeListItem(secIdx, stuIdx, 'education', edIdx)} style={{ padding: '0.15rem 0.35rem', fontSize: '0.75rem', color: '#c00' }}>✕</button>
                                </div>
                              ))}
                              <button type="button" onClick={() => addListItem(secIdx, stuIdx, 'education')} style={{ fontSize: '0.8rem', marginTop: '0.25rem', padding: '0.15rem 0.5rem' }}>+ Education</button>
                            </div>

                            {/* Research Interests list */}
                            <div style={{ marginBottom: '0.75rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#006747' }}>Research Interests</span>
                              {(stu.researchInterests || []).map((ri, riIdx) => (
                                <div key={riIdx} style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem' }}>
                                  <input type="text" value={ri} onChange={(e) => updateListItem(secIdx, stuIdx, 'researchInterests', riIdx, e.target.value)} style={{ flex: 1 }} placeholder="e.g. Federated Learning" />
                                  <button type="button" onClick={() => removeListItem(secIdx, stuIdx, 'researchInterests', riIdx)} style={{ padding: '0.15rem 0.35rem', fontSize: '0.75rem', color: '#c00' }}>✕</button>
                                </div>
                              ))}
                              <button type="button" onClick={() => addListItem(secIdx, stuIdx, 'researchInterests')} style={{ fontSize: '0.8rem', marginTop: '0.25rem', padding: '0.15rem 0.5rem' }}>+ Research Interest</button>
                            </div>

                            {/* Bio */}
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#006747' }}>Bio</span>
                              <textarea rows={3} value={stu.bio || ''} onChange={(e) => updateStudent(secIdx, stuIdx, 'bio', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button type="button" className="admin-card-btn" style={{ fontSize: '0.85rem' }} onClick={() => addStudent(secIdx)}>+ Add Student</button>
                </div>
              )}
              </div>
            );
          })}
        </div>
      </div>

      <button type="submit" disabled={saving} className="admin-save-btn" style={{ marginTop: '1rem' }}>{saving ? 'Saving…' : 'Save Students'}</button>
    </form>
  );
}

/* ================================================================
   PublicationFormEditor - Full CRUD for publication sections & entries
   with rich text (HTML), subsections (year), visibility toggles
   ================================================================ */
const DEFAULT_PUB_SECTIONS = [
  { id: 'books', label: 'Books / Book Chapters', visible: true, summary: '', groupByYear: false, entries: [] },
  { id: 'journals', label: 'Journals', visible: true, summary: '', groupByYear: false, entries: [] },
  { id: 'conferences', label: 'Conferences', visible: true, summary: '', groupByYear: true, entries: [] },
  { id: 'posters', label: 'Posters and Student Presentations', visible: true, summary: '', groupByYear: false, entries: [] },
];

function makeBlankEntry() {
  return {
    id: `pub-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    text: '',
    year: '',
    visible: true,
  };
}

/** Tiny inline toolbar for basic formatting (bold / italic / underline / link). */
function RichTextArea({ value, onChange, rows = 3, placeholder }) {
  const id = `rta-${Math.random().toString(36).slice(2, 8)}`;

  function wrap(tag) {
    const ta = document.getElementById(id);
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);
    const wrapped = `<${tag}>${sel}</${tag}>`;
    onChange(before + wrapped + after);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start;
      ta.selectionEnd = start + wrapped.length;
    }, 0);
  }

  function insertLink() {
    const ta = document.getElementById(id);
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.substring(start, end) || 'link text';
    const url = prompt('URL:', 'https://');
    if (!url) return;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${sel}</a>`;
    onChange(before + link + after);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
        <button type="button" onClick={() => wrap('b')} title="Bold" style={{ fontWeight: 700, padding: '0.1rem 0.4rem', fontSize: '0.8rem' }}>B</button>
        <button type="button" onClick={() => wrap('i')} title="Italic" style={{ fontStyle: 'italic', padding: '0.1rem 0.4rem', fontSize: '0.8rem' }}>I</button>
        <button type="button" onClick={() => wrap('u')} title="Underline" style={{ textDecoration: 'underline', padding: '0.1rem 0.4rem', fontSize: '0.8rem' }}>U</button>
        <button type="button" onClick={insertLink} title="Insert link" style={{ padding: '0.1rem 0.4rem', fontSize: '0.8rem' }}>🔗</button>
      </div>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem' }}
      />
      {value && (
        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.15rem' }}>
          Preview: <span dangerouslySetInnerHTML={{ __html: value }} style={{ color: '#333' }} />
        </div>
      )}
    </div>
  );
}

function PublicationFormEditor({ data, onSave, saving, onNotify }) {
  const [sections, setSections] = useState(
    Array.isArray(data?.sections) && data.sections.length ? data.sections : DEFAULT_PUB_SECTIONS,
  );
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedEntry, setExpandedEntry] = useState(null);

  useEffect(() => {
    if (Array.isArray(data?.sections) && data.sections.length) {
      setSections(data.sections);
    }
  }, [data]);

  /* ── Section helpers ── */
  function toggleSectionVisible(secIdx) {
    setSections((prev) => prev.map((s, i) => i === secIdx ? { ...s, visible: !s.visible } : s));
    onNotify?.('Publication section visibility updated.', 'info');
  }
  function updateSection(secIdx, key, val) {
    setSections((prev) => prev.map((s, i) => i === secIdx ? { ...s, [key]: val } : s));
  }
  function addSection() {
    setSections((prev) => [...prev, { id: `sec-${Date.now()}`, label: 'New Section', visible: true, summary: '', groupByYear: false, entries: [] }]);
    onNotify?.('Publication section added. Click Save Publications to publish changes.', 'info');
  }
  function removeSection(secIdx) {
    if (!confirm('Delete this entire section and all its entries?')) return;
    setSections((prev) => prev.filter((_, i) => i !== secIdx));
    onNotify?.('Publication section deleted. Click Save Publications to publish changes.', 'info');
  }
  function moveSection(secIdx, dir) {
    setSections((prev) => {
      const arr = [...prev];
      const target = secIdx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[secIdx], arr[target]] = [arr[target], arr[secIdx]];
      return arr;
    });
    onNotify?.('Publication section order updated. Click Save Publications to publish changes.', 'info');
  }

  /* ── Entry helpers ── */
  function addEntry(secIdx) {
    setSections((prev) => prev.map((s, i) => i === secIdx ? { ...s, entries: [...s.entries, makeBlankEntry()] } : s));
    onNotify?.('Publication entry added. Click Save Publications to publish changes.', 'info');
  }
  function removeEntry(secIdx, entIdx) {
    if (!confirm('Remove this entry?')) return;
    setSections((prev) => prev.map((s, i) => i === secIdx ? { ...s, entries: s.entries.filter((_, j) => j !== entIdx) } : s));
    onNotify?.('Publication entry deleted. Click Save Publications to publish changes.', 'info');
  }
  function moveEntry(secIdx, entIdx, dir) {
    setSections((prev) => prev.map((s, i) => {
      if (i !== secIdx) return s;
      const arr = [...s.entries];
      const target = entIdx + dir;
      if (target < 0 || target >= arr.length) return s;
      [arr[entIdx], arr[target]] = [arr[target], arr[entIdx]];
      return { ...s, entries: arr };
    }));
    onNotify?.('Publication entry order updated. Click Save Publications to publish changes.', 'info');
  }
  function updateEntry(secIdx, entIdx, key, val) {
    setSections((prev) => prev.map((s, i) => {
      if (i !== secIdx) return s;
      const entries = s.entries.map((e, j) => j === entIdx ? { ...e, [key]: val } : e);
      return { ...s, entries };
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ sections });
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form-grid">
      <div className="admin-form-full">
        <small className="admin-field-hint" style={{ display: 'block', marginBottom: '1rem' }}>
          Manage publication sections (Books, Journals, Conferences, Posters, etc.). Each entry supports rich text — use the B/I/U/Link toolbar to format.
          Toggle "Group by Year" to auto-group entries under year sub-headings. You can add/remove/reorder sections and entries, and show/hide anything.
        </small>

        <div className="admin-collapsible-grid">
          {sections.map((sec, secIdx) => {
            const isExpanded = expandedSection === secIdx;
            return (
              <div key={sec.id} className={`admin-collapsible-card ${sec.visible === false ? 'is-hidden' : ''} ${isExpanded ? 'is-expanded' : ''}`}>
              {/* Section header */}
              <div
                className={`admin-collapsible-header ${isExpanded ? 'is-expanded' : ''}`}
                onClick={() => setExpandedSection(isExpanded ? null : secIdx)}
              >
                <div className="admin-collapsible-main">
                  <span className="admin-chevron">{isExpanded ? '▾' : '▸'}</span>
                  <strong>{sec.label}</strong>
                  <span className="admin-count-chip">{sec.entries.length} entr{sec.entries.length !== 1 ? 'ies' : 'y'}</span>
                  {sec.visible === false && <span className="admin-hidden-chip">HIDDEN</span>}
                  {sec.groupByYear && <span className="admin-year-chip">Year groups</span>}
                </div>
                <div className="admin-collapsible-actions" onClick={(e) => e.stopPropagation()}>
                  <button type="button" disabled={secIdx === 0} onClick={() => moveSection(secIdx, -1)} style={{ padding: '0.15rem 0.4rem', fontSize: '0.8rem' }}>↑</button>
                  <button type="button" disabled={secIdx === sections.length - 1} onClick={() => moveSection(secIdx, 1)} style={{ padding: '0.15rem 0.4rem', fontSize: '0.8rem' }}>↓</button>
                  <button type="button" onClick={() => toggleSectionVisible(secIdx)} style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>
                    {sec.visible !== false ? '👁 Hide' : '👁‍🗨 Show'}
                  </button>
                  <button type="button" className="admin-delete-btn" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }} onClick={() => removeSection(secIdx)}>Delete</button>
                </div>
              </div>

              {/* Expanded section body */}
              {isExpanded && (
                <div style={{ padding: '0.75rem 1rem' }}>
                  <div className="admin-two-col" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Section Label</span>
                      <input type="text" value={sec.label} onChange={(e) => updateSection(secIdx, 'label', e.target.value)} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Summary (inline after title)</span>
                      <input type="text" value={sec.summary || ''} onChange={(e) => updateSection(secIdx, 'summary', e.target.value)} placeholder="e.g. (IEEE papers = 48, ISCA = 27)" />
                    </label>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={sec.groupByYear === true}
                      onChange={(e) => {
                        updateSection(secIdx, 'groupByYear', e.target.checked);
                        onNotify?.('Publication grouping updated. Click Save Publications to publish changes.', 'info');
                      }}
                    />
                    Group entries by Year sub-headings
                  </label>

                  {/* Entries list */}
                  {sec.entries.map((ent, entIdx) => {
                    const isEntExpanded = expandedEntry === `${secIdx}-${entIdx}`;
                    const preview = ent.text ? ent.text.replace(/<[^>]*>/g, '').slice(0, 80) : '(empty)';
                    return (
                      <div key={ent.id} className={`admin-subcard ${ent.visible === false ? 'is-hidden' : ''}`}>
                        {/* Entry header */}
                        <div
                          className="admin-subcard-header"
                          onClick={() => setExpandedEntry(isEntExpanded ? null : `${secIdx}-${entIdx}`)}
                        >
                          <div className="admin-collapsible-main" style={{ flex: 1, minWidth: 0 }}>
                            <span className="admin-chevron">{isEntExpanded ? '▾' : '▸'}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>#{entIdx + 1}</span>
                            {ent.year && <span className="admin-year-chip">{ent.year}</span>}
                            <span style={{ fontSize: '0.8rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preview}</span>
                            {ent.visible === false && <span className="admin-hidden-chip">HIDDEN</span>}
                          </div>
                          <div className="admin-collapsible-actions" onClick={(e) => e.stopPropagation()}>
                            <button type="button" disabled={entIdx === 0} onClick={() => moveEntry(secIdx, entIdx, -1)} style={{ padding: '0.1rem 0.35rem', fontSize: '0.7rem' }}>↑</button>
                            <button type="button" disabled={entIdx === sec.entries.length - 1} onClick={() => moveEntry(secIdx, entIdx, 1)} style={{ padding: '0.1rem 0.35rem', fontSize: '0.7rem' }}>↓</button>
                            <button type="button" onClick={() => updateEntry(secIdx, entIdx, 'visible', !ent.visible)} style={{ padding: '0.1rem 0.35rem', fontSize: '0.7rem' }}>
                              {ent.visible !== false ? '👁' : '👁‍🗨'}
                            </button>
                            <button type="button" className="admin-delete-btn" style={{ fontSize: '0.7rem', padding: '0.1rem 0.35rem' }} onClick={() => removeEntry(secIdx, entIdx)}>✕</button>
                          </div>
                        </div>

                        {/* Expanded entry editor */}
                        {isEntExpanded && (
                          <div style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid #eee' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', width: '100px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Year</span>
                                <input type="text" value={ent.year || ''} onChange={(e) => updateEntry(secIdx, entIdx, 'year', e.target.value)} placeholder="2025" style={{ width: '100%' }} />
                              </label>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.15rem' }}>Citation Text (HTML)</span>
                                <RichTextArea
                                  value={ent.text || ''}
                                  onChange={(val) => updateEntry(secIdx, entIdx, 'text', val)}
                                  rows={4}
                                  placeholder="Full citation with HTML formatting. Use toolbar for bold/italic/links."
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button type="button" className="admin-card-btn" style={{ fontSize: '0.85rem' }} onClick={() => addEntry(secIdx)}>+ Add Entry</button>
                </div>
              )}
              </div>
            );
          })}
        </div>

        <button type="button" className="admin-card-btn" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }} onClick={addSection}>+ Add Section</button>
      </div>

      <button type="submit" disabled={saving} className="admin-save-btn" style={{ marginTop: '1rem' }}>{saving ? 'Saving…' : 'Save Publications'}</button>
    </form>
  );
}

function ContactFormEditor({ data, onSave, saving, onNotify }) {
  const DEFAULT_HEADER = { visible: true, logoUrl: '', title: 'Privacy Aware & Intelligent System Modeling (PRISM) Lab', subtitle: 'University of North Texas' };
  const DEFAULT_MEMBERS = { visible: true, label: 'Lab Members', people: [] };
  const DEFAULT_MAP = {
    visible: true, mapEmbedSrc: '',
    addressLines: ['Department of Information Science', 'Discovery Park, 3940 N. Elm St., Suite E290G', 'Denton, Texas 76201'],
    addressUrl: '', mapLinks: [],
  };
  const DEFAULT_LAB = { visible: true, room: 'Discovery Park E290G', department: 'Department of Data Science', email: 'prism-lab@unt.edu', phone: '1-940-565-2605' };

  const [header, setHeader] = useState({ ...DEFAULT_HEADER, ...(data?.header || {}) });
  const [members, setMembers] = useState({ ...DEFAULT_MEMBERS, ...(data?.members || {}), people: data?.members?.people ?? [] });
  const [map, setMap] = useState({ ...DEFAULT_MAP, ...(data?.map || {}), addressLines: data?.map?.addressLines ?? DEFAULT_MAP.addressLines, mapLinks: data?.map?.mapLinks ?? [] });
  const [lab, setLab] = useState({ ...DEFAULT_LAB, ...(data?.labDetails || {}) });
  const [openSection, setOpenSection] = useState('header');
  const [openMember, setOpenMember] = useState(null);
  const [memberPhotoUploading, setMemberPhotoUploading] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    setHeader({ ...DEFAULT_HEADER, ...(data?.header || {}) });
    setMembers({ ...DEFAULT_MEMBERS, ...(data?.members || {}), people: data?.members?.people ?? [] });
    setMap({ ...DEFAULT_MAP, ...(data?.map || {}), addressLines: data?.map?.addressLines ?? DEFAULT_MAP.addressLines, mapLinks: data?.map?.mapLinks ?? [] });
    setLab({ ...DEFAULT_LAB, ...(data?.labDetails || {}) });
  }, [data]);

  function handleSubmit(e) {
    e.preventDefault();
    // Auto-extract src from iframe tags before saving
    const cleanMap = { ...map, mapEmbedSrc: extractMapSrc(map.mapEmbedSrc) };
    onSave({ header, members, map: cleanMap, labDetails: lab });
  }

  function uid() { return 'mem-' + Date.now() + '-' + Math.round(Math.random() * 1e6); }

  /** Extract src URL from full <iframe> HTML or return as-is */
  function extractMapSrc(raw) {
    if (!raw) return '';
    const trimmed = raw.trim();
    if (trimmed.startsWith('<')) {
      const m = trimmed.match(/src=["']([^"']+)["']/i);
      return m ? m[1] : '';
    }
    return trimmed;
  }

  function handleMapEmbedChange(val) {
    // Store whatever user types, but display will auto-extract the src
    setMap((m) => ({ ...m, mapEmbedSrc: val }));
  }

  // -- Logo upload --
  function handleLogoUpload(e) {
    const file = e.target?.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    uploadContactMemberPhoto(file)
      .then(({ imageUrl }) => {
        setHeader((h) => ({ ...h, logoUrl: imageUrl }));
        onNotify?.('Header logo uploaded successfully.', 'success');
      })
      .catch((err) => onNotify?.(err.message, 'error'))
      .finally(() => setLogoUploading(false));
  }

  // -- Member photo upload --
  function handleMemberPhotoUpload(memberId, e) {
    const file = e.target?.files?.[0];
    if (!file) return;
    setMemberPhotoUploading(memberId);
    uploadContactMemberPhoto(file)
      .then(({ imageUrl }) => {
        setMembers((m) => ({
          ...m,
          people: m.people.map((p) => p.id === memberId ? { ...p, imageUrl } : p),
        }));
        onNotify?.('Member photo uploaded successfully.', 'success');
      })
      .catch((err) => onNotify?.(err.message, 'error'))
      .finally(() => setMemberPhotoUploading(null));
  }

  // -- Members CRUD --
  function addMember() {
    const newMember = { id: uid(), name: '', title: '', email: '', phone: '', imageUrl: '', visible: true };
    setMembers((m) => ({ ...m, people: [...m.people, newMember] }));
    setOpenMember(newMember.id);
  }

  function updateMember(id, field, value) {
    setMembers((m) => ({ ...m, people: m.people.map((p) => p.id === id ? { ...p, [field]: value } : p) }));
  }

  function removeMember(id) {
    if (!confirm('Remove this member?')) return;
    setMembers((m) => ({ ...m, people: m.people.filter((p) => p.id !== id) }));
  }

  function moveMember(idx, dir) {
    const arr = [...members.people];
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    setMembers((m) => ({ ...m, people: arr }));
  }

  // -- Map links CRUD --
  function addMapLink() { setMap((m) => ({ ...m, mapLinks: [...m.mapLinks, { label: '', url: '' }] })); }
  function updateMapLink(idx, field, value) {
    setMap((m) => ({ ...m, mapLinks: m.mapLinks.map((l, i) => i === idx ? { ...l, [field]: value } : l) }));
  }
  function removeMapLink(idx) { setMap((m) => ({ ...m, mapLinks: m.mapLinks.filter((_, i) => i !== idx) })); }

  // -- Address lines CRUD --
  function addAddressLine() { setMap((m) => ({ ...m, addressLines: [...m.addressLines, ''] })); }
  function updateAddressLine(idx, value) {
    setMap((m) => ({ ...m, addressLines: m.addressLines.map((l, i) => i === idx ? value : l) }));
  }
  function removeAddressLine(idx) { setMap((m) => ({ ...m, addressLines: m.addressLines.filter((_, i) => i !== idx) })); }

  const sectionStyle = (id) => ({
    border: '1px solid #ddd', borderRadius: '8px', marginBottom: '0.75rem', overflow: 'hidden',
  });
  const sectionHeaderStyle = (id) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem',
    background: openSection === id ? '#e8f5e9' : '#fafafa', cursor: 'pointer', fontWeight: 600,
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Header Section ── */}
      <div style={sectionStyle('header')}>
        <div style={sectionHeaderStyle('header')} onClick={() => setOpenSection(openSection === 'header' ? null : 'header')}>
          <span>{openSection === 'header' ? '▼' : '▶'} Header (Logo + Title)</span>
          <label onClick={(e) => e.stopPropagation()} style={{ fontWeight: 400, fontSize: '0.85rem' }}>
            <input type="checkbox" checked={header.visible} onChange={(e) => setHeader((h) => ({ ...h, visible: e.target.checked }))} /> Visible
          </label>
        </div>
        {openSection === 'header' && (
          <div style={{ padding: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Logo</span>
              {header.logoUrl && <img src={header.logoUrl} alt="Logo" style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8, marginBottom: '0.5rem', display: 'block' }} />}
              <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={logoUploading} />
              {logoUploading && <small>Uploading…</small>}
              <input type="text" value={header.logoUrl} onChange={(e) => setHeader((h) => ({ ...h, logoUrl: e.target.value }))} placeholder="Or paste logo URL" style={{ width: '100%', marginTop: '0.25rem' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600 }}>Title</span>
              <input type="text" value={header.title} onChange={(e) => setHeader((h) => ({ ...h, title: e.target.value }))} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'block' }}>
              <span style={{ fontWeight: 600 }}>Subtitle</span>
              <input type="text" value={header.subtitle} onChange={(e) => setHeader((h) => ({ ...h, subtitle: e.target.value }))} style={{ width: '100%' }} />
            </label>
          </div>
        )}
      </div>

      {/* ── Members Section ── */}
      <div style={sectionStyle('members')}>
        <div style={sectionHeaderStyle('members')} onClick={() => setOpenSection(openSection === 'members' ? null : 'members')}>
          <span>{openSection === 'members' ? '▼' : '▶'} Members ({members.people.length})</span>
          <label onClick={(e) => e.stopPropagation()} style={{ fontWeight: 400, fontSize: '0.85rem' }}>
            <input type="checkbox" checked={members.visible} onChange={(e) => setMembers((m) => ({ ...m, visible: e.target.checked }))} /> Visible
          </label>
        </div>
        {openSection === 'members' && (
          <div style={{ padding: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600 }}>Section Label</span>
              <input type="text" value={members.label} onChange={(e) => setMembers((m) => ({ ...m, label: e.target.value }))} style={{ width: '100%' }} />
            </label>
            {members.people.map((person, idx) => (
              <div key={person.id} style={{ border: '1px solid #eee', borderRadius: 6, marginBottom: '0.5rem', overflow: 'hidden' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: openMember === person.id ? '#f0f7f0' : '#fafafa', cursor: 'pointer' }}
                  onClick={() => setOpenMember(openMember === person.id ? null : person.id)}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {openMember === person.id ? '▼' : '▶'} {person.name || '(Unnamed)'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.25rem' }} onClick={(e) => e.stopPropagation()}>
                    <button type="button" onClick={() => moveMember(idx, -1)} disabled={idx === 0} title="Move up" style={{ padding: '2px 6px' }}>↑</button>
                    <button type="button" onClick={() => moveMember(idx, 1)} disabled={idx === members.people.length - 1} title="Move down" style={{ padding: '2px 6px' }}>↓</button>
                    <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="checkbox" checked={person.visible !== false} onChange={(e) => updateMember(person.id, 'visible', e.target.checked)} /> Visible
                    </label>
                    <button type="button" onClick={() => removeMember(person.id)} className="admin-delete-btn" style={{ padding: '2px 8px', fontSize: '0.8rem' }}>✕</button>
                  </div>
                </div>
                {openMember === person.id && (
                  <div style={{ padding: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Photo</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                        {person.imageUrl && <img src={person.imageUrl} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ccc' }} />}
                        <input type="file" accept="image/*" onChange={(e) => handleMemberPhotoUpload(person.id, e)} disabled={memberPhotoUploading === person.id} />
                        {memberPhotoUploading === person.id && <small>Uploading…</small>}
                      </div>
                    </div>
                    <label><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Name</span>
                      <input type="text" value={person.name} onChange={(e) => updateMember(person.id, 'name', e.target.value)} style={{ width: '100%' }} />
                    </label>
                    <label><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Title / Role</span>
                      <input type="text" value={person.title} onChange={(e) => updateMember(person.id, 'title', e.target.value)} style={{ width: '100%' }} />
                    </label>
                    <label><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Email</span>
                      <input type="text" value={person.email} onChange={(e) => updateMember(person.id, 'email', e.target.value)} style={{ width: '100%' }} />
                    </label>
                    <label><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Phone</span>
                      <input type="text" value={person.phone} onChange={(e) => updateMember(person.id, 'phone', e.target.value)} style={{ width: '100%' }} />
                    </label>
                  </div>
                )}
              </div>
            ))}
            <button type="button" onClick={addMember} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'var(--unt-green)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              + Add Member
            </button>
          </div>
        )}
      </div>

      {/* ── Map Section ── */}
      <div style={sectionStyle('map')}>
        <div style={sectionHeaderStyle('map')} onClick={() => setOpenSection(openSection === 'map' ? null : 'map')}>
          <span>{openSection === 'map' ? '▼' : '▶'} Map &amp; Location</span>
          <label onClick={(e) => e.stopPropagation()} style={{ fontWeight: 400, fontSize: '0.85rem' }}>
            <input type="checkbox" checked={map.visible} onChange={(e) => setMap((m) => ({ ...m, visible: e.target.checked }))} /> Visible
          </label>
        </div>
        {openSection === 'map' && (
          <div style={{ padding: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600 }}>Google Maps Embed</span>
              <small style={{ display: 'block', color: '#888', marginBottom: '0.25rem' }}>Paste the full &lt;iframe&gt; embed code OR just the src URL from Google Maps → Share → Embed a map</small>
              <textarea rows={3} value={map.mapEmbedSrc} onChange={(e) => handleMapEmbedChange(e.target.value)} placeholder='Paste <iframe src="https://www.google.com/maps/embed?pb=..."></iframe> or just the URL' style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.82rem' }} />
              {extractMapSrc(map.mapEmbedSrc) && (
                <div style={{ marginTop: '0.5rem', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', background: '#f0f0f0' }}>
                  <small style={{ display: 'block', padding: '0.25rem 0.5rem', color: '#888' }}>Map Preview:</small>
                  <iframe title="Map preview" src={extractMapSrc(map.mapEmbedSrc)} style={{ width: '100%', height: 200, border: 0 }} loading="lazy" />
                </div>
              )}
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600 }}>Address Link URL</span>
              <input type="text" value={map.addressUrl} onChange={(e) => setMap((m) => ({ ...m, addressUrl: e.target.value }))} placeholder="https://www.google.com/maps/..." style={{ width: '100%' }} />
            </label>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 600 }}>Address Lines</span>
              {map.addressLines.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <input type="text" value={line} onChange={(e) => updateAddressLine(i, e.target.value)} style={{ flex: 1 }} />
                  <button type="button" onClick={() => removeAddressLine(i)} className="admin-delete-btn" style={{ padding: '2px 8px' }}>✕</button>
                </div>
              ))}
              <button type="button" onClick={addAddressLine} style={{ marginTop: '0.35rem', fontSize: '0.85rem', color: 'var(--unt-green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+ Add line</button>
            </div>
            <div>
              <span style={{ fontWeight: 600 }}>Map / Direction Links</span>
              {map.mapLinks.map((link, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <input type="text" value={link.label} onChange={(e) => updateMapLink(i, 'label', e.target.value)} placeholder="Label" style={{ flex: 1 }} />
                  <input type="text" value={link.url} onChange={(e) => updateMapLink(i, 'url', e.target.value)} placeholder="URL" style={{ flex: 1 }} />
                  <button type="button" onClick={() => removeMapLink(i)} className="admin-delete-btn" style={{ padding: '2px 8px' }}>✕</button>
                </div>
              ))}
              <button type="button" onClick={addMapLink} style={{ marginTop: '0.35rem', fontSize: '0.85rem', color: 'var(--unt-green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+ Add link</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Lab Details Section ── */}
      <div style={sectionStyle('lab')}>
        <div style={sectionHeaderStyle('lab')} onClick={() => setOpenSection(openSection === 'lab' ? null : 'lab')}>
          <span>{openSection === 'lab' ? '▼' : '▶'} Lab Details</span>
          <label onClick={(e) => e.stopPropagation()} style={{ fontWeight: 400, fontSize: '0.85rem' }}>
            <input type="checkbox" checked={lab.visible} onChange={(e) => setLab((l) => ({ ...l, visible: e.target.checked }))} /> Visible
          </label>
        </div>
        {openSection === 'lab' && (
          <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
            <label><span style={{ fontWeight: 600 }}>Room</span>
              <input type="text" value={lab.room} onChange={(e) => setLab((l) => ({ ...l, room: e.target.value }))} style={{ width: '100%' }} />
            </label>
            <label><span style={{ fontWeight: 600 }}>Department</span>
              <input type="text" value={lab.department} onChange={(e) => setLab((l) => ({ ...l, department: e.target.value }))} style={{ width: '100%' }} />
            </label>
            <label><span style={{ fontWeight: 600 }}>Email</span>
              <input type="text" value={lab.email} onChange={(e) => setLab((l) => ({ ...l, email: e.target.value }))} style={{ width: '100%' }} />
            </label>
            <label><span style={{ fontWeight: 600 }}>Phone</span>
              <input type="text" value={lab.phone} onChange={(e) => setLab((l) => ({ ...l, phone: e.target.value }))} style={{ width: '100%' }} />
            </label>
          </div>
        )}
      </div>

      <button type="submit" disabled={saving} className="admin-save-btn" style={{ marginTop: '1rem' }}>{saving ? 'Saving…' : 'Save Contact'}</button>
    </form>
  );
}

const SECTION_HINTS = {};

function JsonEditor({ data, onSave, saving, rows = 8, hint, onNotify }) {
  const [value, setValue] = useState(JSON.stringify(data ?? {}, null, 2));
  const [showHint, setShowHint] = useState(false);
  useEffect(() => { setValue(JSON.stringify(data ?? {}, null, 2)); }, [data]);

  function handleSubmit(e) {
    e.preventDefault();
    try {
      onSave(JSON.parse(value));
    } catch {
      onNotify?.('Invalid JSON format. Please fix and try again.', 'error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {hint && (
        <div className="admin-hint">
          <button type="button" className="admin-hint-toggle" onClick={() => setShowHint(!showHint)}>
            {showHint ? 'Hide' : 'Show'} structure hint
          </button>
          {showHint && <div className="admin-hint-text"><strong>{hint.title}</strong>: {hint.text}</div>}
        </div>
      )}
      <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={rows} className="admin-json-input" />
      <button type="submit" disabled={saving} className="admin-save-btn">{saving ? 'Saving…' : 'Save'}</button>
    </form>
  );
}

function ImageUploadBlock({ label, imageUrl, onUpload, uploading, cacheBust }) {
  const src = imageUrl ? (imageUrl + (imageUrl.includes('?') ? '&' : '?') + 'v=' + (cacheBust ?? 0)) : '';
  return (
    <div className="admin-image-block">
      <span className="admin-image-label">{label}</span>
      <div className="admin-image-preview">
        {src ? <img src={src} alt="" /> : <div className="admin-image-placeholder">No image</div>}
      </div>
      <form onSubmit={onUpload} className="admin-image-upload">
        <input type="file" name="photo" accept="image/*" required />
        <button type="submit" disabled={uploading}>{uploading ? 'Uploading…' : 'Upload'}</button>
      </form>
    </div>
  );
}

function NavigationSection({ onError, onNotify }) {
  const [location, setLocation] = useState('sidebar');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addForm, setAddForm] = useState({ label: '', path: '', parent_id: '' });
  const [editForm, setEditForm] = useState({ label: '', path: '', is_visible: true });

  function loadNav() {
    setLoading(true);
    getAdminNav(location)
      .then((list) => { setItems(Array.isArray(list) ? list : []); onError?.(''); })
      .catch((err) => onError?.(err?.message || String(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadNav(); }, [location]);

  function buildTree(list) {
    const top = (list || []).filter((i) => !i.parent_id).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    const byParent = {};
    (list || []).filter((i) => i.parent_id).forEach((c) => {
      if (!byParent[c.parent_id]) byParent[c.parent_id] = [];
      byParent[c.parent_id].push(c);
    });
    return top.map((t) => ({
      ...t,
      children: (byParent[t.id] || []).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    }));
  }

  const tree = buildTree(items);

  function handleAdd(e) {
    e.preventDefault();
    if (!addForm.label || !addForm.path) { onError?.('Label and path required'); return; }
    setAdding(true);
    onError?.('');
    postNavItem({
      location,
      parent_id: addForm.parent_id || null,
      label: addForm.label.trim(),
      path: addForm.path.trim(),
      is_visible: true,
    })
      .then(() => {
        setAddForm({ label: '', path: '', parent_id: '' });
        loadNav();
        onNotify?.('Navigation link added successfully.', 'success');
      })
      .catch((err) => onError?.(err.message))
      .finally(() => setAdding(false));
  }

  function handleUpdate(id) {
    setSaving(true);
    onError?.('');
    const payload = {
      label: String(editForm.label || '').trim(),
      path: String(editForm.path || '').trim(),
      is_visible: editForm.is_visible === true,
    };
    putNavItem(id, { ...payload, location })
      .then(() => {
        setEditingId(null);
        loadNav();
        onNotify?.('Navigation link updated successfully.', 'success');
      })
      .catch((err) => onError?.(err?.message || String(err)))
      .finally(() => setSaving(false));
  }

  function handleDelete(id) {
    if (!confirm('Delete this item?')) return;
    setSaving(true);
    onError?.('');
    deleteNavItem(id, location)
      .then(() => {
        loadNav();
        onNotify?.('Navigation link deleted successfully.', 'success');
      })
      .catch((err) => onError?.(err?.message || String(err)))
      .finally(() => setSaving(false));
  }

  function handleToggleVisible(item) {
    setSaving(true);
    onError?.('');
    putNavItem(item.id, { is_visible: !item.is_visible, location })
      .then(() => {
        loadNav();
        onNotify?.('Navigation visibility updated.', 'info');
      })
      .catch((err) => onError?.(err?.message || String(err)))
      .finally(() => setSaving(false));
  }

  const topLevelIds = tree.map((t) => t.id);

  return (
    <div className="admin-nav-section">
      <div className="admin-media-tabs">
        <button type="button" className={location === 'sidebar' ? 'active' : ''} onClick={() => setLocation('sidebar')}>Sidebar</button>
        <button type="button" className={location === 'navbar' ? 'active' : ''} onClick={() => setLocation('navbar')}>Navbar</button>
      </div>
      <p className="admin-section-note">Add, edit, hide, or remove links. Changes apply to the live site.</p>

      <div className="admin-nav-add">
        <h3>Add new link</h3>
        <form onSubmit={handleAdd} className="admin-nav-form">
          <input
            type="text"
            placeholder="Label (e.g. Home)"
            value={addForm.label}
            onChange={(e) => setAddForm((f) => ({ ...f, label: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Path (e.g. / or /about)"
            value={addForm.path}
            onChange={(e) => setAddForm((f) => ({ ...f, path: e.target.value }))}
          />
          <select
            value={addForm.parent_id}
            onChange={(e) => setAddForm((f) => ({ ...f, parent_id: e.target.value }))}
          >
            <option value="">— Top level —</option>
            {topLevelIds.map((id) => {
              const p = items.find((i) => i.id === id);
              return p ? <option key={id} value={id}>{p.label}</option> : null;
            })}
          </select>
          <button type="submit" disabled={adding}>{adding ? 'Adding…' : 'Add'}</button>
        </form>
      </div>

      <div className="admin-nav-list">
        <h3>Current links</h3>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul className="admin-nav-tree">
            {tree.map((item) => (
              <NavItemRow
                key={item.id}
                item={item}
                editingId={editingId}
                editForm={editForm}
                setEditForm={setEditForm}
                setEditingId={setEditingId}
                saving={saving}
                onEdit={() => { setEditForm({ label: item.label, path: item.path, is_visible: item.is_visible !== false }); setEditingId(item.id); }}
                onSave={() => handleUpdate(item.id)}
                onCancel={() => setEditingId(null)}
                onDelete={() => handleDelete(item.id)}
                onToggle={() => handleToggleVisible(item)}
                onUpdate={handleUpdate}
                onDeleteItem={handleDelete}
                onToggleItem={handleToggleVisible}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function NavItemRow({ item, editingId, editForm, setEditForm, setEditingId, saving, onEdit, onSave, onCancel, onDelete, onToggle, onUpdate, onDeleteItem, onToggleItem }) {
  const isEditing = editingId === item.id;
  const hasChildren = item.children && item.children.length > 0;

  function startEdit(it) {
    setEditForm({ label: it.label, path: it.path, is_visible: it.is_visible !== false });
    setEditingId(it.id);
  }

  return (
    <li className="admin-nav-tree-item">
      <div className={`admin-nav-row ${!item.is_visible ? 'hidden' : ''}`}>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editForm.label ?? ''}
              onChange={(e) => setEditForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="Label"
            />
            <input
              type="text"
              value={editForm.path ?? ''}
              onChange={(e) => setEditForm((f) => ({ ...f, path: e.target.value }))}
              placeholder="Path"
            />
            <label>
              <input
                type="checkbox"
                checked={editForm.is_visible === true}
                onChange={(e) => setEditForm((f) => ({ ...f, is_visible: e.target.checked }))}
              />
              Visible
            </label>
            <button type="button" onClick={onSave} disabled={saving} className="admin-save-btn">{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" onClick={onCancel} disabled={saving}>Cancel</button>
          </>
        ) : (
          <>
            <span className="admin-nav-label">{item.label}</span>
            <span className="admin-nav-path">{item.path}</span>
            <button type="button" onClick={onToggle} disabled={saving} className="admin-nav-btn" title={item.is_visible ? 'Hide' : 'Show'}>
              {item.is_visible ? '👁' : '👁‍🗨'}
            </button>
            <button type="button" onClick={onEdit} disabled={saving} className="admin-nav-btn">Edit</button>
            <button type="button" onClick={onDelete} disabled={saving} className="admin-delete-btn">Delete</button>
          </>
        )}
      </div>
      {hasChildren && (
        <ul className="admin-nav-tree admin-nav-tree--sub">
          {item.children.map((child) => (
            <NavItemRow
              key={child.id}
              item={child}
              editingId={editingId}
              editForm={editForm}
              setEditForm={setEditForm}
              setEditingId={setEditingId}
              saving={saving}
              onEdit={() => startEdit(child)}
              onSave={() => onUpdate(child.id)}
              onCancel={() => setEditingId(null)}
              onDelete={() => onDeleteItem(child.id)}
              onToggle={() => onToggleItem(child)}
              onUpdate={onUpdate}
              onDeleteItem={onDeleteItem}
              onToggleItem={onToggleItem}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function MediaSection({
  slides,
  content,
  contentVersion,
  uploadCaption,
  onUploadCaption,
  onUploadHero,
  onDeleteSlide,
  onHomeHeroUpload,
  onContactPhotoUpload,
  onSidebarPhotoUpload,
  homeHeroUploading,
  contactPhotoUploading,
  sidebarPhotoUploading,
}) {
  const [mediaTab, setMediaTab] = useState('hero');
  return (
    <div className="admin-media-section">
      <div className="admin-media-tabs">
        <button type="button" className={mediaTab === 'hero' ? 'active' : ''} onClick={() => setMediaTab('hero')}>Hero Slides</button>
        <button type="button" className={mediaTab === 'home' ? 'active' : ''} onClick={() => setMediaTab('home')}>Home Hero</button>
        <button type="button" className={mediaTab === 'contact' ? 'active' : ''} onClick={() => setMediaTab('contact')}>Contact Photo</button>
      </div>
      {mediaTab === 'hero' && (
        <div className="admin-media-panel">
          <h3>Add Hero Slide</h3>
          <form onSubmit={onUploadHero} className="admin-upload-form">
            <input type="file" name="image" accept="image/*" required />
            <input type="text" placeholder="Caption" value={uploadCaption} onChange={(e) => onUploadCaption(e.target.value)} />
            <button type="submit">Upload Slide</button>
          </form>
          <h3>Current Slides ({slides.length})</h3>
          <div className="admin-slides-grid">
            {slides.map((slide) => (
              <div key={slide.id} className="admin-slide-card">
                <img src={slide.imageUrl} alt="" />
                <span>{slide.caption || '—'}</span>
                <button type="button" className="admin-delete-btn" onClick={() => onDeleteSlide(slide.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {mediaTab === 'home' && (
        <div className="admin-media-panel">
          <ImageUploadBlock
            label="Home hero (full-width banner)"
            imageUrl={content?.home?.imageUrl}
            onUpload={onHomeHeroUpload}
            uploading={homeHeroUploading}
            cacheBust={contentVersion}
          />
        </div>
      )}
      {mediaTab === 'contact' && (
        <div className="admin-media-panel">
          <ImageUploadBlock
            label="Contact page photo (main profile image)"
            imageUrl={content?.contact?.imageUrl}
            onUpload={onContactPhotoUpload}
            uploading={contactPhotoUploading}
            cacheBust={contentVersion}
          />
          <ImageUploadBlock
            label="Sidebar profile photo"
            imageUrl={content?.contact?.sidebarImageUrl}
            onUpload={onSidebarPhotoUpload}
            uploading={sidebarPhotoUploading}
            cacheBust={contentVersion}
          />
        </div>
      )}
    </div>
  );
}
