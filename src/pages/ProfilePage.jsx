import { useState } from 'react';
import { User, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { membre, isAuthenticated } = useAuth();
  const [tab, setTab]    = useState('info');
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState({
    nom:       membre?.nom || '',
    prenom:    membre?.prenom || '',
    telephone: membre?.telephone || '',
    address:   membre?.address || '',
    ville:     membre?.ville || '',
  });

  const [pw, setPw] = useState({ current_password: '', password: '', password_confirmation: '' });

  const handleInfoSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/profile', info);
      toast.success('Profil mis à jour');
    } catch { toast.error('Erreur lors de la mise à jour'); }
    finally { setLoading(false); }
  };

  const handlePwSave = async (e) => {
    e.preventDefault();
    if (pw.password !== pw.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await api.put('/profile/password', pw);
      toast.success('Mot de passe mis à jour');
      setPw({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mon profil</h1>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl font-bold">
          {membre?.prenom?.[0]}{membre?.nom?.[0]}
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{membre?.prenom} {membre?.nom}</p>
          <p className="text-gray-500 text-sm">{membre?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[['info', User, 'Informations'], ['password', Lock, 'Mot de passe']].map(([key, Icon, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${
              tab === key ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <form onSubmit={handleInfoSave} className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Prénom', 'prenom', 'Mohammed'],
              ['Nom', 'nom', 'Alami'],
              ['Téléphone', 'telephone', '+212 600 000 000'],
              ['Ville', 'ville', 'Casablanca'],
            ].map(([label, key, placeholder]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input value={info[key]} onChange={(e) => setInfo(i => ({ ...i, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse</label>
              <input value={info.address} onChange={(e) => setInfo(i => ({ ...i, address: e.target.value }))}
                placeholder="123 Avenue Hassan II"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="mt-5 flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-60">
            <Save size={16} /> {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePwSave} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          {[
            ['Mot de passe actuel', 'current_password'],
            ['Nouveau mot de passe', 'password'],
            ['Confirmer le nouveau', 'password_confirmation'],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input type="password" value={pw[key]} onChange={(e) => setPw(p => ({ ...p, [key]: e.target.value }))}
                required placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-60">
            <Lock size={16} /> {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
          </button>
        </form>
      )}
    </div>
  );
}
