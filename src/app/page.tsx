// src/app/page.tsx
export default function Home() {
  // Styles inline (aucun .css nécessaire)
  const hero: React.CSSProperties = {
    position: 'relative',
    minHeight: 'calc(100vh - 57px)', // plein écran moins le header
    backgroundImage: "url('/hero.jpeg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#111', // fallback si l'image n'est pas trouvée
  };

  const overlayBase: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(90vw, 1000px)',
  };

  const buttonsRow: React.CSSProperties = {
    ...overlayBase,
    top: '25%', // place les boutons au 1/4 haut de la page
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  };

  const btn: React.CSSProperties = {
    display: 'inline-block',
    padding: '12px 18px',
    border: '1px solid #e6e6e6',
    borderRadius: 10,
    background: '#fff',
    textDecoration: 'none',
    color: '#111',
    backdropFilter: 'blur(2px)',
  };

  const btnPrimary: React.CSSProperties = {
    ...btn,
    background: '#166534',
    color: '#fff',
    borderColor: '#166534',
  };

  const textWrap: React.CSSProperties = {
    ...overlayBase,
    top: '75%', // place le bloc texte aux 3/4 bas
  };

  const textBox: React.CSSProperties = {
    margin: '0 auto',
    maxWidth: 900,
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid #e6e6e6',
    borderRadius: 14,
    padding: '18px 20px',
    boxShadow: '0 10px 30px rgba(0,0,0,.08)',
  };

  const h1: React.CSSProperties = { margin: '0 0 6px', fontSize: 28, letterSpacing: '-0.01em' };
  const p: React.CSSProperties = { margin: 0, color: '#444', lineHeight: 1.5, fontSize: 16 };

  return (
    <main style={hero}>
      {/* Boutons */}
      <div style={buttonsRow}>
        <a style={btnPrimary} href="/identify">Identifier</a>
        <a style={btn} href="/taxa">Taxons</a>
      </div>

      {/* Texte */}
      <div style={textWrap}>
        <div style={textBox}>
          <h1 style={h1}>Bryo-Comté</h1>
          <p style={p}>
            Atlas visuel & outil d’identification des bryophytes — Forêt de la Comté.
            Un projet alliant esthétique et base documentaire accessible en ligne.
          </p>
        </div>
      </div>
    </main>
  );
}
