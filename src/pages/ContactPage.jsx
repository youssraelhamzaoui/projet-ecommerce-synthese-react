import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { sendContact } from '../api/contactApi';
import { toast } from 'react-toastify';

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', sujet: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContact(form);
      setSent(true);
      toast.success('Message envoyé avec succès !');
    } catch { toast.error('Erreur lors de l\'envoi'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Contactez-nous</h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Notre équipe est disponible pour répondre à toutes vos questions concernant nos produits et services.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 rounded-xl"><MapPin size={20} className="text-red-600" /></div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Adresse</h3>
                <p className="text-sm text-gray-500">123 Avenue Hassan II<br />Casablanca, 20000</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 rounded-xl"><Phone size={20} className="text-red-600" /></div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Téléphone</h3>
                <p className="text-sm text-gray-500">+212 522 000 000</p>
                <p className="text-xs text-gray-400 mt-1">Lun-Sam 9h-18h</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 rounded-xl"><Mail size={20} className="text-red-600" /></div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                <p className="text-sm text-gray-500">contact@musicstore.ma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <CheckCircle size={56} className="text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Message envoyé !</h3>
              <p className="text-gray-500 mb-6">Nous vous répondrons dans les plus brefs délais.</p>
              <button onClick={() => { setSent(false); setForm({ nom: '', email: '', telephone: '', sujet: '', message: '' }); }}
                className="text-red-600 hover:underline text-sm">Envoyer un autre message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Envoyer un message</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
                  <input value={form.nom} onChange={(e) => set('nom', e.target.value)} required
                    placeholder="Votre nom"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required
                    placeholder="votre@email.ma"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                <input value={form.telephone} onChange={(e) => set('telephone', e.target.value)}
                  placeholder="+212 600 000 000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sujet *</label>
                <input value={form.sujet} onChange={(e) => set('sujet', e.target.value)} required
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                <textarea value={form.message} onChange={(e) => set('message', e.target.value)} required rows={5}
                  placeholder="Votre message..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:border-red-400" />
              </div>
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 bg-red-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-red-700 transition disabled:opacity-60">
                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><Send size={18} /> Envoyer le message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
