/**
 * PrismLab View – full-width PRISM page with centered header, description,
 * dynamic Research Areas cards + modal, announcements, and mission section.
 *
 * Content (description paragraphs + research areas + announcements + mission) comes from the backend via
 * the PRISM Lab admin section (/api/prism). Defaults are used when the admin
 * hasn't saved any content yet.
 */
import { useEffect, useState } from 'react';
import { usePrismLabController } from '../../controllers/usePrismLabController.js';
import LinkifiedText from '../components/LinkifiedText.jsx';
import './PrismLab.css';

/* ── Defaults (used when admin hasn't edited content yet) ───── */

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

const TYPE_META = {
  hiring:      { badge: 'Hiring Announcement',      cls: 'badge-hiring' },
  publication: { badge: 'Publication Announcement',  cls: 'badge-publication' },
  celebration: { badge: 'Celebration Announcement',  cls: 'badge-celebration' },
  general:     { badge: 'Announcement',              cls: 'badge-general' },
};

/* ── Component ────────────────────────────────────────────────── */

export default function PrismLabView() {
  const { data, loading, error } = usePrismLabController();
  const [activeArea, setActiveArea] = useState(null);

  useEffect(() => {
    if (!activeArea) return;
    function onEsc(e) {
      if (e.key === 'Escape') setActiveArea(null);
    }
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [activeArea]);

  if (loading) return <div className="prism-body" style={{ padding: '3rem', textAlign: 'center' }}><p>Loading PRISM Lab…</p></div>;
  if (error) return <div className="prism-body" style={{ padding: '3rem', textAlign: 'center' }}><p>Error: {error}</p></div>;

  // Content from admin or defaults
  const paragraphs = Array.isArray(data?.paragraphs) && data.paragraphs.length
    ? data.paragraphs
    : DEFAULT_PARAGRAPHS;

  const allAnnouncements = Array.isArray(data?.announcements) && data.announcements.length
    ? data.announcements
    : DEFAULT_ANNOUNCEMENTS;

  const allResearchAreas = Array.isArray(data?.researchAreas) && data.researchAreas.length
    ? data.researchAreas
    : DEFAULT_RESEARCH_AREAS;

  const headerLogo = typeof data?.logoUrl === 'string' && data.logoUrl.trim()
    ? data.logoUrl.trim()
    : '/prismLogo.svg';
  const headerTitle = typeof data?.bannerText === 'string' && data.bannerText.trim()
    ? data.bannerText.trim()
    : 'Privacy Aware & Intelligent System Modeling (PRISM) Lab';
  const headerSubtitle = typeof data?.bannerSubtitle === 'string' && data.bannerSubtitle.trim()
    ? data.bannerSubtitle.trim()
    : 'University of North Texas';

  const missionVission = data?.missionVission && typeof data.missionVission === 'object'
    ? {
        ...DEFAULT_MISSION_VISSION,
        ...data.missionVission,
        paragraphs: Array.isArray(data?.missionVission?.paragraphs)
          ? data.missionVission.paragraphs
          : DEFAULT_MISSION_VISSION.paragraphs,
      }
    : DEFAULT_MISSION_VISSION;

  // Only show visible announcements; also respect showAnnouncements flag
  const showResearchAreas = data?.showResearchAreas !== false;
  const visibleResearchAreas = allResearchAreas.filter((item) => item.visible !== false);
  const showAnnouncements = data?.showAnnouncements !== false;
  const visibleAnnouncements = allAnnouncements.filter((a) => a.visible !== false);
  const showMissionVission = data?.showMissionVission !== false;
  const missionParagraphs = Array.isArray(missionVission?.paragraphs)
    ? missionVission.paragraphs.filter((p) => typeof p === 'string' && p.trim())
    : [];

  return (
    <div className="prism-body">
      {/* ─── Top centered logo + title ─── */}
      <div className="prism-hero-header">
        <img src={headerLogo} alt="PRISM Lab Logo" className="prism-logo-img" />
        <h1 className="prism-hero-title"><LinkifiedText text={headerTitle} keyPrefix="prism-header-title" /></h1>
        <p className="prism-hero-subtitle"><LinkifiedText text={headerSubtitle} keyPrefix="prism-header-subtitle" /></p>
      </div>

      {/* ─── Description ─── */}
      <div className="prism-hero-row">
        <div className="prism-text-col">
          {paragraphs.map((p, i) => (
            <p key={i}><LinkifiedText text={p} keyPrefix={`prism-paragraph-${i}`} /></p>
          ))}
        </div>
      </div>

      {/* ─── Research Areas (dynamic + modal) ─── */}
      {showResearchAreas && visibleResearchAreas.length > 0 && (
        <section className="prism-research" aria-label="Research Areas">
          <div className="prism-research-inner">
            <div className="prism-research-heading">
              <h2>
                Research Areas
                <span className="research-spark" />
              </h2>
            </div>

            <div className="prism-research-grid">
              {visibleResearchAreas.map((item, idx) => (
                <button
                  key={item.id || idx}
                  type="button"
                  className="prism-research-card"
                  onClick={() => setActiveArea(item)}
                >
                  <div className="prism-research-card-media">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title || 'Research area'} className="prism-research-card-image" />
                    ) : (
                      <div className="prism-research-card-icon">{item.title?.trim()?.charAt(0)?.toUpperCase() || 'R'}</div>
                    )}
                  </div>

                  <div className="prism-research-card-content">
                    <h3><LinkifiedText text={item.title} keyPrefix={`prism-area-title-${item.id || idx}`} /></h3>
                    <p><LinkifiedText text={item.summary} keyPrefix={`prism-area-summary-${item.id || idx}`} /></p>
                    <span className="prism-research-readmore">Click to view details</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Announcements (hideable from admin) ─── */}
      {showAnnouncements && visibleAnnouncements.length > 0 && (
        <div className="prism-announcements">
          <div className="prism-announcements-inner">
            <div className="prism-announce-heading">
              <h2>
                Announcements
                <span className="pulse-dot" />
              </h2>
            </div>

            <div className="prism-announce-list">
              {visibleAnnouncements.map((a, i) => {
                const meta = TYPE_META[a.type] || TYPE_META.general;
                return (
                  <div key={a.id || i} className="prism-announce-card">
                    <span className={`prism-announce-card-badge ${meta.cls}`}>{meta.badge}</span>
                    <h3><LinkifiedText text={a.title} keyPrefix={`prism-announcement-title-${a.id || i}`} /></h3>
                    <p><LinkifiedText text={a.body} keyPrefix={`prism-announcement-body-${a.id || i}`} /></p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showMissionVission && missionParagraphs.length > 0 && (
        <section className="prism-mission" aria-label="Mission and Vission">
          <div className="prism-mission-inner">
            <div className="prism-mission-heading">
              <h2>
                <LinkifiedText text={missionVission?.title || 'Mission and Vission'} keyPrefix="prism-mission-title" />
                <span className="mission-orbit" />
              </h2>
            </div>
            <div className="prism-mission-content">
              {missionParagraphs.map((p, idx) => (
                <p key={idx}><LinkifiedText text={p} keyPrefix={`prism-mission-paragraph-${idx}`} /></p>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeArea && (
        <div className="prism-modal-backdrop" onClick={() => setActiveArea(null)} role="presentation">
          <div
            className="prism-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeArea.title} details`}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="prism-modal-close" onClick={() => setActiveArea(null)} aria-label="Close details">×</button>
            <h3><LinkifiedText text={activeArea.title} keyPrefix="prism-modal-title" /></h3>
            {activeArea.summary ? <p className="prism-modal-summary"><LinkifiedText text={activeArea.summary} keyPrefix="prism-modal-summary" /></p> : null}
            <p className="prism-modal-details"><LinkifiedText text={activeArea.details || activeArea.summary || ''} keyPrefix="prism-modal-details" /></p>
          </div>
        </div>
      )}
    </div>
  );
}
