import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, CreditCard, Banknote, CheckCircle, MapPin, Phone, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react';
import { placeOrder } from '../api/ordersApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const FRAIS = 30;
const METHODES = [
  { value: 'livraison', label: 'Paiement à la livraison', description: 'Payez en espèces dès la réception de votre colis.', icon: Banknote },
  { value: 'virement', label: 'Virement bancaire', description: 'Votre commande sera expédiée dès réception du virement.', icon: CreditCard },
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
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Lien de retour au panier de style e-commerce */}
      <div className="mb-6">
        <Link to="/panier" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft size={16} /> Retour au panier
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Section Formulaire (Gauche - 7 colonnes) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Étape 1 : Adresse de livraison */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center">1</div>
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <Truck size={20} className="text-red-500" /> Adresse de livraison
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse *</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input value={form.adresse_livraison} onChange={(e) => set('adresse_livraison', e.target.value)}
                      required placeholder="Numéro et nom de rue, appartement..."
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville *</label>
                  <input value={form.ville_livraison} onChange={(e) => set('ville_livraison', e.target.value)}
                    required placeholder="Casablanca"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-400" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Code postal</label>
                  <input value={form.code_postal} onChange={(e) => set('code_postal', e.target.value)}
                    placeholder="20000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-400" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone *</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                    <input value={form.telephone} onChange={(e) => set('telephone', e.target.value)}
                      required placeholder="+212 600 000 000"
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 2 : Mode de paiement */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center">2</div>
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <CreditCard size={20} className="text-red-500" /> Mode de paiement
                </h2>
              </div>
              
              <div className="space-y-3">
                {METHODES.map(({ value, label, description, icon: Icon }) => {
                  const isChecked = form.methode_paiement === value;
                  return (
                    <label key={value} className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                      isChecked ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}>
                      <div className="flex items-center h-5 mt-0.5">
                        <input type="radio" name="methode" value={value}
                          checked={isChecked}
                          onChange={() => set('methode_paiement', value)} className="accent-red-600 h-4 w-4" />
                      </div>
                      <div className={`p-2 rounded-lg ${isChecked ? 'text-red-600' : 'text-gray-500 bg-gray-50'}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <span className="block font-semibold text-sm text-gray-800">{label}</span>
                        <span className="block text-xs text-gray-500 mt-0.5">{description}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Étape 3 : Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <h2 className="font-bold text-base text-gray-800 mb-3 flex items-center gap-2">
                <MessageSquare size={18} className="text-gray-500" /> Notes (optionnel)
              </h2>
              <textarea value={form.commentaire} onChange={(e) => set('commentaire', e.target.value)}
                rows={3} placeholder="Instructions spéciales pour la livraison..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none resize-none transition focus:border-red-400 focus:ring-1 focus:ring-red-400" />
            </div>
          </div>

          {/* Section Résumé de commande (Droite - 5 colonnes - Collant au scroll) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-gray-800 mb-5">Votre commande</h2>
              
              {/* Liste Articles */}
              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-50">
                {items.map((item, idx) => (
                  <div key={item.product_id} className={`flex justify-between text-sm ${idx > 0 ? 'pt-3' : ''}`}>
                    <div className="flex-1 min-w-0 mr-2">
                      <span className="text-gray-700 font-medium block truncate">{item.nom}</span>
                      <span className="text-xs text-gray-400 block mt-0.5">Quantité : {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-gray-800 whitespace-nowrap">{(item.price * item.quantity).toFixed(2)} MAD</span>
                  </div>
                ))}
              </div>
              
              <hr className="my-4 border-gray-100" />
              
              {/* Totaux */}
              <div className="space-y-2.5 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-medium text-gray-800">{total.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className={livraison === 0 ? 'text-green-600 font-semibold' : 'font-medium text-gray-800'}>
                    {livraison === 0 ? 'Gratuite' : `${FRAIS}.00 MAD`}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base text-gray-800">
                  <span>Total TTC</span>
                  <span className="text-red-600 text-lg">{ttc.toFixed(2)} MAD</span>
                </div>
              </div>

              {/* Bouton de soumission */}
              <button type="submit" disabled={loading}
                className="w-full bg-red-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  'Confirmer la commande'
                )}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}