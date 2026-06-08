import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/productsApi';
import Loading from '../components/ui/Loading';

const PLACEHOLDER = 'https://placehold.co/400x250/faf9f6/b76e79?text=Instrument';

// Image de fond artistique (Piano de prestige / Clavier acoustique) pour le Hero Section
const HERO_BG = 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1600&auto=format&fit=cover';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data))
      .catch(err => console.error("Erreur lors du chargement des catégories :", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <style>{`
        :root {
          --rosegold: #b76e79;
          --rosegold-light: rgba(183, 110, 121, 0.08);
          --rosegold-hover: #a15b66;
          --txt-dark: #1a1a1a;
          --txt-muted: #5a5550;
          --border-color: rgba(183, 110, 121, 0.18);
        }
        
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        /* ═══ HERO PREMIUM INSPIRÉ DE LA PAGE CONTACT ═══ */
        .hero {
          position: relative;
          height: 62vh; 
          min-height: 280px;
          background-image: url('${HERO_BG}');
          background-size: cover;
          background-position: center;
        }
        .hero::before {
          content: ''; 
          position: absolute; 
          top: 0; 
          left: 0; 
          right: 0; 
          height: 3px; 
          z-index: 5;
          background: linear-gradient(90deg, transparent, var(--rosegold), #d9929d, var(--rosegold), transparent);
        }
        .hero::after {
          content: ''; 
          position: absolute; 
          inset: 0;
          background: linear-gradient(to bottom, rgba(15,15,15,0.75) 0%, rgba(20,20,20,0.45) 45%, rgba(26,26,26,0.92) 100%);
        }

        .hero-body {
          position: absolute; 
          inset: 0; 
          z-index: 6;
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center;
          text-align: center; 
          gap: .8rem; 
          padding: 0 20px;
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
          color: #FFF; 
          letter-spacing: -0.03em; 
          line-height: 1.1;
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

        /* ═══ SECTION CONTENU ═══ */
        .main-section { 
          padding: 80px 0 100px; 
          background: #F2EFE9; 
        }
        .c-wrap { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 20px; 
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

        .sec-eyebrow { 
          font-size: 11px; 
          font-weight: 700; 
          letter-spacing: .25em; 
          text-transform: uppercase; 
          color: var(--rosegold); 
          display: block; 
          margin-bottom: .4rem; 
        }
        .sec-title { 
          font-size: clamp(1.8rem, 3vw, 2.4rem); 
          font-weight: 800; 
          color: var(--txt-dark); 
          letter-spacing: -0.02em; 
          line-height: 1.1; 
          margin: 0; 
        }
        .sec-title em { 
          font-style: italic; 
          font-weight: 400; 
          color: var(--rosegold); 
        }

        /* ═══ CARTES DES CATÉGORIES ═══ */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 30px;
        }
        @media (max-width: 400px) { .cat-grid { grid-template-columns: 1fr; } }

        .cat-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,.02);
          display: flex;
          flex-direction: column;
          transition: border-color .3s, box-shadow .3s, transform .3s;
        }
        .cat-card:hover {
          border-color: var(--rosegold);
          box-shadow: 0 12px 35px rgba(183, 110, 121, 0.12);
          transform: translateY(-6px);
        }

        .cat-img-wrap {
          width: 100%;
          height: 190px;
          overflow: hidden;
          position: relative;
        }
        .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .5s ease;
        }
        .cat-card:hover .cat-img {
          transform: scale(1.05);
        }

        .cat-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .cat-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .cat-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--txt-dark);
          letter-spacing: -0.01em;
        }
        .cat-badge {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .05em;
          color: var(--rosegold);
          background: var(--rosegold-light);
          padding: 4px 12px;
          border-radius: 30px;
          text-transform: uppercase;
        }

        /* SOUS-CATÉGORIES */
        .sub-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }
        .sub-link {
          font-size: 11.5px;
          font-weight: 500;
          color: var(--txt-muted);
          background: #faf9f6;
          border: 1px solid var(--border-color);
          padding: 5px 12px;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .sub-link:hover {
          border-color: var(--rosegold);
          color: var(--txt-dark);
          background: var(--rosegold-light);
        }

        /* BOUTON ACTION */
        .cat-btn {
          width: 100%;
          padding: .8rem;
          background: var(--txt-dark);
          border: 1.5px solid var(--txt-dark);
          border-radius: 8px;
          color: white;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .05em;
          text-decoration: none;
          text-align: center;
          display: block;
          margin-top: auto;
          transition: background .25s, border-color .25s, color .25s;
        }
        .cat-card:hover .cat-btn {
          background: var(--rosegold);
          border-color: var(--rosegold);
          color: white;
        }
      `}</style>

      {/* ═══ HERO BANNER (Inspiré du Slider/Contact sans changement de police) ═══ */}
      <header className="hero">
        <div className="hero-body">
          <span className="hero-eyebrow">Music Store — Collections</span>
          <h1 className="hero-title">Nos <em>Catégories</em></h1>
          <div className="hero-divider" />
          <p className="hero-sub">Familles Musicales · Catalogue Universel</p>
        </div>
      </header>

      {/* ═══ SECTION GRILLE ═══ */}
      <section className="main-section">
        <div className="c-wrap">
          
          {/* Header Interne */}
          <div className="section-header">
            <div>
              <span className="sec-eyebrow">Explorez l'excellence</span>
              <h2 className="sec-title">Familles d'<em>Instruments</em></h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--txt-muted)', fontWeight: 500 }}>
              Sélection complète de <strong style={{ color: 'var(--txt-dark)' }}>{categories.length} univers</strong> musicaux
            </p>
          </div>

          {/* Grille Dynamique */}
          <div className="cat-grid">
            {categories.map((cat) => (
              <div key={cat.id} className="cat-card">
                
                {/* Wrapper Image */}
                <div className="cat-img-wrap">
                  {cat.image ? (
                    <img 
                      src={cat.image.startsWith('http') ? cat.image : `/storage/${cat.image}`}
                      alt={cat.nom} 
                      className="cat-img"
                      onError={(e) => { e.target.src = PLACEHOLDER; }} 
                    />
                  ) : (
                    <div style={{ background: 'linear-gradient(135deg, var(--txt-dark) 0%, #3a3a3a 100%)' }} className="w-full h-full flex items-center justify-center">
                      <span style={{ fontSize: '42px' }}>🎵</span>
                    </div>
                  )}
                </div>

                {/* Corps de Carte */}
                <div className="cat-body">
                  <div className="cat-meta">
                    <h3 className="cat-name">{cat.nom}</h3>
                    <span className="cat-badge">
                      {cat.products_count} modèle{cat.products_count !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Sous-catégories associées */}
                  {cat.sub_categories?.length > 0 && (
                    <div className="sub-row">
                      {cat.sub_categories.slice(0, 4).map(sub => (
                        <Link key={sub.id} to={`/produits?subcategory=${sub.id}`} className="sub-link">
                          {sub.nom}
                        </Link>
                      ))}
                      {cat.sub_categories.length > 4 && (
                        <span style={{ fontSize: '12px', color: 'var(--txt-muted)', alignSelf: 'center', opacity: .6, marginLeft: '4px' }}>
                          +{cat.sub_categories.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Lien de redirection vers le catalogue ciblé */}
                  <Link to={`/produits?category=${cat.id}`} className="cat-btn">
                    Découvrir l'univers
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
