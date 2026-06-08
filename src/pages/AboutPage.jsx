import { Award, Shield, Music, ChevronRight, Sliders } from "lucide-react";

const services = [
  { icon: Music,   title: "Instruments Premium", desc: "Chaque guitare, piano ou cuivre est inspecté et accordé par nos luthiers partenaires avant expédition." },
  { icon: Shield,  title: "Garantie & Authenticité", desc: "Toutes nos pièces sont certifiées 100% authentiques avec une garantie constructeur officielle." },
  { icon: Sliders, title: "Conseils d'Experts",    desc: "Une équipe de musiciens professionnels à votre écoute pour configurer votre setup parfait." },
  { icon: Award,   title: "Livraison Sécurisée",  desc: "Emballage blindé anti-chocs et assurance totale sur le transport partout au Maroc." },
];

const stats = [
  { val: "1 200+", label: "Instruments vendus" },
  { val: "25+",    label: "Marques Partenaires" },
  { val: "99%",    label: "Artistes satisfaits" },
  { val: "10 ans", label: "De passion partagée" },
];

export default function AboutPage() {
  return (
    <>
      <style>{`
        :root {
          --bg: #F2EFE9;
          --card: #fff;
          --txt: #1a1a1a;
          --sub: #5a5550;
          --blk: #0F0F0F;
          --rosegold: #b76e79; 
          --border: rgba(183, 110, 121, 0.22); 
        }
        
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        
        body { 
          background: var(--bg); 
          font-family: sans-serif; 
          color: var(--txt);
          -webkit-font-smoothing: antialiased;
        }

        /* ═══ BANDEAU HERO EN HAUT ═══ */
        .about-hero {
          position: relative;
          width: 100%;
          height: 450px;
          /* Nouvelle image : Studio / Lutherie haut de gamme */
          background: linear-gradient(to right, rgba(15, 15, 15, 0.9) 30%, rgba(15, 15, 15, 0.4) 100%), 
                      url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=cover');
          background-size: cover;
          background-position: center 35%;
          display: flex;
          align-items: center;
          margin-bottom: 60px;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        .hero-title-box {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ═══ ABOUT SECTION ═══ */
        .about-section { padding: 0 0 100px; background: var(--bg); }
        .c-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        /* ── MAIN GRID ── */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
          margin-bottom: 80px;
        }
        @media(max-width: 900px) { .about-grid { grid-template-columns: 1fr; gap: 40px; } }

        /* ── IMAGE SIDE ── */
        .image-side {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: var(--blk);
          border: 1px solid var(--border);
          box-shadow: 0 24px 64px rgba(0,0,0,0.12);
        }
        .image-side::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; z-index: 5;
          background: linear-gradient(90deg, transparent, var(--rosegold), transparent);
          pointer-events: none;
        }
        .about-img {
          width: 100%;
          aspect-ratio: 16/10;
          object-fit: cover;
          display: block;
          filter: grayscale(15%) contrast(105%);
          transition: transform 0.5s ease;
        }
        .image-side:hover .about-img {
          transform: scale(1.03);
        }
        .image-caption {
          padding: 14px 18px;
          display: flex; align-items: center; gap: .6rem;
          background: var(--blk);
          border-top: 1px solid rgba(237,229,216,0.1);
        }
        .image-caption-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--rosegold);
          flex-shrink: 0;
        }
        .image-caption-txt {
          font-size: 11px; font-weight: 600; letter-spacing: .12em;
          color: var(--rosegold); text-transform: uppercase;
        }
        .image-caption-sub {
          font-size: 10.5px; color: rgba(237,229,216,0.35);
          letter-spacing: .06em; margin-left: auto;
        }

        /* ── TEXT SIDE ── */
        .sec-eyebrow {
          font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
          color: var(--rosegold); display: block; margin-bottom: 10px;
        }
        .sec-title {
          font-size: clamp(1.9rem, 3vw, 2.6rem); font-weight: 700;
          color: var(--txt); letter-spacing: .02em; line-height: 1.2; margin-bottom: 20px;
        }
        .sec-title span { color: var(--rosegold); font-weight: inherit; }
        
        .sec-desc { font-size: 14.5px; line-height: 1.8; color: var(--sub); margin-bottom: 16px; }
        .sec-desc strong { color: var(--txt); font-weight: 600; }
        
        .about-cta {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: 12px 28px;
          background: var(--blk); border: 1px solid var(--blk); border-radius: 4px;
          color: var(--rosegold); text-decoration: none;
          font-size: 11.5px; font-weight: 700;
          letter-spacing: .15em; text-transform: uppercase;
          transition: all .25s ease;
          margin-top: 12px;
        }
        .about-cta:hover { background: #1c1c1c; }

        /* ═══ STATS ═══ */
        .stats-bar {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
          margin-bottom: 80px;
        }
        @media(max-width: 768px) { .stats-bar { grid-template-columns: repeat(2, 1fr); } }
        
        .stat-box {
          background: var(--card); border: 1px solid var(--border); border-radius: 8px;
          padding: 24px 16px; text-align: center;
          transition: all .25s;
        }
        .stat-box:hover { border-color: var(--rosegold); box-shadow: 0 8px 28px rgba(0,0,0,0.06); }
        .stat-val { font-size: 2.3rem; font-weight: 700; color: var(--rosegold); line-height: 1; }
        .stat-label { font-size: 11px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; color: var(--sub); margin-top: 6px; }

        /* ═══ SERVICES ═══ */
        .services-header { text-align: center; margin-bottom: 44px; }
        .services-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px;
        }
        @media(max-width: 960px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 480px) { .services-grid { grid-template-columns: 1fr; } }

        .srv-card {
          background: var(--card); border: 1px solid var(--border); border-radius: 9px;
          padding: 28px 22px; position: relative; transition: all .3s;
        }
        .srv-card:hover { border-color: var(--rosegold); box-shadow: 0 12px 36px rgba(0,0,0,0.06); transform: translateY(-4px); }
        .srv-icon { 
          width: 46px; height: 46px; background: rgba(183, 110, 121, 0.1); 
          border: 1px solid rgba(183, 110, 121, 0.2); border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; margin-bottom: 16px; 
        }
        .srv-icon svg { color: var(--rosegold); }
        .srv-title { font-size: 16px; font-weight: 600; color: var(--txt); margin-bottom: 8px; }
        .srv-desc { font-size: 13.5px; line-height: 1.7; color: var(--sub); }
      `}</style>

      {/* ═══ BANDEAU ARRIÈRE-PLAN HAUT DE PAGE ═══ */}
      <div className="about-hero">
        <div className="hero-title-box">
          <span style={{ color: 'var(--rosegold)', textTransform: 'uppercase', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
            Notre Histoire
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#FFF', letterSpacing: '-1px', margin: 0, lineHeight: '1.1' }}>
            À Propos de Music Store
          </h1>
          <p style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#eaeaea', maxWidth: '500px', marginTop: '12px', lineHeight: '1.5' }}>
            Découvrez notre univers dédié aux passionnés, professionnels de la scène et amoureux du son parfait.
          </p>
        </div>
      </div>

      {/* ═══ ABOUT SECTION ═══ */}
      <section className="about-section">
        <div className="c-wrap">

          {/* ── GRILLE PRINCIPALE (IMAGE + TEXTE) ── */}
          <div className="about-grid">

            {/* IMAGE SIDE */}
            <div className="image-side">
              <img 
                className="about-img" 
                src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=cover" 
                alt="Music Store Workshop"
              />
              <div className="image-caption">
                <div className="image-caption-dot"/>
                <span className="image-caption-txt">L'Atelier Luthier · Sélection d'Excellence</span>
                <span className="image-caption-sub">Savoir-Faire Artisanal</span>
              </div>
            </div>

            {/* TEXT SIDE */}
            <div className="text-side">
              <span className="sec-eyebrow">Qui sommes-nous</span>
              <h2 className="sec-title">
                L'Art de la <span>Musique</span><br/>& de la Haute Lutherie
              </h2>
              <p className="sec-desc">
                Fondée à Casablanca, <strong>Music Store</strong> est née d'un amour profond pour l'art sonore et la perfection technique. Nous sélectionnons méticuleusement les meilleurs instruments et équipements pour les musiciens exigeants, des virtuoses aux passionnés de home-studio.
              </p>
              <p className="sec-desc">
                Chaque instrument possède son identité propre. C'est pourquoi nous collaborons main dans la main avec les plus grandes manufactures et artisans internationaux afin de donner vie à votre créativité sur les scènes du Maroc et d'ailleurs.
              </p>
              <a href="/produits" className="about-cta">
                Découvrir notre collection <ChevronRight size={13}/>
              </a>
            </div>

          </div>

          {/* ── STATS BAR ── */}
          <div className="stats-bar">
            {stats.map(({ val, label }) => (
              <div className="stat-box" key={label}>
                <div className="stat-val">{val}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* ── SERVICES / GARANTIES ── */}
          <div className="services-header">
            <span className="sec-eyebrow">L'expérience Music Store</span>
            <h2 className="sec-title">
              Nos <span>Garanties</span> d'Exception
            </h2>
          </div>

          <div className="services-grid">
            {services.map(({ icon:Icon, title, desc }) => (
              <div className="srv-card" key={title}>
                <div className="srv-icon"><Icon size={18}/></div>
                <h3 className="srv-title">{title}</h3>
                <p className="srv-desc">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}