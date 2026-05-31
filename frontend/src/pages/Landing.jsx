import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  useEffect(() => {
    // Inject Tenor Embed Script dynamically
    const scriptId = 'tenor-embed-script';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.src = "https://tenor.com/embed.js";
      script.id = scriptId;
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Re-scan DOM for embeds if script was already loaded
      if (window.Tenor && typeof window.Tenor.discover === 'function') {
        window.Tenor.discover();
      }
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
      {/* Background glow effects to keep design premium */}
      <div className="bg-glow-container" style={{ pointerEvents: 'none' }}>
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', zIndex: 1 }}>
        <div style={{
          width: '100%',
          maxWidth: '640px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}>
          {/* Tenor GIF Embed Container */}
          <div className="premium-card animate-fade-in" style={{
            maxWidth: '480px',
            width: '100%',
            margin: '0 auto',
            padding: '8px',
            background: 'linear-gradient(135deg, rgba(15, 19, 42, 0.6) 0%, rgba(8, 11, 26, 0.7) 100%)',
            border: '1px solid var(--border-glow)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 242, 254, 0.1)',
            overflow: 'hidden'
          }}>
            <div className="tenor-gif-embed"
              data-postid="22286922"
              data-share-method="host"
              data-aspect-ratio="1.77778"
              data-width="100%"
              style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <a href="https://tenor.com/view/virat-gif-22286922">Virat GIF</a> from <a href="https://tenor.com/search/virat-gifs">Virat GIFs</a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1 style={{
              fontSize: '2.55rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              fontFamily: 'var(--font-heading)'
            }}>
              Is your stance better than the GOAT?
            </h1>
          </div>

          <p style={{
            fontSize: '1.25rem',
            lineHeight: '1.6',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto',
            fontWeight: 500
          }}>
            Sign In to find out
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '8px'
          }}>
            <Link to="/login" className="btn-secondary" style={{ padding: '12px 32px', fontSize: '0.95rem', fontWeight: 600 }}>
              Log In
            </Link>
            <Link to="/register" className="btn-primary" style={{ padding: '12px 32px', fontSize: '0.95rem', fontWeight: 600 }}>
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
