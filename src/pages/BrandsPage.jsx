import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBrands } from '../api/productsApi';
import Loading from '../components/ui/Loading';

const PLACEHOLDER = 'https://placehold.co/200x100/faf9f6/b76e79?text=Marque';

// Image de fond artistique orientée lutherie/guitares d'exception pour le Hero Section
const HERO_BG = 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=cover';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrands()
      .then((res) => setBrands(res.data))
      .catch((err) => console.error("Erreur lors du chargement des marques:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div style={{ backgroundColor: '#F2EFE9', minHeight: '100vh', paddingBottom: 80 }}>
      
      <style>{`
        :root {
          --rosegold: #b76e79;
          --rosegold-light: rgba(183, 110, 121, 0.08);
          --txt-dark: #1a1a1a;
          --txt-muted: #5a5550;
          --border-color: rgba(183, 110, 121, 0.18);
        }

        /* ═══ HERO BANNER EN ALIGNEMENT PARFAIT AVEC LES AUTRES PAGES (62vh) ═══ */
        .brands-hero {
          position: relative;
          width: 100%;
          height: 62vh;
          min-height: 280px;
          background: url('${HERO_BG}') center/cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        
        .brands-hero::before {
          content: ''; 
          position: absolute; 
          top: 0; 
          left: 0; 
          right: 0; 
          height: 3px; 
          z-index: 5;
          background: linear-gradient(90deg, transparent, var(--rosegold), #d9929d, var(--rosegold), transparent);
        }

        .brands-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom, 
            rgba(15, 15, 15, 0.75) 0%, 
            rgba(20, 20, 20, 0.45) 45%, 
            rgba(26, 26, 26, 0.92) 100%
          );
          z-index: 1;
        }

        .brands-hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 0 24px;
          color: #FFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .8rem;
        }

        .hero-eyebrow {
          font-size: 10px; 
          font-weight: 700; 
          letter-spacing: .48em; 
          text-transform: uppercase;
          color: var(--rosegold);
          animation: fadeUp .55s ease both;
        }

        .hero-title {
          font-size: clamp(2.4rem, 6vw, 4.2rem); 
          font-weight: 800;
          letter-spacing: -0.03em; 
          line-height: 1.1;
          margin: 0;
          animation: fadeUp .55s .12s ease both;
        }
        .hero-title em { 
          font-style: italic; 
          font-weight: 300; 
          color: var(--rosegold); 
        }

        .hero-divider {
          width: 60px; 
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--rosegold), transparent);
          animation: fadeUp .55s .22s ease both;
        }

        .hero-sub {
          font-size: 12.5px; 
          font-weight: 500; 
          letter-spacing: .24em; 
          text-transform: uppercase;
          color: rgba(245, 245, 245, 0.6);
          animation: fadeUp .55s .3s ease both;
        }

        @keyframes fadeUp { 
          from { opacity: 0; transform: translateY(14px); } 
          to { opacity: 1; transform: translateY(0); } 
        }

        /* ═══ CARTES DES MARQUES STYLE BOUTIQUE ═══ */
        .brand-card {
          background-color: white;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          padding: 32px 24px;
          text-align: center;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          height: 100%;
        }
        
        .brand-card:hover {
          transform: translateY(-8px);
          border-color: var(--rosegold);
          box-shadow: 0 15px 35px rgba(183, 110, 121, 0.14);
        }

        .brand-logo-container {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          width: 100%;
        }

        .brand-logo-img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          filter: grayscale(100%);
          opacity: 0.65;
          transition: all 0.4s ease;
        }

        .brand-card:hover .brand-logo-img {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.06);
        }

        .brand-badge {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--rosegold);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          background-color: var(--rosegold-light);
          padding: 6px 14px;
          border-radius: 30px;
          display: inline-block;
          margin-top: auto;
          transition: all 0.3s;
        }

        .brand-card:hover .brand-badge {
          background-color: var(--rosegold);
          color: white;
        }

        .section-header {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 45px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 16px;
        }
      `}</style>

      {/* ═══ HERO SECTION PREMIUM ═══ */}
      <header className="brands-hero">
        <div className="brands-hero-overlay" />
        <div className="brands-hero-content">
          <span className="hero-eyebrow">Music Store — Manufactures</span>
          <h1 className="hero-title">Nos <em>Marques</em></h1>
          <div className="hero-divider" />
          <p className="hero-sub">Partenaires Officiels & Créateurs de Prestige</p>
        </div>
      </header>

      {/* ═══ SECTION GRILLE DES MARQUES ═══ */}
      <div className="max-w-7xl mx-auto px-6" style={{ marginTop: 80 }}>
        
        {/* En-tête de section discret */}
        <div className="section-header">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--rosegold)', display: 'block', marginBottom: '.4rem' }}>
              Explorez l'excellence
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--txt-dark)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>
              Signatures de <em>Légende</em>
            </h2>
          </div>
          <p style={{ color: 'var(--txt-muted)', fontSize: '13px', margin: 0, fontWeight: 500 }}>
            Parcourez notre répertoire de <strong style={{ color: 'var(--txt-dark)' }}>{brands.length} ateliers</strong> agréés
          </p>
        </div>

        {/* Grille responsive de cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {brands.map((brand) => (
            <Link 
              key={brand.id} 
              to={`/produits?brand=${brand.id}`}
              className="brand-card"
            >
              <div className="brand-logo-container">
                {brand.logo ? (
                  <img 
                    src={brand.logo.startsWith('http') ? brand.logo : `/storage/${brand.logo}`}
                    alt={brand.nom} 
                    className="brand-logo-img"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER; }} 
                  />
                ) : (
                  <div 
                    style={{ 
                      backgroundColor: '#FAF9F6', 
                      border: '1px solid var(--border-color)', 
                      width: 60, 
                      height: 60, 
                      borderRadius: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--rosegold)' }}>
                      {brand.nom ? brand.nom[0].toUpperCase() : 'M'}
                    </span>
                  </div>
                )}
              </div>
              
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--txt-dark)', margin: '0 0 8px 0', letterSpacing: '-0.2px' }}>
                {brand.nom}
              </h3>
              
              {brand.description && (
                <p style={{ fontSize: '12.5px', color: 'var(--txt-muted)', marginTop: 0, marginBottom: '20px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', opacity: 0.85 }}>
                  {brand.description}
                </p>
              )}
              
              <span className="brand-badge">
                {brand.products_count} instrument{brand.products_count !== 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}