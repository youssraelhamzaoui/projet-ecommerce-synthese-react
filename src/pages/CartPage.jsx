import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle, Info, Truck } from 'lucide-react';

const PH = 'https://placehold.co/100x100/F3F4F6/9CA3AF?text=Produit';
const FRAIS_LIVRAISON = 30;
const SEUIL_GRATUIT = 500;

export default function CartPage() {
  const { items, total, updateItem, removeFromCart, emptyCart } = useCart();

  const livraison = total >= SEUIL_GRATUIT ? 0 : FRAIS_LIVRAISON;
  const restePourGratuite = SEUIL_GRATUIT - total;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          On dirait que vous n'avez pas encore trouvé votre bonheur.
        </p>
        <Link to="/produits" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg">
          <ArrowLeft size={18} /> Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header Panier */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mon Panier</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            Vous avez <span className="font-bold text-gray-900">{items.length} article(s)</span> prêt(s) pour la commande.
          </p>
        </div>
        <button 
          onClick={emptyCart}
          className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 text-sm font-medium"
        >
          <Trash2 size={16} /> Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Colonne Gauche: Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const img = item.image ? (item.image.startsWith('http') ? item.image : `/storage/${item.image}`) : PH;
            
            return (
              <div key={item.product_id} className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex gap-4 sm:gap-6 items-center hover:shadow-sm transition-shadow">
                {/* Image */}
                <Link to={`/produits/${item.product_id}`} className="flex-shrink-0">
                  <img 
                    src={img} 
                    alt={item.nom} 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-gray-50 border border-gray-50"
                  />
                </Link>

                {/* Infos Produit */}
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/produits/${item.product_id}`}
                    className="text-base sm:text-lg font-bold text-gray-900 hover:text-red-600 transition-colors truncate block"
                    dangerouslySetInnerHTML={{ __html: item.nom }}
                  />
                  <p className="text-red-600 font-bold mt-1 text-sm sm:text-base">
                    {Number(item.price).toFixed(2)} MAD
                  </p>
                </div>

                {/* Quantité & Action */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                  {/* Sélecteur de Quantité */}
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 p-1">
                    <button 
                      onClick={() => updateItem(item.product_id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateItem(item.product_id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Prix Total Ligne & Delete */}
                  <div className="flex items-center gap-4">
                    <p className="hidden sm:block font-black text-gray-900 min-w-[90px] text-right">
                      {(item.price * item.quantity).toFixed(2)} <span className="text-[10px] text-gray-400">MAD</span>
                    </p>
                    <button 
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Colonne Droite: Récapitulatif */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Sous-total</span>
                <span className="text-gray-900">{total.toFixed(2)} MAD</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Livraison</span>
                <span className={`font-bold ${livraison === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {livraison === 0 ? 'Gratuite' : `${FRAIS_LIVRAISON.toFixed(2)} MAD`}
                </span>
              </div>

              {livraison > 0 && (
                <div className="bg-amber-50 rounded-xl p-3 flex gap-2 items-start border border-amber-100">
                  <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-800 leading-tight">
                    Ajoutez encore <span className="font-bold">{restePourGratuite.toFixed(2)} MAD</span> pour profiter de la <strong>livraison gratuite</strong>.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Total TTC</span>
                <span className="text-3xl font-black text-red-600">
                  {(total + livraison).toFixed(2)} <span className="text-sm font-bold">MAD</span>
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                to="/commande" 
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-xl shadow-red-100 active:scale-[0.98]"
              >
                Commander <CheckCircle size={20} />
              </Link>
              <Link 
                to="/produits" 
                className="w-full flex items-center justify-center py-2 text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
              >
                Continuer mes achats
              </Link>
            </div>

            {/* Badges de confiance */}
            <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center text-center">
                <Truck size={20} className="text-gray-400 mb-1" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Livraison Rapide</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle size={20} className="text-gray-400 mb-1" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Paiement Sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}