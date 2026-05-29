import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

/* ──────────────────────────────────────────────
   Matches the Laravel admin topbar + sidebar
   style exactly: Inter, bordeaux/rosegold palette,
   same backdrop-blur, same icon buttons
────────────────────────────────────────────── */

export default function Header() {
  const { isAuthenticated, membre, logout } = useAuth();
  const { count }    = useCart();
  const navigate     = useNavigate();
  const [search, setSearch]     = useState('');
  const [mobileOpen, setMobile] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setUserOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const onSearch = e => {
    e.preventDefault();
    if (search.trim()) { navigate(`/produits?search=${encodeURIComponent(search.trim())}`); setSearch(''); setMobile(false); }
  };

  const onLogout = async () => {
    await logout();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  const NAV = [
    { to: '/',           label: 'Accueil',    end: true },
    { to: '/produits',   label: 'Produits',   end: false },
    { to: '/categories', label: 'Catégories', end: false },
    { to: '/marques',    label: 'Marques',    end: false },
    { to: '/contact',    label: 'Contact',    end: false },
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Bordeaux top banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7B1F30 0%, #9B3F50 100%)',
        color: 'rgba(255,255,255,0.88)', fontSize: 12,
        textAlign: 'center', padding: '5px 16px', letterSpacing: '0.2px',
      }}>
        Livraison gratuite dès 500 MAD · Paiement à la livraison disponible
      </div>

      {/* Main topbar */}
      <div style={{
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--bd-med)',
        boxShadow: 'var(--sh-xs)',
        height: 64,
        display: 'flex', alignItems: 'center',
        gap: 12, padding: '0 24px',
      }}>
        {/* Brand */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, #7B1F30, #C8937A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 17,
            boxShadow: '0 3px 10px rgba(123,31,48,0.35)',
          }}>
            <i className="bx bxs-music" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>
            Luxe<span style={{ fontWeight: 300, color: 'var(--rosegold)' }}>Shop</span>
          </span>
        </Link>

        {/* Search (hidden on mobile) */}
        <form onSubmit={onSearch} className="search-desktop" style={{
          flex: 1, maxWidth: 360, position: 'relative',
          display: 'block',
        }}>
          <i className="bx bx-search" style={{
            position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-secondary)', fontSize: 17, pointerEvents: 'none',
          }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit…"
            style={{
              width: '100%', height: 38,
              background: 'var(--bg-input)',
              border: '1px solid var(--bd-med)',
              borderRadius: 100, padding: '0 16px 0 40px',
              fontSize: 13, color: 'var(--text-primary)',
              fontFamily: 'inherit', outline: 'none',
              transition: 'all 0.22s',
            }}
            onFocus={e => { e.target.style.background = 'var(--bg-card)'; e.target.style.borderColor = 'rgba(123,31,48,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(123,31,48,0.12)'; }}
            onBlur={e => { e.target.style.background = ''; e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
          />
        </form>

        {/* Nav links (desktop) */}
        <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              style={({ isActive }) => ({
                display: 'inline-flex', alignItems: 'center',
                padding: '6px 11px', fontSize: 13.5, fontWeight: isActive ? 600 : 450,
                color: isActive ? 'var(--bordeaux)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(123,31,48,0.07)' : 'transparent',
                borderRadius: 8, textDecoration: 'none', transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              })}
              onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) { e.currentTarget.style.color = 'var(--bordeaux)'; e.currentTarget.style.background = 'rgba(123,31,48,0.05)'; } }}
              onMouseLeave={e => { if (!e.currentTarget.dataset.active) { e.currentTarget.style.color = ''; e.currentTarget.style.background = ''; } }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right zone */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Cart */}
          <Link to="/panier" style={{
            width: 38, height: 38, border: 'none', background: 'transparent',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 20,
            textDecoration: 'none', position: 'relative', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(123,31,48,0.07)'; e.currentTarget.style.color = 'var(--bordeaux)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}>
            <i className="bx bx-cart" />
            {count > 0 && (
              <span style={{
                position: 'absolute', top: 5, right: 4,
                minWidth: 16, height: 16, borderRadius: 100,
                background: 'var(--bordeaux)', color: '#fff',
                fontSize: 9.5, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 3px', border: '2px solid var(--bg-nav)', lineHeight: 1,
              }}>
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>

          {/* Sep */}
          <div style={{ width: 1, height: 22, background: 'var(--bd-med)', margin: '0 6px' }} />

          {/* User */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={dropRef}>
              <button onClick={() => setUserOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  border: 'none', background: 'transparent',
                  cursor: 'pointer', padding: '0 6px 0 0', borderRadius: 8,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(123,31,48,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', overflow: 'hidden',
                  border: '2px solid rgba(123,31,48,0.28)', flexShrink: 0,
                }}>
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #7B1F30, #C8937A)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 12.5, fontWeight: 600,
                  }}>
                    {(membre?.prenom?.[0] || '') + (membre?.nom?.[0] || '')}
                  </div>
                </div>
                <div style={{ textAlign: 'left', display: 'none' }} className="avatar-info-desktop">
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{membre?.prenom}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Client</div>
                </div>
              </button>

              {userOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--bd-med)',
                  borderRadius: 12,
                  boxShadow: 'var(--sh-lg)',
                  padding: 6, minWidth: 220, zIndex: 300,
                }}>
                  <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--bd-soft)', marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{membre?.prenom} {membre?.nom}</p>
                    <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', margin: 0 }}>{membre?.email}</p>
                  </div>
                  {[
                    ['/profil', 'bx-user', 'Mon profil'],
                    ['/commandes', 'bx-package', 'Mes commandes'],
                    ['/panier', 'bx-cart', 'Mon panier'],
                  ].map(([to, icon, label]) => (
                    <Link key={to} to={to} onClick={() => setUserOpen(false)}
                      style={dropItemStyle}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(123,31,48,0.06)'; e.currentTarget.style.color = 'var(--bordeaux)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}>
                      <i className={`bx ${icon}`} style={{ fontSize: 16 }} /> {label}
                    </Link>
                  ))}
                  <hr style={{ border: 'none', borderTop: '1px solid var(--bd-soft)', margin: '5px 0' }} />
                  <button onClick={onLogout} style={{ ...dropItemStyle, color: '#c62828', width: '100%', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(198,40,40,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
                    <i className="bx bx-log-out" style={{ fontSize: 16 }} /> Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/connexion" style={{ ...ghostBtnStyle }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(123,31,48,0.06)'; e.currentTarget.style.borderColor = 'rgba(123,31,48,0.28)'; e.currentTarget.style.color = 'var(--bordeaux)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}>
                Connexion
              </Link>
              <Link to="/inscription" style={primaryBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#5E1624 0%,#7B1F30 100%)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(123,31,48,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                S'inscrire
              </Link>
            </>
          )}

          {/* Hamburger */}
          <button className="ham-btn" onClick={() => setMobile(v => !v)}
            style={{ width: 38, height: 38, border: 'none', background: 'transparent', borderRadius: 8, display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 22 }}>
            <i className={`bx ${mobileOpen ? 'bx-x' : 'bx-menu'}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--bd-soft)', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <form onSubmit={onSearch} style={{ position: 'relative', marginBottom: 10 }}>
            <i className="bx bx-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: 16 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
              style={{ width: '100%', height: 36, background: 'var(--bg-input)', border: '1px solid var(--bd-med)', borderRadius: 100, padding: '0 14px 0 38px', fontSize: 13, color: 'var(--text-primary)', outline: 'none' }} />
          </form>
          {NAV.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobile(false)}
              style={({ isActive }) => ({ display: 'block', padding: '8px 10px', fontSize: 14, fontWeight: isActive ? 600 : 450, color: isActive ? 'var(--bordeaux)' : 'var(--text-secondary)', background: isActive ? 'rgba(123,31,48,0.06)' : 'transparent', borderRadius: 8, textDecoration: 'none' })}>
              {label}
            </NavLink>
          ))}
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Link to="/connexion" style={ghostBtnStyle} onClick={() => setMobile(false)}>Connexion</Link>
              <Link to="/inscription" style={primaryBtnStyle} onClick={() => setMobile(false)}>S'inscrire</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 1023px) { .nav-desktop { display: none !important; } .ham-btn { display: flex !important; } }
        @media (max-width: 767px) { .search-desktop { display: none !important; } }
        @media (min-width: 1024px) { .avatar-info-desktop { display: block !important; } }
      `}</style>
    </header>
  );
}

const dropItemStyle = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '9px 12px', borderRadius: 8,
  fontSize: 13, color: 'var(--text-secondary)',
  textDecoration: 'none', transition: 'all 0.2s',
  border: 'none', background: 'transparent', fontFamily: 'inherit',
};

const ghostBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 14px',
  background: 'transparent',
  color: 'var(--text-secondary)',
  border: '1px solid var(--bd-med)',
  borderRadius: 8,
  fontSize: 13, fontWeight: 450,
  fontFamily: 'inherit',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'all 0.22s',
  whiteSpace: 'nowrap',
};

const primaryBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '8px 16px',
  background: 'linear-gradient(135deg, #7B1F30 0%, #9B3F50 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: 13, fontWeight: 500,
  fontFamily: 'inherit',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'all 0.22s',
  whiteSpace: 'nowrap',
};
