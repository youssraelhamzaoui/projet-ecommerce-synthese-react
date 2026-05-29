import { Link } from 'react-router-dom';

export default function BrandsSection({ brands = [] }) {
  if (!brands.length) return null;

  return (
    <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--bd-soft)', borderBottom: '1px solid var(--bd-soft)', padding: '40px 0' }}>
      <div className="page-wrap">
        <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase', color: 'var(--rosegold-600)', marginBottom: 24 }}>
          Nos marques partenaires
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {brands.map(brand => (
            <Link key={brand.id} to={`/produits?brand=${brand.id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '10px 20px', borderRadius: 'var(--r-md)',
                border: '1px solid var(--bd-soft)',
                background: 'var(--bg-card)',
                textDecoration: 'none',
                transition: 'var(--t)',
                minWidth: 100,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bordeaux-200)'; e.currentTarget.style.boxShadow = 'var(--sh-sm)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd-soft)'; e.currentTarget.style.boxShadow = 'none'; }}>
              {brand.logo ? (
                <img
                  src={brand.logo.startsWith('http') ? brand.logo : `/storage/${brand.logo}`}
                  alt={brand.nom}
                  style={{ height: 32, objectFit: 'contain', filter: 'grayscale(1)', transition: 'var(--t)' }}
                  onMouseEnter={e => e.target.style.filter = 'grayscale(0)'}
                  onMouseLeave={e => e.target.style.filter = 'grayscale(1)'}
                  onError={e => e.target.style.display = 'none'}
                />
              ) : (
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>{brand.nom}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
