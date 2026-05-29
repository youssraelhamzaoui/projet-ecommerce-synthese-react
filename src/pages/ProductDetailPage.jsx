import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronRight, Tag, Package, Truck } from 'lucide-react';
import { getProduct } from '../api/productsApi';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/ui/Loading';

const PLACEHOLDER = 'https://placehold.co/600x500/f3f4f6/9ca3af?text=Produit';

export default function ProductDetailPage() {
  const { id }        = useParams();
  const { addItem }   = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(res => { setProduct(res.data); setActiveImg(res.data.images?.[0]?.url || null); })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loading />;
  if (!product) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Produit introuvable.</p>
      <Link to="/produits" className="text-red-600 hover:underline mt-2 block">Retour aux produits</Link>
    </div>
  );

  const imageSrc = activeImg
    ? (activeImg.startsWith('http') ? activeImg : `/storage/${activeImg}`)
    : PLACEHOLDER;

  const handleAdd = () => addItem({ ...product, prix_actuel: product.prix_actuel }, qty);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-red-600">Accueil</Link>
        <ChevronRight size={14} />
        <Link to="/produits" className="hover:text-red-600">Produits</Link>
        {product.categorie && (
          <>
            <ChevronRight size={14} />
            <Link to={`/produits?category=${product.categorie.id}`} className="hover:text-red-600">
              {product.categorie.nom}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.nom}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-gray-50 mb-4 aspect-square">
            <img src={imageSrc} alt={product.nom} className="w-full h-full object-contain"
              onError={(e) => { e.target.src = PLACEHOLDER; }} />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img) => (
                <button key={img.id} onClick={() => setActiveImg(img.url)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    activeImg === img.url ? 'border-red-500' : 'border-transparent hover:border-gray-300'
                  }`}>
                  <img src={img.url.startsWith('http') ? img.url : `/storage/${img.url}`} alt=""
                    className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.brand && (
            <Link to={`/produits?brand=${product.brand.id}`} className="text-sm text-red-600 font-semibold uppercase tracking-wide hover:underline">
              {product.brand.nom}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2 mb-4">{product.nom}</h1>

          {/* Price */}
          <div className="mb-6">
            {product.en_promo ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">{Number(product.prix_actuel).toFixed(2)} MAD</span>
                <span className="text-xl text-gray-400 line-through">{Number(product.prix_vente).toFixed(2)} MAD</span>
                <span className="bg-red-100 text-red-600 text-sm px-2 py-0.5 rounded-full font-medium">
                  -{Math.round((1 - product.prix_actuel / product.prix_vente) * 100)}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-800">{Number(product.prix_actuel).toFixed(2)} MAD</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock_quantity > 0 ? (
              <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <Package size={16} /> En stock ({product.stock_quantity} disponibles)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
                <Package size={16} /> Rupture de stock
              </span>
            )}
          </div>

          {/* Qty & Add to cart */}
          {product.stock_quantity > 0 && (
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-3 hover:bg-gray-50">
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))} className="p-3 hover:bg-gray-50">
                  <Plus size={16} />
                </button>
              </div>
              <button onClick={handleAdd} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-700 transition">
                <ShoppingCart size={20} /> Ajouter au panier
              </button>
            </div>
          )}

          {/* Shipping info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck size={16} className="text-red-500" />
              Livraison gratuite dès 500 MAD d'achat
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag size={16} className="text-red-500" />
              Paiement à la livraison disponible
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {product.related?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Produits similaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {product.related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
