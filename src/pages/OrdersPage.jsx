import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle, CreditCard, Calendar, User, MapPin } from 'lucide-react';
import { getOrders } from '../api/ordersApi';
import Loading from '../components/ui/Loading';

const STATUS_CONFIG = {
  en_attente:     { label: 'En attente',     color: 'text-amber-600 bg-amber-50 border-amber-200',  icon: Clock },
  confirmee:      { label: 'Confirmée',      color: 'text-blue-600 bg-blue-50 border-blue-200',    icon: CheckCircle },
  en_preparation: { label: 'En préparation', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: Package },
  expediee:       { label: 'Expédiée',       color: 'text-purple-600 bg-purple-50 border-purple-200', icon: Truck },
  livree:         { label: 'Livrée',         color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle },
  annulee:        { label: 'Annulée',        color: 'text-rose-600 bg-rose-50 border-rose-200',     icon: XCircle },
  remboursee:     { label: 'Remboursée',     color: 'text-slate-600 bg-slate-50 border-slate-200',   icon: XCircle },
};

// Ordre logique des statuts pour la chaîne (Timeline)
const STATUS_ORDER = ['en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  // Fonction pour formater la date de manière élégante
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Suivi de mes commandes</h1>
          <p className="text-gray-500 mt-1">Consultez les détails, produits et l'état d'avancement de vos achats.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Aucune commande</h3>
            <p className="text-gray-500 mt-1 mb-6">Vous n'avez pas encore passé de commande.</p>
            <Link to="/produits" className="inline-flex bg-red-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-red-700 transition">
              Commencer mes achats
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const currentStatusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.en_attente;
              const isCancelledOrRefunded = ['annulee', 'remboursee'].includes(order.status);

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  
                  {/* 1. Header de la commande */}
                  <div className="bg-gray-50/70 p-4 sm:p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Référence</p>
                        <p className="font-bold text-gray-900 text-sm sm:text-base">#{order.reference}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Commande</p>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Paiement</p>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <CreditCard size={14} className="text-gray-400" />
                          {order.methode_paiement}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Montant Total</p>
                      <p className="text-xl font-black text-red-600">{Number(order.prix_total).toFixed(2)} MAD</p>
                    </div>
                  </div>

                  {/* 2. Timeline / Chaîne des statuts */}
                  <div className="p-6 border-b border-gray-50 bg-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">Suivi de la livraison</p>
                    
                    {isCancelledOrRefunded ? (
                      /* Affichage spécial si annulée ou remboursée */
                      <div className={`flex items-center gap-3 p-4 rounded-xl border ${currentStatusInfo.color}`}>
                        <currentStatusInfo.icon size={20} />
                        <div>
                          <p className="font-bold">Cette commande a été {currentStatusInfo.label.toLowerCase()}</p>
                          <p className="text-xs opacity-90">Statut mis à jour le : {formatDate(order.updated_at)}</p>
                        </div>
                      </div>
                    ) : (
                      /* Chaîne normale des statuts (Timeline Horizontale) */
                      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2 dashboard-timeline">
                        {STATUS_ORDER.map((stepKey, index) => {
                          const stepConfig = STATUS_CONFIG[stepKey];
                          const StepIcon = stepConfig.icon;
                          
                          // Vérifier si ce statut est passé ou actuel
                          const currentIndex = STATUS_ORDER.indexOf(order.status);
                          const isCurrent = stepKey === order.status;
                          const isPassed = STATUS_ORDER.indexOf(stepKey) <= currentIndex;
                          
                          // Récupérer la date spécifique du changement si dispo dans votre historique
                          // Exemple si order.status_history = [{ status: 'en_attente', date: '...' }]
                          const historyStep = order.status_history?.find(h => h.status === stepKey);
                          const stepDate = historyStep ? historyStep.date : (isCurrent ? order.updated_at : (index === 0 ? order.created_at : null));

                          return (
                            <div key={stepKey} className="flex md:flex-col items-center flex-1 w-full relative z-10">
                              {/* Ligne de connexion pour le design desktop */}
                              {index < STATUS_ORDER.length - 1 && (
                                <div className={`hidden md:block absolute top-5 left-1/2 right-[-50%] h-0.5 -z-10 ${
                                  STATUS_ORDER.indexOf(STATUS_ORDER[index + 1]) <= currentIndex ? 'bg-emerald-500' : 'bg-gray-200'
                                }`} />
                              )}

                              {/* Icône du Statut */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-all ${
                                isCurrent 
                                  ? `${stepConfig.color} scale-110 ring-4 ring-offset-2 ring-opacity-30`
                                  : isPassed 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                    : 'bg-white text-gray-300 border-gray-200'
                              }`}>
                                <StepIcon size={18} />
                              </div>

                              {/* Textes du Statut */}
                              <div className="ml-4 md:ml-0 md:text-center mt-0 md:mt-3">
                                <p className={`text-xs font-bold ${isCurrent ? 'text-gray-900' : isPassed ? 'text-emerald-700' : 'text-gray-400'}`}>
                                  {stepConfig.label}
                                </p>
                                {stepDate && isPassed && (
                                  <p className="text-[11px] text-gray-400 mt-0.5">
                                    {new Date(stepDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 3. Liste Complète des Produits Commandés */}
                  <div className="p-6 bg-gray-50/30">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                      Articles commandés ({order.lignes?.length || 0})
                    </p>
                    
                    <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-100 overflow-hidden">
                      {order.lignes?.map((ligne, index) => (
                        <div key={index} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                          
                          {/* Info Produit */}
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Placeholder Image Produit */}
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0 border border-gray-100">
                              {ligne.image_url ? (
                                <img src={ligne.image_url} alt={ligne.nom_produit} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Package size={20} />
                              )}
                            </div>
                            
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 text-sm truncate">
                                {ligne.nom_produit || `Produit #${ligne.product_id}`}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Prix unitaire: {Number(ligne.prix_unitaire || (order.prix_total / ligne.quantite)).toFixed(2)} MAD
                              </p>
                            </div>
                          </div>

                          {/* Quantité & Total Ligne */}
                          <div className="flex items-center gap-6 flex-shrink-0">
                            <div className="text-center">
                              <p className="text-xs text-gray-400 font-medium">Quantité</p>
                              <p className="font-bold text-gray-700 text-sm">×{ligne.quantite}</p>
                            </div>
                            <div className="text-right min-w-[80px]">
                              <p className="text-xs text-gray-400 font-medium">Sous-total</p>
                              <p className="font-bold text-gray-900 text-sm">
                                {Number((ligne.prix_unitaire || 0) * ligne.quantite).toFixed(2)} MAD
                              </p>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Infos supplémentaires (Client / Adresse si dispo f l'objet) */}
                  {(order.adresse_livraison || order.note) && (
                    <div className="px-6 py-4 bg-white border-t border-gray-50 flex flex-wrap gap-6 text-xs text-gray-500">
                      {order.adresse_livraison && (
                        <div className="flex items-start gap-1.5 max-w-md">
                          <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Adresse de livraison:</strong> {order.adresse_livraison}</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}