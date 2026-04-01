/**
 * HeroSection - Full-screen hero carousel + green bar (PRISM Lab page)
 * Bar text: Admin → Content → PRISM Lab → "Banner text (green bar)" or Page Title.
 */
import { useState, useEffect } from 'react';
import { useHeroController } from '../../controllers/useHeroController.js';
import { usePrismLabController } from '../../controllers/usePrismLabController.js';
import './HeroSection.css';

const HERO_BAR_TEXT_FALLBACK = 'Privacy Aware & Intelligent System Modeling (PRISM) Lab';

export default function HeroSection() {
  const { slides, loading } = useHeroController();
  const { data: prismData } = usePrismLabController();
  const [activeIndex, setActiveIndex] = useState(0);
  const barText = (prismData?.bannerText?.trim() || prismData?.title) ?? HERO_BAR_TEXT_FALLBACK;

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="hero-section">
      <div className="hero-section-slides">
        {loading || slides.length === 0 ? (
          <div className="hero-section-slide hero-section-placeholder active" />
        ) : (
          slides.map((slide, i) => (
            <div
              key={slide.id}
              className={'hero-section-slide' + (i === activeIndex ? ' active' : '')}
              style={{ backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : undefined }}
            />
          ))
        )}
      </div>
      {slides.length > 1 && (
        <div className="hero-section-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={'hero-dot' + (i === activeIndex ? ' active' : '')}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
      <div className="hero-section-bar">
        <span className="hero-section-text">{barText}</span>
      </div>
    </section>
  );
}
