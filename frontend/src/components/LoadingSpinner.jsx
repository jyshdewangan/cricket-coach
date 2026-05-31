import React from 'react';

export default function LoadingSpinner({ message = "Analyzing technique..." }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '24px'
    }}>
      <div className="spinner-container" style={{ position: 'relative', width: '80px', height: '80px' }}>
        {/* Outer glowing ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: 'var(--accent-cyan)',
          borderBottomColor: 'var(--accent-emerald)',
          animation: 'spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)'
        }}></div>
        
        {/* Inner reverse ring */}
        <div style={{
          position: 'absolute',
          inset: '10px',
          borderRadius: '50%',
          border: '3px solid transparent',
          borderLeftColor: 'var(--accent-gold)',
          borderRightColor: 'var(--accent-gold)',
          animation: 'spin-reverse 1.2s linear infinite',
          opacity: 0.8
        }}></div>

        {/* Cricket Ball Icon inside */}
        <div style={{
          position: 'absolute',
          inset: '20px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #b91c1c 0%, #7f1d1d 100%)',
          border: '2px dashed rgba(255, 255, 255, 0.4)', /* Seam of the cricket ball */
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5)',
          animation: 'pulse 1.5s infinite alternate'
        }}>
          {/* Seam line */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.8)',
            transform: 'rotate(45deg)',
            boxShadow: '0 0 4px rgba(255,255,255,0.6)'
          }}></div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <p style={{
          color: '#ffffff',
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          fontSize: '1.1rem',
          letterSpacing: '0.02em',
          margin: 0
        }}>{message}</p>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          marginTop: '6px'
        }}>Our elite AI coach is scrutinizing your technique...</p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); filter: drop-shadow(0 0 2px rgba(185, 28, 28, 0.4)); }
          100% { transform: scale(1.05); filter: drop-shadow(0 0 10px rgba(185, 28, 28, 0.8)); }
        }
      `}</style>
    </div>
  );
}
