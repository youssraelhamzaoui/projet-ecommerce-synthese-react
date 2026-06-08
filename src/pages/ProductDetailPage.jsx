import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronRight, Tag, Package, Truck } from 'lucide-react';
import { getProduct } from '../api/productsApi';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/ui/Loading';

const PLACEHOLDER = 'https://placehold.co/600x500/f2efe9/1a1a1a?text=Music+Store';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(res => { 
        setProduct(res.data); 
        setActiveImg(res.data.images?.[0]?.url || null); 
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loading />;
  
  if (!product) return (
    <div className="text-center py-32" style={{ backgroundColor: 'var(--bg, #F2EFE9)' }}>
      <p style={{ color: '#5a5550', fontSize: '15px' }}>Produit introuvable.</p>
      <Link to="/produits" style={{ color: 'var(--rosegold, #b76e79)', textDecoration: 'none', fontWeight: 600, marginTop: '12px', display: 'inline-block' }} className="hover:underline">
        Retour aux produits
      </Link>
    </div>
  );

  const imageSrc = activeImg
    ? (activeImg.startsWith('http') ? activeImg : `/storage/${activeImg}`)
    : PLACEHOLDER;

  const handleAdd = () => addItem({ ...product, prix_actuel: product.prix_actuel }, qty);

  return (
    <div style={{ backgroundColor: '#F2EFE9', minHeight: '100vh', padding: '40px 0' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Style injection pour forcer l'usage du Rose Gold et lisser le rendu */}
        <style>{`
          :root {
            --rosegold: #b76e79;
            --txt-dark: #1a1a1a;
            --txt-sub: #5a5550;
            --border-color: rgba(183, 110, 121, 0.2);
          }
          .custom-scrollbar::-webkit-scrollbar { height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--rosegold); border-radius: 2px; }
          .img-btn-active { border-color: var(--rosegold) !important; opacity: 1 !important; }
          .btn-primary:hover { background-color: #a05d68 !important; transform: translateY(-1px); }
          .btn-qty:hover { background-color: rgba(183, 110, 121, 0.08) !important; color: var(--rosegold) !important; }
        `}</style>

        {/* Breadcrumb Épuré */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-wider mb-10" style={{ color: '#5a5550' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-black">Accueil</Link>
          <ChevronRight size={12} style={{ color: 'rgba(183, 110, 121, 0.5)' }} />
          <Link to="/produits" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-black">Produits</Link>
          {product.categorie && (
            <>
              <ChevronRight size={12} style={{ color: 'rgba(183, 110, 121, 0.5)' }} />
              <Link to={`/produits?category=${product.categorie.id}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-black">
                {product.categorie.nom}
              </Link>
            </>
          )}
          <ChevronRight size={12} style={{ color: 'rgba(183, 110, 121, 0.5)' }} />
          <span style={{ color: '#1a1a1a', fontWeight: 600 }} className="truncate max-w-xs">{product.nom}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Galerie d'images Premium */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-white border border-opacity-40 flex items-center justify-center p-6 aspect-square"
                 style={{ borderColor: 'var(--border-color)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
              <img 
                src={imageSrc} 
                alt={product.nom} 
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                onError={(e) => { e.target.src = PLACEHOLDER; }} 
              />
            </div>
            
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {product.images.map((img) => (
                  <button 
                    key={img.id} 
                    onClick={() => setActiveImg(img.url)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 bg-white transition-all duration-200 ${
                      activeImg === img.url ? 'img-btn-active' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{ borderColor: 'transparent' }}
                  >
                    <img 
                      src={img.url.startsWith('http') ? img.url : `/storage/${img.url}`} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fiche Détails */}
          <div className="flex flex-col justify-center">
            {product.brand && (
              <Link 
                to={`/produits?brand=${product.brand.id}`} 
                style={{ color: '#b76e79', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none' }}
              >
                {product.brand.nom}
              </Link>
            )}
            
            <h1 style={{ color: '#1a1a1a', fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.5px' }} className="mt-2 mb-4 leading-tight">
              {product.nom}
            </h1>

            {/* Section Prix & Statut */}
            <div className="flex items-center justify-between border-b pb-6 mb-6" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                {product.en_promo ? (
                  <div className="flex items-baseline gap-3">
                    <span style={{ color: '#b76e79', fontSize: '1.8rem', fontWeight: 700 }}>{Number(product.prix_actuel).toFixed(2)} MAD</span>
                    <span style={{ color: '#5a5550', fontSize: '1.1rem', textDecoration: 'line-through', opacity: 0.6 }}>{Number(product.prix_vente).toFixed(2)} MAD</span>
                    <span style={{ backgroundColor: 'rgba(183, 110, 121, 0.12)', color: '#b76e79', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                      -{Math.round((1 - product.prix_actuel / product.prix_vente) * 100)}%
                    </span>
                  </div>
                ) : (
                  <span style={{ color: '#1a1a1a', fontSize: '1.8rem', fontWeight: 700 }}>{Number(product.prix_actuel).toFixed(2)} MAD</span>
                )}
              </div>

              {/* Stock */}
              <div>
                {product.stock_quantity > 0 ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
                    <Package size={14} /> En stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1.5 rounded-md border border-red-100">
                    <Package size={14} /> Rupture
                  </span>
                )}
              </div>
            </div>

            {/* Description Épurée */}
            {product.description && (
              <div className="mb-8">
                <h3 style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Description</h3>
                <p style={{ color: '#5a5550', fontSize: '14.5px', lineHeight: '1.7' }}>{product.description}</p>
              </div>
            )}

            {/* Actions d'Achat */}
            {product.stock_quantity > 0 && (
              <div className="flex items-center gap-4 mb-8">
                {/* Sélecteur de Quantité Custom */}
                <div className="flex items-center bg-white border rounded-lg overflow-hidden h-12" style={{ borderColor: 'var(--border-color)' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="btn-qty px-4 h-full text-gray-500 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-bold text-sm" style={{ color: '#1a1a1a' }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))} className="btn-qty px-4 h-full text-gray-500 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                
                {/* Bouton Panier */}
                <button 
                  onClick={handleAdd} 
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-white h-12 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200"
                  style={{ backgroundColor: '#b76e79', boxShadow: '0 4px 12px rgba(183, 110, 121, 0.2)' }}
                >
                  <ShoppingCart size={16} /> Ajouter au panier
                </button>
              </div>
            )}

            {/* Infos de Livraison / Réassurance localisées Maroc */}
            <div className="bg-white rounded-xl p-5 border space-y-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3 text-sm" style={{ color: '#5a5550' }}>
                <Truck size={16} style={{ color: '#b76e79', flexShrink: 0 }} />
                <span>Livraison sécurisée partout au Maroc (Gratuite dès 500 MAD)</span>
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: '#5a5550' }}>
                <Tag size={16} style={{ color: '#b76e79', flexShrink: 0 }} />
                <span>Paiement en espèces à la livraison ou par carte bancaire</span>
              </div>
            </div>

          </div>
        </div>

        {/* Produits Similaires */}
        {product.related?.length > 0 && (
          <div className="border-t pt-16" style={{ borderColor: 'var(--border-color)' }}>
            <h2 style={{ color: '#1a1a1a', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '24px' }}>
              Produits similaires
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {product.related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}