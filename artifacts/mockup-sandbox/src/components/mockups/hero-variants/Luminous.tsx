export default function Luminous() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: "'Georgia', serif",
        backgroundColor: '#F8F7F4',
      }}
    >
      {/* Full-bleed painting background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/__mockup/images/painting.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Deeper radial vignette — darkens edges, clears center */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(28,20,12,0.55) 100%)',
        }}
      />

      {/* Warm bottom fade to cream */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, transparent 45%, rgba(248,247,244,0.85) 100%)',
        }}
      />

      {/* Portrait */}
      <div style={{ position: 'relative', zIndex: 10, marginBottom: '1.5rem' }}>
        {/* Gold ring */}
        <div
          style={{
            width: '162px',
            height: '162px',
            borderRadius: '50%',
            padding: '3px',
            background: 'linear-gradient(135deg, #C47A1E 0%, #E8B84B 50%, #C47A1E 100%)',
            boxShadow: '0 0 0 1px rgba(196,122,30,0.25), 0 8px 40px rgba(0,0,0,0.35)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(248,247,244,0.6)',
            }}
          >
            <img
              src="/__mockup/images/jackie_portrait1.jpg"
              alt="Jacquelin Anne Hellenberg"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>
        </div>
      </div>

      {/* Text block */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 1.5rem',
          maxWidth: '680px',
        }}
      >
        {/* Hairline gold rule above label */}
        <div
          style={{
            width: '48px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #C47A1E, transparent)',
            margin: '0 auto 1rem',
          }}
        />

        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(26,26,26,0.65)',
            marginBottom: '1rem',
          }}
        >
          In Memory Of
        </p>

        <h1
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 'clamp(2.6rem, 7vw, 4.2rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            color: '#1A1A1A',
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em',
          }}
        >
          Jacquelin Anne
          <br />
          <em>Hellenberg</em>
        </h1>

        {/* Hairline gold rule below name */}
        <div
          style={{
            width: '80px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #C47A1E, transparent)',
            margin: '0.9rem auto',
          }}
        />

        <p
          style={{
            fontSize: '1.05rem',
            color: 'rgba(26,26,26,0.55)',
            fontWeight: 300,
            letterSpacing: '0.15em',
            marginBottom: '1.5rem',
          }}
        >
          1965 — 2025
        </p>

        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: '1rem',
            color: 'rgba(26,26,26,0.5)',
            fontStyle: 'italic',
            lineHeight: 1.75,
            maxWidth: '400px',
            margin: '0 auto',
          }}
        >
          Mother, daughter, sister, friend.
          <br />
          Her warmth, her cooking, and her laughter live on
          in everyone she loved.
        </p>
      </div>

      {/* Scroll cue */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(26,26,26,0.45)',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, #C47A1E, rgba(196,122,30,0))',
          }}
        />
      </div>

      {/* Label badge */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'rgba(196,122,30,0.9)',
          color: '#fff',
          fontSize: '0.65rem',
          fontFamily: 'monospace',
          letterSpacing: '0.12em',
          padding: '0.25rem 0.6rem',
          borderRadius: '2px',
          zIndex: 20,
          textTransform: 'uppercase',
        }}
      >
        Variation A — Luminous
      </div>
    </div>
  );
}
