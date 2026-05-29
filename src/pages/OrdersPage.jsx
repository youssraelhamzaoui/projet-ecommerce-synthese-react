import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { getOrders } from '../api/ordersApi';
import Loading from '../components/ui/Loading';

const STATUS_CONFIG = {
  en_attente:     { label: 'En attente',     color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmee:      { label: 'Confirmée',      color: 'bg-blue-100 text-blue-700',    icon: CheckCircle },
  en_preparation: { label: 'En préparation', color: 'bg-orange-100 text-orange-700',icon: Package },
  expediee:       { label: 'Expédiée',       color: 'bg-purple-100 text-purple-700',icon: Truck },
  livree:         { label: 'Livrée',         color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  annulee:        { label: 'Annulée',        color: 'bg-red-100 text-red-700',      icon: XCircle },
  remboursee:     { label: 'Remboursée',     color: 'bg-gray-100 text-gray-700',    icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(res => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={56} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-4">Aucune commande pour l'instant</p>
          <Link to="/produits" className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition">
            Commencer mes achats
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.en_attente;
            const StatusIcon = status.icon;
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-800">{order.reference}</p>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                        <StatusIcon size={12} /> {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Commandé le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 text-lg">{Number(order.prix_total).toFixed(2)} MAD</p>
                    <p className="text-xs text-gray-400">{order.methode_paiement}</p>
                  </div>
                </div>

                {order.lignes?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-500 mb-2">{order.lignes.length} article{order.lignes.length > 1 ? 's' : ''}</p>
                    <div className="flex flex-wrap gap-2">
                      {order.lignes.slice(0, 3).map((ligne, i) => (
                        <span key={i} className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-600">
                          {ligne.nom_produit || `Produit #${ligne.product_id}`} × {ligne.quantite}
                        </span>
                      ))}
                      {order.lignes.length > 3 && (
                        <span className="text-xs text-gray-400">+{order.lignes.length - 3} autres</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
