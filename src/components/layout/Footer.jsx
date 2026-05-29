import { Link } from 'react-router-dom';

export default function Footer() {
  const NAV   = [['/', 'Accueil'], ['/produits', 'Produits'], ['/categories', 'Catégories'], ['/marques', 'Marques'], ['/contact', 'Contact']];
  const ACCT  = [['/connexion', 'Connexion'], ['/inscription', 'Inscription'], ['/profil', 'Mon profil'], ['/commandes', 'Mes commandes'], ['/panier', 'Mon panier']];

  return (
    <footer className="footer-root">
      <div className="footer-inner">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 32 }}>
          {/* Brand */}
          <div>
            <p className="footer-brand"><span>Music</span>Store</p>
            <p style={{ fontSize: 13, color: 'rgba(237,229,216,0.45)', lineHeight: 1.7, margin: '12px 0 16px' }}>
              Votre destination musicale au Maroc. Guitares, basses, claviers, batteries et bien plus encore.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['bxl-facebook', 'bxl-instagram', 'bxl-youtube'].map(icon => (
                <a key={icon} href="#" className="footer-social-btn">
                  <i className={`bx ${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--rosegold)', marginBottom: 14 }}>
              Navigation
            </p>
            {NAV.map(([to, label]) => (
              <Link key={to} to={to} className="footer-link">{label}</Link>
            ))}
          </div>

          {/* Account */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--rosegold)', marginBottom: 14 }}>
              Mon compte
            </p>
            {ACCT.map(([to, label]) => (
              <Link key={to} to={to} className="footer-link">{label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--rosegold)', marginBottom: 14 }}>
              Contact
            </p>
            {[
              ['bx-map', '123 Avenue Hassan II, Casablanca'],
              ['bx-phone', '+212 522 000 000'],
              ['bx-envelope', 'contact@musicstore.ma'],
            ].map(([icon, text]) => (
              <div key={icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                <i className={`bx ${icon}`} style={{ color: 'var(--rosegold)', fontSize: 15, marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'rgba(237,229,216,0.50)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <hr className="footer-divider" />
        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(237,229,216,0.30)', paddingTop: 20 }}>
          © {new Date().getFullYear()} MusicStore Maroc — Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
