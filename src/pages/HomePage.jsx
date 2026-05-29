import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHome } from '../api/productsApi';
import HeroSlider from '../components/home/HeroSlider';
import CategoryGrid from '../components/home/CategoryGrid';
import BrandsSection from '../components/home/BrandsSection';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/ui/Loading';

const FEATURES = [
  { icon: 'bx-package', title: 'Livraison rapide', desc: '24-48h partout au Maroc' },
  { icon: 'bx-shield-check', title: 'Paiement sécurisé', desc: 'Transactions 100% sécurisées' },
  { icon: 'bx-refresh', title: 'Retours faciles', desc: '14 jours pour changer d\'avis' },
  { icon: 'bx-headphone', title: 'Support 7j/7', desc: 'Notre équipe disponible' },
];

export default function HomePage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHome()
      .then(res => setData(res.data))
      .catch(() => setData({ sliders: [], featured_products: [], promo_products: [], categories: [], brands: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      {/* Hero */}
      <HeroSlider sliders={data?.sliders} />

      {/* Features strip */}
      <div style={{ background: 'var(--noir)', borderBottom: '1px solid rgba(200,147,122,0.10)' }}>
        <div className="page-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 0 }}>
          {FEATURES.map(({ icon, title, desc }, i) => (
            <div key={title} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px',
              borderRight: i < FEATURES.length - 1 ? '1px solid rgba(200,147,122,0.10)' : 'none',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: 'rgba(123,31,48,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`bx ${icon}`} style={{ fontSize: 20, color: 'var(--rosegold)' }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(243,237,225,0.90)', margin: '0 0 2px' }}>{title}</p>
                <p style={{ fontSize: 12, color: 'rgba(237,229,216,0.40)', margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <CategoryGrid categories={data?.categories} />

      {/* Featured Products */}
      {data?.featured_products?.length > 0 && (
        <section className="page-section-sm" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--bd-soft)', borderBottom: '1px solid var(--bd-soft)' }}>
          <div className="page-wrap">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <p className="section-eyebrow">Arrivages</p>
                <h2 className="section-title">Nouveautés</h2>
              </div>
              <Link to="/produits" className="section-link">
                Voir tout <i className="bx bx-right-arrow-alt" style={{ fontSize: 18 }} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {data.featured_products.map((product, i) => (
                <div key={product.id} className={`anim anim-d${(i % 4) + 1}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section style={{ background: 'linear-gradient(135deg, var(--bordeaux) 0%, #3A1020 50%, var(--bordeaux-600) 100%)', padding: '48px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,147,122,0.20) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, position: 'relative' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--rosegold-400)', marginBottom: 8 }}>
              Livraison offerte
            </p>
            <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.6px', color: '#fff', margin: '0 0 8px' }}>
              Commandez dès 500 MAD
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: 15, margin: 0 }}>
              Profitez de la livraison gratuite partout au Maroc
            </p>
          </div>
          <Link to="/produits" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', color: 'var(--bordeaux)',
            padding: '13px 28px', borderRadius: 'var(--r-sm)',
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
            transition: 'var(--t)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
            Voir les produits <i className="bx bx-right-arrow-alt" style={{ fontSize: 18 }} />
          </Link>
        </div>
      </section>

      {/* Promo Products */}
      {data?.promo_products?.length > 0 && (
        <section className="page-section-sm">
          <div className="page-wrap">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <p className="section-eyebrow">Offres limitées</p>
                <h2 className="section-title">Promotions en cours</h2>
              </div>
              <Link to="/produits?promo=1" className="section-link">
                Tout voir <i className="bx bx-right-arrow-alt" style={{ fontSize: 18 }} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {data.promo_products.map((product, i) => (
                <div key={product.id} className={`anim anim-d${(i % 4) + 1}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      <BrandsSection brands={data?.brands} />
    </div>
  );
}
