import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, CreditCard, Banknote, CheckCircle } from 'lucide-react';
import { placeOrder } from '../api/ordersApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const FRAIS = 30;
const METHODES = [
  { value: 'livraison', label: 'Paiement à la livraison', icon: Banknote },
  { value: 'virement', label: 'Virement bancaire', icon: CreditCard },
];

export default function CheckoutPage() {
  const { items, total, emptyCart } = useCart();
  const { isAuthenticated, membre }  = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    adresse_livraison: membre?.address || '',
    ville_livraison:   membre?.ville || '',
    code_postal:       '',
    telephone:         membre?.telephone || '',
    methode_paiement:  'livraison',
    commentaire:       '',
  });

  const livraison = total >= 500 ? 0 : FRAIS;
  const ttc = total + livraison;

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Connexion requise</h2>
        <p className="text-gray-500 mb-6">Vous devez être connecté pour passer une commande.</p>
        <Link to="/connexion" className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition">
          Se connecter
        </Link>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    navigate('/panier');
    return null;
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Commande confirmée !</h2>
        <p className="text-gray-500 mb-8">
          Merci pour votre commande. Vous recevrez une confirmation par email sous peu.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/commandes" className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition">
            Voir mes commandes
          </Link>
          <Link to="/produits" className="border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
            Continuer les achats
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.adresse_livraison || !form.ville_livraison || !form.telephone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setLoading(true);
    try {
      await placeOrder({
        ...form,
        items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
      });
      await emptyCart();
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-800 mb-5 flex items-center gap-2">
                <Truck size={20} className="text-red-500" /> Adresse de livraison
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                  <input value={form.adresse_livraison} onChange={(e) => set('adresse_livraison', e.target.value)}
                    required placeholder="Numéro et nom de rue"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                  <input value={form.ville_livraison} onChange={(e) => set('ville_livraison', e.target.value)}
                    required placeholder="Casablanca"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                  <input value={form.code_postal} onChange={(e) => set('code_postal', e.target.value)}
                    placeholder="20000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-400" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input value={form.telephone} onChange={(e) => set('telephone', e.target.value)}
                    required placeholder="+212 600 000 000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-400" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-800 mb-5 flex items-center gap-2">
                <CreditCard size={20} className="text-red-500" /> Mode de paiement
              </h2>
              <div className="space-y-3">
                {METHODES.map(({ value, label, icon: Icon }) => (
                  <label key={value} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition ${
                    form.methode_paiement === value ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                    <input type="radio" name="methode" value={value}
                      checked={form.methode_paiement === value}
                      onChange={() => set('methode_paiement', value)} className="accent-red-600" />
                    <Icon size={20} className="text-gray-500" />
                    <span className="font-medium text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-800 mb-4">Notes (optionnel)</h2>
              <textarea value={form.commentaire} onChange={(e) => set('commentaire', e.target.value)}
                rows={3} placeholder="Instructions spéciales pour la livraison..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:border-red-400" />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-lg text-gray-800 mb-5">Votre commande</h2>
              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span className="text-gray-600 flex-1 truncate mr-2">{item.nom} × {item.quantity}</span>
                    <span className="font-medium text-gray-800 flex-shrink-0">{(item.price * item.quantity).toFixed(2)} MAD</span>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span><span>{total.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className={livraison === 0 ? 'text-green-600' : ''}>
                    {livraison === 0 ? 'Gratuite' : `${FRAIS} MAD`}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-base text-gray-800">
                  <span>Total TTC</span>
                  <span className="text-red-600">{ttc.toFixed(2)} MAD</span>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition disabled:opacity-60">
                {loading ? 'Traitement...' : 'Confirmer la commande'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
