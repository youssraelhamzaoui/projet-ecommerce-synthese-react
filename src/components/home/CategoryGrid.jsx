import { Link } from 'react-router-dom';

const ICONS = ['bx-guitar', 'bx-music', 'bxs-piano', 'bx-headphone', 'bx-microphone', 'bx-equalizer'];
const GRADIENTS = [
  'linear-gradient(135deg, rgba(123,31,48,0.10), rgba(200,147,122,0.15))',
  'linear-gradient(135deg, rgba(200,147,122,0.12), rgba(217,174,153,0.18))',
  'linear-gradient(135deg, rgba(46,125,50,0.09), rgba(102,187,106,0.14))',
  'linear-gradient(135deg, rgba(191,106,2,0.09), rgba(255,167,38,0.14))',
  'linear-gradient(135deg, rgba(21,101,192,0.08), rgba(100,181,246,0.13))',
  'linear-gradient(135deg, rgba(123,31,48,0.07), rgba(155,63,80,0.12))',
];

export default function CategoryGrid({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <section className="page-section-sm">
      <div className="page-wrap">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p className="section-eyebrow">Explorer</p>
            <h2 className="section-title">Nos catégories</h2>
          </div>
          <Link to="/categories" className="section-link">
            Tout voir <i className="bx bx-chevron-right" style={{ fontSize: 18 }} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {categories.map((cat, idx) => (
            <Link key={cat.id} to={`/produits?category=${cat.id}`}
              className="card-lux"
              style={{ padding: '20px 16px', textAlign: 'center', textDecoration: 'none', background: GRADIENTS[idx % GRADIENTS.length], borderColor: 'var(--bd-subtle)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--r-sm)',
                background: 'rgba(123,31,48,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: 22, color: 'var(--bordeaux)',
              }}>
                <i className={`bx ${ICONS[idx % ICONS.length]}`} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 3px', lineHeight: 1.3 }}>{cat.nom}</p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0 }}>{cat.products_count} produits</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
