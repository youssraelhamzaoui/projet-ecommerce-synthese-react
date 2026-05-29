import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PH = 'https://placehold.co/80x80/EDE5D6/8A7A68?text=Img';
const FRAIS = 30;

export default function CartPage() {
  const { items, total, updateItem, removeFromCart, emptyCart } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(123,31,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <i className="bx bx-cart-alt" style={{ fontSize: 36, color: 'var(--bordeaux-200)' }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Votre panier est vide</h2>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 28 }}>Ajoutez des produits pour commencer vos achats</p>
        <Link to="/produits" className="btn-primary" style={{ fontSize: 14, padding: '12px 28px' }}>
          <i className="bx bx-store" /> Voir les produits
        </Link>
      </div>
    );
  }

  const livraison = total >= 500 ? 0 : FRAIS;

  return (
    <div className="page-wrap" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p className="section-eyebrow">{items.length} article{items.length > 1 ? 's' : ''}</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Mon panier</h1>
        </div>
        <button onClick={emptyCart} className="btn-ghost-sm" style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          <i className="bx bx-trash" /> Vider
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'flex-start' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => {
            const img = item.image ? (item.image.startsWith('http') ? item.image : `/storage/${item.image}`) : PH;
            return (
              <div key={item.product_id} className="card-lux" style={{ display: 'flex', gap: 16, padding: '16px 20px', alignItems: 'center' }}>
                <Link to={`/produits/${item.product_id}`} style={{ flexShrink: 0 }}>
                  <img src={img} alt={item.nom} style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 'var(--r-sm)', border: '1px solid var(--bd-soft)' }}
                    onError={e => { e.target.src = PH; }} />
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/produits/${item.product_id}`} style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', display: 'block', marginBottom: 4 }}
                    className="product-name" dangerouslySetInnerHTML={{ __html: item.nom }} />
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--bordeaux)', margin: 0 }}>
                    {Number(item.price).toFixed(2)} MAD
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--bd-med)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
                    <button onClick={() => updateItem(item.product_id, item.quantity - 1)}
                      style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ width: 36, textAlign: 'center', fontSize: 13.5, fontWeight: 600 }}>{item.quantity}</span>
                    <button onClick={() => updateItem(item.product_id, item.quantity + 1)}
                      style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product_id)}
                    style={{ width: 32, height: 32, border: '1px solid var(--bd-soft)', borderRadius: 'var(--r-sm)', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--t)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(198,40,40,0.08)'; e.currentTarget.style.color = '#c62828'; e.currentTarget.style.borderColor = 'rgba(198,40,40,0.22)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}>
                    <i className="bx bx-trash" />
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', minWidth: 80, textAlign: 'right' }}>
                    {(item.price * item.quantity).toFixed(2)} MAD
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="card-lux" style={{ padding: 24, position: 'sticky', top: 80 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 18 }}>Récapitulatif</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <Row label="Sous-total" value={`${total.toFixed(2)} MAD`} />
            <Row label="Livraison" value={livraison === 0 ? 'Gratuite' : `${FRAIS} MAD`} valueColor={livraison === 0 ? '#2e7d32' : undefined} />
            {livraison > 0 && (
              <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)', background: 'var(--bg-input)', borderRadius: 'var(--r-sm)', padding: '6px 10px' }}>
                <i className="bx bx-info-circle" /> Plus que {(500 - total).toFixed(2)} MAD pour la livraison gratuite
              </p>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--bd-soft)', paddingTop: 14, marginBottom: 18 }}>
            <Row label="Total TTC" value={`${(total + livraison).toFixed(2)} MAD`} bold />
          </div>

          <Link to="/commande" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', padding: '12px 24px', fontSize: 14, width: '100%' }}>
            <i className="bx bx-check-circle" /> Passer la commande
          </Link>
          <Link to="/produits" style={{ display: 'block', textAlign: 'center', fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 12, textDecoration: 'none' }}
            className="section-link">
            ← Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueColor, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: bold ? 16 : 13, fontWeight: bold ? 700 : 500, color: valueColor || (bold ? 'var(--bordeaux)' : 'var(--text-primary)') }}>
        {value}
      </span>
    </div>
  );
}
