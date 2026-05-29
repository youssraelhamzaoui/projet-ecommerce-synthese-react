import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const PLACEHOLDER = 'https://placehold.co/400x300/EDE5D6/8A7A68?text=Produit';

export default function ProductCard({ product }) {
  const { addItem, loading } = useCart();

  const imageSrc = product.image
    ? (product.image.startsWith('http') ? product.image : `/storage/${product.image}`)
    : PLACEHOLDER;

  const discount = product.en_promo && product.prix_vente
    ? Math.round((1 - product.prix_actuel / product.prix_vente) * 100)
    : 0;

  return (
    <div className="product-card anim">
      <Link to={`/produits/${product.id}`} style={{ display: 'block', overflow: 'hidden', position: 'relative' }}>
        <img
          src={imageSrc}
          alt={product.nom}
          className="product-card-img"
          onError={e => { e.target.src = PLACEHOLDER; }}
        />
        {product.en_promo && <span className="badge-promo">−{discount}%</span>}
        {(!product.disponible || product.stock_quantity === 0) && (
          <span className="badge-rupture">Rupture</span>
        )}
      </Link>

      <div className="product-card-body">
        {(product.brand?.nom || product.brand) && (
          <p className="product-brand">{product.brand?.nom || product.brand}</p>
        )}

        <Link to={`/produits/${product.id}`} className="product-name">{product.nom}</Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <div>
            {product.en_promo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="price-current">{Number(product.prix_actuel).toFixed(2)} <span style={{ fontSize: 12 }}>MAD</span></span>
                <span className="price-old">{Number(product.prix_vente).toFixed(2)}</span>
              </div>
            ) : (
              <span className="price-normal">{Number(product.prix_actuel).toFixed(2)} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-secondary)' }}>MAD</span></span>
            )}
          </div>

          <button
            className="btn-add-cart"
            onClick={() => addItem(product)}
            disabled={loading || !product.disponible || product.stock_quantity === 0}
            title="Ajouter au panier"
          >
            <i className="bx bx-cart-add" />
          </button>
        </div>
      </div>
    </div>
  );
}
