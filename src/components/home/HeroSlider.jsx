import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const FALLBACK = [
  {
    id: 1,
    titre: 'Découvrez nos instruments',
    sub_titre: 'Collection 2025',
    description: 'La plus grande sélection d\'instruments de musique au Maroc. Guitares, basses, claviers et plus.',
    link: '/produits',
    text_link: 'Explorer le catalogue',
    bg: 'linear-gradient(135deg, #1C1612 0%, #2C2218 50%, #3A2820 100%)',
  },
  {
    id: 2,
    titre: 'Livraison rapide partout',
    sub_titre: 'Offre spéciale',
    description: 'Livraison gratuite dès 500 MAD d\'achat. Paiement à la livraison disponible.',
    link: '/produits',
    text_link: 'Commander maintenant',
    bg: 'linear-gradient(135deg, #2A1E16 0%, #1C1612 60%, #0E0A06 100%)',
  },
];

export default function HeroSlider({ sliders = [] }) {
  const slides = sliders.length > 0 ? sliders : FALLBACK;

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 5500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      loop
      style={{ height: 520 }}
    >
      {slides.map(slide => (
        <SwiperSlide key={slide.id}>
          {slide.url ? (
            <div style={{ position: 'relative', height: '100%' }}>
              <img
                src={slide.url.startsWith('http') ? slide.url : `/storage/${slide.url}`}
                alt={slide.titre}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="hero-slide-overlay" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                <div className="page-wrap" style={{ width: '100%' }}>
                  <SlideContent slide={slide} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', background: slide.bg || '#1C1612', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
              {/* Decorative circles */}
              <div style={{ position: 'absolute', top: '-80px', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,31,48,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-60px', right: '25%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,147,122,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div className="page-wrap" style={{ width: '100%' }}>
                <SlideContent slide={slide} />
              </div>
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function SlideContent({ slide }) {
  return (
    <div style={{ maxWidth: 560 }} className="anim">
      {slide.sub_titre && (
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--rosegold)', marginBottom: 10 }}>
          {slide.sub_titre}
        </p>
      )}
      <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1px', color: 'rgba(243,237,225,0.95)', lineHeight: 1.18, marginBottom: 16 }}>
        {slide.titre}
      </h1>
      {slide.description && (
        <p style={{ fontSize: 15, color: 'rgba(237,229,216,0.60)', lineHeight: 1.7, marginBottom: 28 }}>
          {slide.description}
        </p>
      )}
      {slide.link && (
        <Link to={slide.link} className="btn-primary" style={{ fontSize: 14, padding: '12px 28px' }}>
          {slide.text_link || 'Découvrir'}
          <i className="bx bx-right-arrow-alt" style={{ fontSize: 18 }} />
        </Link>
      )}
    </div>
  );
}
