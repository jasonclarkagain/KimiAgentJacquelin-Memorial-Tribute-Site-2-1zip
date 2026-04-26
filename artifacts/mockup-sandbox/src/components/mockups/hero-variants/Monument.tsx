export default function Monument() {
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
      {/* Full-bleed painting — softened with opacity overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/__mockup/images/painting.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.45,
        }}
      />

      {/* Soft cream wash so painting recedes */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(248,247,244,0.38)',
        }}
      />

      {/* Gentle bottom vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, transparent 50%, rgba(248,247,244,0.7) 100%)',
        }}
      />

      {/* Portrait — larger, double-ring treatment */}
      <div style={{ position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
        {/* Outer thin ring — cream */}
        <div
          style={{
            width: '208px',
            height: '208px',
            borderRadius: '50%',
            border: '1px solid rgba(196,122,30,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 60px rgba(0,0,0,0.18)',
          }}
        >
          {/* Inner ring — white */}
          <div
            style={{
              width: '192px',
              height: '192px',
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                overflow: 'hidden',
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
      </div>

      {/* Text block — scaled up, more monumental */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 1.5rem',
          maxWidth: '780px',
        }}
      >
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#C47A1E',
            marginBottom: '1.1rem',
          }}
        >
          In Memory Of
        </p>

        <h1
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 'clamp(3rem, 8.5vw, 5.5rem)',
            fontWeight: 400,
            lineHeight: 1.0,
            color: '#1A1A1A',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}
        >
          Jacquelin Anne
          <br />
          <em
            style={{
              fontStyle: 'italic',
              color: '#3A2A1A',
            }}
          >
            Hellenberg
          </em>
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'rgba(26,26,26,0.5)',
            fontWeight: 300,
            letterSpacing: '0.2em',
            marginBottom: '1.75rem',
          }}
        >
          1965 — 2025
        </p>

        {/* Wide thin rule */}
        <div
          style={{
            width: '120px',
            height: '1px',
            background: 'rgba(196,122,30,0.4)',
            margin: '0 auto 1.75rem',
          }}
        />

        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: '1.05rem',
            color: 'rgba(26,26,26,0.55)',
            fontStyle: 'italic',
            lineHeight: 1.8,
            maxWidth: '440px',
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
            color: 'rgba(26,26,26,0.4)',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(26,26,26,0.3), transparent)',
          }}
        />
      </div>

      {/* Label badge */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'rgba(26,26,26,0.75)',
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
        Variation B — Monument
      </div>
    </div>
  );
}
