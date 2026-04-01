/**
 * HomeHeroSection - Full-width hero image with name overlay (for Home page)
 * Uses home hero image (separate from Contact profile photo)
 */
import { useHomeController } from '../../controllers/useHomeController.js';
import './HomeHeroSection.css';

export default function HomeHeroSection() {
  const { data: homeData } = useHomeController();

  const heroLabel = homeData?.heroName && homeData?.heroTitle
    ? `${homeData.heroName} | ${homeData.heroTitle}`
    : homeData?.heroName
      ? `${homeData.heroName} | Assistant Professor in the Department of Data Science | Director of the PRISM Lab at UNT`
      : 'Pretom Roy Ovi, PhD | Assistant Professor in the Department of Data Science | Director of the PRISM Lab at UNT';
  const imageUrl = homeData?.imageUrl ?? '';

  return (
    <div
      className="home-hero-section"
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      <div className="home-hero-overlay">
        <h1 className="home-hero-name">{heroLabel}</h1>
      </div>
    </div>
  );
}
