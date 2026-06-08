import { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const DEMO_ACCOUNTS = [
  { prenom: 'Youssef', nom: 'Alaoui',      email: 'client1@demo.ma', role: 'Client',     grad: 'linear-gradient(135deg,#7B1F30,#C8937A)', badge: { bg: 'rgba(123,31,48,0.25)', color: '#CBA0AB' } },
  { prenom: 'Fatima',  nom: 'Benali',       email: 'client2@demo.ma', role: 'Cliente',    grad: 'linear-gradient(135deg,#A67560,#EDD5C7)', badge: { bg: 'rgba(200,147,122,0.22)', color: '#D9AE99' } },
  { prenom: 'Karim',   nom: 'El Mansouri',  email: 'client3@demo.ma', role: 'Client',     grad: 'linear-gradient(135deg,#2e7d32,#66bb6a)', badge: { bg: 'rgba(46,125,50,0.22)',  color: '#66bb6a' } },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  const destination = from.startsWith('/connexion') || from.startsWith('/inscription') ? '/' : from;
  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Bienvenue !');
      // const destination = from.startsWith('/connexion') || from.startsWith('/inscription') ? '/' : from;
      // navigate(destination, { replace: true });
      navigate('/profil', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Identifiants incorrects');
    } finally { setLoading(false); }
  };

  const fillDemo = (email) => setForm({ email, password: 'password' });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1C1612',
      backgroundImage: `radial-gradient(ellipse 60% 50% at 15% 20%, rgba(123,31,48,0.28) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 40% at 85% 80%, rgba(200,147,122,0.16) 0%, transparent 55%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 58, height: 58, borderRadius: 16,
            background: 'linear-gradient(135deg, #7B1F30, #C8937A)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, color: '#fff', marginBottom: 14,
            boxShadow: '0 8px 24px rgba(123,31,48,0.45)',
          }}>
            <i className="bx bxs-music" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.8px', color: 'rgba(243,237,225,0.95)' }}>
            Music<span style={{ fontWeight: 300, color: 'rgba(200,147,122,0.85)' }}>Store</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(200,147,122,0.65)', marginTop: 5, letterSpacing: '0.5px' }}>
            Espace client
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(200,147,122,0.15)',
          borderRadius: 20,
          padding: '38px 34px',
          backdropFilter: 'blur(24px) saturate(160%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(200,147,122,0.08)',
        }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: 'rgba(243,237,225,0.95)', marginBottom: 6, letterSpacing: '-0.3px' }}>
            Bienvenue
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(160,140,120,0.85)', marginBottom: 30 }}>
            Connectez-vous pour accéder à votre espace client.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Adresse e-mail</label>
              <div style={{ position: 'relative' }}>
                <i className="bx bx-envelope" style={iconStyle} />
                <input type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="client@demo.ma" style={inputStyle} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <i className="bx bx-lock-alt" style={iconStyle} />
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(200,147,122,0.6)', fontSize: 17, display: 'flex', alignItems: 'center' }}>
                  <i className={`bx ${showPw ? 'bx-hide' : 'bx-show'}`} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <label style={{ fontSize: 13, color: 'rgba(160,140,120,0.75)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 14, height: 14, accentColor: '#C8937A', cursor: 'pointer' }} />
                Se souvenir de moi
              </label>
              <Link to="/" style={{ fontSize: 12.5, color: 'rgba(200,147,122,0.75)', textDecoration: 'none' }}>
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: loading ? 'rgba(123,31,48,0.5)' : 'linear-gradient(135deg, #7B1F30 0%, #C8937A 100%)',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: 13, fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              cursor: loading ? 'wait' : 'pointer', marginTop: 8,
              transition: 'all 0.25s', letterSpacing: '0.3px',
              boxShadow: '0 4px 15px rgba(123,31,48,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading ? (
                <><span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Connexion…</>
              ) : (
                <><i className="bx bx-log-in" /> Se connecter</>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: 28, borderTop: '1px solid rgba(200,147,122,0.12)', paddingTop: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(200,147,122,0.55)', display: 'block', marginBottom: 12 }}>
              Comptes de démonstration
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.email} type="button" onClick={() => fillDemo(acc.email)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(200,147,122,0.12)',
                    borderRadius: 10, padding: '10px 14px',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    fontFamily: 'Inter, sans-serif', transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(123,31,48,0.12)'; e.currentTarget.style.borderColor = 'rgba(123,31,48,0.28)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(200,147,122,0.12)'; }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: acc.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {acc.prenom[0]}{acc.nom[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(243,237,225,0.90)' }}>{acc.prenom} {acc.nom}</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(160,140,120,0.70)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.email}</div>
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 20, flexShrink: 0, background: acc.badge.bg, color: acc.badge.color }}>
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 12.5, color: 'rgba(160,140,120,0.60)' }}>
            Pas encore de compte ?{' '}
            <Link to="/inscription" style={{ color: 'rgba(200,147,122,0.90)', fontWeight: 600, textDecoration: 'none' }}>
              Créer un compte
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(160,140,120,0.35)' }}>
          © {new Date().getFullYear()} MusicStore Maroc — Tous droits réservés.
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 12.5, fontWeight: 600,
  color: 'rgba(200,147,122,0.80)',
  marginBottom: 6, display: 'block',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};

const iconStyle = {
  position: 'absolute', left: 13, top: '50%',
  transform: 'translateY(-50%)',
  color: 'rgba(200,147,122,0.55)', fontSize: 17, pointerEvents: 'none',
};

const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(200,147,122,0.18)',
  borderRadius: 10,
  color: 'rgba(243,237,225,0.92)',
  fontSize: 14, fontFamily: 'Inter, sans-serif',
  padding: '11px 14px 11px 40px',
  width: '100%',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  outline: 'none',
};
