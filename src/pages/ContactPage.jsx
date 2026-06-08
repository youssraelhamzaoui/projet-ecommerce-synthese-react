import { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle, Share2, MessageCircle, Music, Video } from 'lucide-react';
import { sendContact } from '../api/contactApi';

const socials = [
  { icon: Music,          label: "Instagram", handle: "@musicstore.ma" },
  { icon: Share2,         label: "Facebook",  handle: "Music Store MA" },
  { icon: MessageCircle,  label: "Twitter",   handle: "@musicstore" },
  { icon: Video,          label: "YouTube",   handle: "Music Store" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', sujet: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendContact(form);
      setSent(true);
      setForm({ nom: '', email: '', telephone: '', sujet: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch {
      setError("Une erreur est survenue lors de l'envoi. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Raleway:wght@300;400;500;600;700&display=swap');
        :root{
          --gold:#D4AF37; --g2:#e8c84a; --blk:#0F0F0F;
          --wht:#F5F5F5; --bg:#F2EFE9; --card:#fff;
          --txt:#1a1a1a; --sub:#5a5550; --border:rgba(212,175,55,.22);
        }
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:var(--bg);font-family:'Raleway',sans-serif;color:var(--txt);}

        /* ═══ HERO ═══ */
        .hero{
          position:relative;
          height:62vh; min-height:280px;
          background-image: url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1600&q=85');
          background-size:cover;
          background-position:center;
        }
        .hero::before{
          content:'';position:absolute;top:0;left:0;right:0;height:3px;z-index:5;
          background:linear-gradient(90deg,transparent,var(--gold),var(--g2),var(--gold),transparent);
        }
        .hero::after{
          content:'';position:absolute;inset:0;
          background:linear-gradient(to bottom,rgba(5,4,3,.78) 0%,rgba(5,4,3,.42) 45%,rgba(5,4,3,.70) 100%);
        }

        /* ── NAV ── */
        .hero-nav{
          position:absolute;top:0;left:0;right:0;z-index:10;
          display:flex;align-items:center;justify-content:space-between;
          padding:22px 40px;
        }
        @media(max-width:600px){.hero-nav{padding:18px 20px;}}
        .hero-logo{
          font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:700;
          color:var(--wht);letter-spacing:.12em;text-transform:uppercase;text-decoration:none;
          display:flex;align-items:center;gap:.45rem;
        }
        .hero-logo-dot{width:6px;height:6px;background:var(--gold);border-radius:50%;}

        /* ── HERO CENTER ── */
        .hero-body{
          position:absolute;inset:0;z-index:6;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          text-align:center;gap:.8rem;padding:0 20px;
        }
        .hero-eyebrow{
          font-size:10px;font-weight:600;letter-spacing:.48em;text-transform:uppercase;
          color:rgba(212,175,55,.8);
          animation:fadeUp .55s ease both;
        }
        .hero-title{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(2.4rem,6vw,4.6rem);font-weight:700;
          color:var(--wht);letter-spacing:.06em;line-height:1.05;
          animation:fadeUp .55s .12s ease both;
        }
        .hero-title em{font-style:italic;font-weight:400;color:var(--gold);}
        .hero-divider{
          width:60px;height:1px;
          background:linear-gradient(90deg,transparent,var(--gold),transparent);
          animation:fadeUp .55s .22s ease both;
        }
        .hero-sub{
          font-size:12.5px;font-weight:400;letter-spacing:.24em;text-transform:uppercase;
          color:rgba(245,245,245,.48);
          animation:fadeUp .55s .3s ease both;
        }
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

        /* ═══ CONTACT SECTION ═══ */
        .contact-section{padding:80px 0 100px;background:var(--bg);}
        .c-wrap{max-width:1200px;margin:0 auto;padding:0 20px;}

        .sec-eyebrow{font-size:10.5px;font-weight:600;letter-spacing:.45em;text-transform:uppercase;color:rgba(212,175,55,.75);display:block;margin-bottom:.4rem;}
        .sec-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,3vw,2.5rem);font-weight:700;color:var(--txt);letter-spacing:.04em;line-height:1.1;margin:0;}
        .sec-title em{font-style:italic;font-weight:400;color:var(--gold);}

        /* ── INFO CARDS ── */
        .info-bar{
          display:flex;justify-content:center;align-items:center;
          gap:30px;flex-wrap:wrap;margin:0 auto 40px;text-align:center;
        }
        .info-card{
          background:var(--card);border:1px solid var(--border);border-radius:8px;
          padding:20px 16px;
          display:flex;flex-direction:column;align-items:center;gap:.6rem;
          text-align:center;
          transition:border-color .25s,box-shadow .25s;cursor:default;
        }
        .info-card:hover{border-color:rgba(212,175,55,.4);box-shadow:0 8px 24px rgba(0,0,0,.08);}
        .info-icon{
          width:42px;height:42px;
          background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.25);border-radius:50%;
          display:flex;align-items:center;justify-content:center;
        }
        .info-icon svg{color:var(--gold);}
        .info-label{font-size:10px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:var(--sub);}
        .info-val{font-size:13.5px;font-weight:600;color:var(--txt);line-height:1.4;}

        /* ── SOCIALS ── */
        .socials-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:40px;justify-content:center;}
        .soc-btn{
          display:flex;align-items:center;gap:.45rem;
          padding:8px 16px;border-radius:4px;
          background:var(--card);border:1px solid var(--border);
          font-size:12px;font-weight:600;color:var(--sub);
          cursor:pointer;text-decoration:none;transition:all .25s;
        }
        .soc-btn svg{color:var(--gold);}
        .soc-btn:hover{border-color:var(--gold);color:var(--txt);background:rgba(212,175,55,.07);}

        /* ── MAP + FORM GRID ── */
        .mf-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start;}
        @media(max-width:860px){.mf-grid{grid-template-columns:1fr;}}

        /* ── MAP ── */
        .map-card{
          background:var(--card);border:1px solid var(--border);border-radius:10px;
          overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.07);
        }
        .map-head{
          padding:14px 20px;display:flex;align-items:center;gap:.6rem;
          border-bottom:1px solid rgba(212,175,55,.12);background:var(--card);
        }
        .map-head svg{color:var(--gold);}
        .map-head-lbl{font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);}
        .map-frame{width:100%;height:420px;border:none;display:block;filter:saturate(.9);}
        @media(max-width:860px){.map-frame{height:300px;}}

        /* ── FORM ── */
        .cf-wrap{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:34px;box-shadow:0 8px 32px rgba(0,0,0,.07);}
        .cf-intro{font-size:14px;color:var(--sub);margin-bottom:24px;line-height:1.7;}
        .cf-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
        @media(max-width:520px){.cf-row{grid-template-columns:1fr;}}
        .cf-group{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
        .cf-label{font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--sub);}
        .cf-input,.cf-textarea{
          width:100%;padding:12px 15px;
          background:#faf8f4;border:1.5px solid rgba(212,175,55,.2);border-radius:5px;
          font-family:'Raleway',sans-serif;font-size:14.5px;color:var(--txt);
          outline:none;transition:border-color .25s,box-shadow .25s;
        }
        .cf-input:focus,.cf-textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(212,175,55,.1);}
        .cf-textarea{resize:vertical;min-height:120px;}
        .cf-btn{
          width:100%;padding:.85rem;
          background:var(--blk);border:1.5px solid var(--blk);border-radius:5px;
          color:var(--gold);font-family:'Raleway',sans-serif;
          font-size:11.5px;font-weight:700;letter-spacing:.25em;text-transform:uppercase;
          cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.55rem;
          position:relative;overflow:hidden;transition:background .25s,transform .2s;
        }
        .cf-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(212,175,55,.12),transparent);transform:translateX(-100%);transition:transform .45s;}
        .cf-btn:hover::before{transform:translateX(100%);}
        .cf-btn:hover{background:#1c1c1c;}
        .cf-btn:active{transform:scale(.98);}
        .cf-btn:disabled{opacity:.6;cursor:not-allowed;}
        .cf-success{
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:.8rem;padding:3rem 1rem;text-align:center;
          animation:fadeUp .4s ease both;
        }
        .cf-success-icon{color:#5a9e5a;}
        .cf-success h3{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;color:var(--txt);}
        .cf-success p{font-size:14px;color:var(--sub);}
        .cf-success-reset{
          margin-top:.5rem;font-size:13px;font-weight:600;color:var(--gold);
          background:none;border:none;cursor:pointer;letter-spacing:.08em;
          text-decoration:underline;text-underline-offset:3px;
        }
        .cf-error{color:#c0392b;font-size:13px;margin-top:10px;font-weight:500;}
      `}</style>

      {/* ═══ HERO ═══ */}
      <header className="hero">
        <div className="hero-body">
          <span className="hero-eyebrow">Music Store — Casablanca</span>
          <h1 className="hero-title">Nous <em>Contacter</em></h1>
          <div className="hero-divider" />
          <p className="hero-sub">Instruments de Musique · Service & Conseil</p>
        </div>
      </header>

      {/* ═══ CONTACT SECTION ═══ */}
      <section id="contact" className="contact-section">
        <div className="c-wrap">

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <span className="sec-eyebrow">On est là pour vous</span>
            <h2 className="sec-title">Prenez <em>Contact</em></h2>
          </div>

          {/* Info Cards */}
          <div className="info-bar">
            {[
              { icon: MapPin, label: "Adresse",   val: "123 Avenue Hassan II\nCasablanca 20000, Maroc" },
              { icon: Phone,  label: "Téléphone", val: "+212 522 000 000\nLun–Sam 9h–18h" },
              { icon: Mail,   label: "E-mail",    val: "contact@musicstore.ma" },
            ].map(({ icon: Icon, label, val }) => (
              <div className="info-card" key={label}>
                <div className="info-icon"><Icon size={16} /></div>
                <span className="info-label">{label}</span>
                <span className="info-val" style={{ whiteSpace: 'pre-line' }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Map + Form */}
          <div className="mf-grid">

            {/* MAP */}
            <div className="map-card">
              <div className="map-head">
                <MapPin size={15} />
                <span className="map-head-lbl">Casablanca — Maroc</span>
              </div>
              <iframe
                className="map-frame"
                title="Casablanca Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-7.7200,33.4800,-7.4800,33.6500&layer=mapnik&marker=33.5731,-7.5898"
                allowFullScreen
              />
            </div>

            {/* FORM */}
            <div className="cf-wrap">
              {sent ? (
                <div className="cf-success">
                  <CheckCircle size={52} className="cf-success-icon" />
                  <h3>Message envoyé !</h3>
                  <p>Nous vous répondrons dans les plus brefs délais.</p>
                  <button
                    className="cf-success-reset"
                    onClick={() => {
                      setSent(false);
                      setForm({ nom: '', email: '', telephone: '', sujet: '', message: '' });
                    }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <p className="cf-intro">
                    Une question sur un instrument, une commande ou un service après-vente ?
                    Notre équipe vous répond sous <strong>24h</strong>.
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="cf-row">
                      <div className="cf-group" style={{ marginBottom: 0 }}>
                        <label className="cf-label">Nom complet *</label>
                        <input className="cf-input" required placeholder="Votre nom"
                          value={form.nom} onChange={e => set('nom', e.target.value)} />
                      </div>
                      <div className="cf-group" style={{ marginBottom: 0 }}>
                        <label className="cf-label">Adresse e-mail *</label>
                        <input className="cf-input" required type="email" placeholder="votre@email.ma"
                          value={form.email} onChange={e => set('email', e.target.value)} />
                      </div>
                    </div>

                    <div className="cf-group">
                      <label className="cf-label">Téléphone</label>
                      <input className="cf-input" placeholder="+212 600 000 000"
                        value={form.telephone} onChange={e => set('telephone', e.target.value)} />
                    </div>

                    <div className="cf-group">
                      <label className="cf-label">Sujet *</label>
                      <input className="cf-input" required placeholder="Comment pouvons-nous vous aider ?"
                        value={form.sujet} onChange={e => set('sujet', e.target.value)} />
                    </div>

                    <div className="cf-group">
                      <label className="cf-label">Message *</label>
                      <textarea className="cf-textarea" required placeholder="Votre message..."
                        value={form.message} onChange={e => set('message', e.target.value)} />
                    </div>

                    <button className="cf-btn" type="submit" disabled={loading}>
                      <span>
                        {loading ? "Envoi en cours..." : "Envoyer le message"}
                      </span>
                    </button>

                    {error && <div className="cf-error">{error}</div>}
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Socials */}
          <div className="socials-row">
            {socials.map(({ icon: Icon, label, handle }) => (
              <a key={label} href="#" className="soc-btn">
                <Icon size={13} /> {label} — <span style={{ fontWeight: 400, opacity: .7 }}>{handle}</span>
              </a>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
