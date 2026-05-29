import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', address: '', ville: '',
    password: '', password_confirmation: '',
  });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  if (isAuthenticated) { navigate('/'); return null; }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: 'Les mots de passe ne correspondent pas' });
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Compte créé avec succès !');
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#1C1612',
      backgroundImage: `radial-gradient(ellipse 60% 50% at 15% 20%, rgba(123,31,48,0.28) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 40% at 85% 80%, rgba(200,147,122,0.16) 0%, transparent 55%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px', fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#7B1F30,#C8937A)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', marginBottom: 12, boxShadow: '0 8px 20px rgba(123,31,48,0.40)' }}>
            <i className="bx bxs-music" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.6px', color: 'rgba(243,237,225,0.95)' }}>
            Music<span style={{ fontWeight: 300, color: 'rgba(200,147,122,0.85)' }}>Store</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(200,147,122,0.60)', marginTop: 4 }}>
            Créer un compte client
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(200,147,122,0.15)',
          borderRadius: 20, padding: '34px 30px',
          backdropFilter: 'blur(24px) saturate(160%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(200,147,122,0.08)',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'rgba(243,237,225,0.95)', marginBottom: 4, letterSpacing: '-0.3px' }}>
            Inscription
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(160,140,120,0.80)', marginBottom: 26 }}>
            Rejoignez notre communauté musicale au Maroc.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <F label="Prénom" name="prenom" value={form.prenom} onChange={set} placeholder="Mohammed" required error={errors.prenom} />
              <F label="Nom" name="nom" value={form.nom} onChange={set} placeholder="Alami" required error={errors.nom} />
              <F label="Email" name="email" type="email" value={form.email} onChange={set} placeholder="votre@email.ma" required error={errors.email} span={2} />
              <F label="Téléphone" name="telephone" value={form.telephone} onChange={set} placeholder="+212 600 000 000" error={errors.telephone} />
              <F label="Ville" name="ville" value={form.ville} onChange={set} placeholder="Casablanca" error={errors.ville} />
              <F label="Adresse" name="address" value={form.address} onChange={set} placeholder="123 Rue Hassan II" error={errors.address} span={2} />

              {/* Password */}
              <div>
                <label style={labelStyle}>Mot de passe *</label>
                <div style={{ position: 'relative' }}>
                  <i className="bx bx-lock-alt" style={iconStyle} />
                  <input type={showPw ? 'text' : 'password'} required value={form.password}
                    onChange={e => set('password', e.target.value)} placeholder="Min. 6 caractères"
                    style={{ ...inputStyle, paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(200,147,122,0.6)', fontSize: 16, display: 'flex' }}>
                    <i className={`bx ${showPw ? 'bx-hide' : 'bx-show'}`} />
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Confirmer *</label>
                <div style={{ position: 'relative' }}>
                  <i className="bx bx-lock-alt" style={iconStyle} />
                  <input type={showPw ? 'text' : 'password'} required value={form.password_confirmation}
                    onChange={e => set('password_confirmation', e.target.value)} placeholder="Répéter"
                    style={{ ...inputStyle, borderColor: errors.password_confirmation ? 'rgba(198,40,40,0.45)' : 'rgba(200,147,122,0.18)' }} />
                </div>
                {errors.password_confirmation && (
                  <p style={{ fontSize: 11.5, color: '#ef9a9a', marginTop: 4 }}>{errors.password_confirmation}</p>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', marginTop: 20,
              background: loading ? 'rgba(123,31,48,0.5)' : 'linear-gradient(135deg,#7B1F30 0%,#C8937A 100%)',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: 13, fontSize: 14, fontWeight: 600, fontFamily: 'Inter,sans-serif',
              cursor: loading ? 'wait' : 'pointer', transition: 'all 0.25s',
              boxShadow: '0 4px 15px rgba(123,31,48,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading
                ? <><span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Création…</>
                : <><i className="bx bx-user-plus" /> Créer mon compte</>
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12.5, color: 'rgba(160,140,120,0.60)' }}>
            Déjà un compte ?{' '}
            <Link to="/connexion" style={{ color: 'rgba(200,147,122,0.90)', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(160,140,120,0.30)' }}>
          © {new Date().getFullYear()} MusicStore Maroc
        </p>
      </div>
    </div>
  );
}

function F({ label, name, type = 'text', value, onChange, placeholder, required, error, span }) {
  return (
    <div style={span === 2 ? { gridColumn: 'span 2' } : {}}>
      <label style={labelStyle}>{label}{required && ' *'}</label>
      <input type={type} value={value} required={required}
        onChange={e => onChange(name, e.target.value)} placeholder={placeholder}
        style={{ ...inputStyle, borderColor: error ? 'rgba(198,40,40,0.45)' : 'rgba(200,147,122,0.18)' }} />
      {error && <p style={{ fontSize: 11.5, color: '#ef9a9a', marginTop: 4 }}>{error[0] || error}</p>}
    </div>
  );
}

const labelStyle = {
  fontSize: 11.5, fontWeight: 600,
  color: 'rgba(200,147,122,0.75)',
  marginBottom: 5, display: 'block',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};
const iconStyle = {
  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
  color: 'rgba(200,147,122,0.50)', fontSize: 15, pointerEvents: 'none',
};
const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(200,147,122,0.18)',
  borderRadius: 10,
  color: 'rgba(243,237,225,0.92)',
  fontSize: 13.5, fontFamily: 'Inter,sans-serif',
  padding: '10px 12px 10px 36px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};
