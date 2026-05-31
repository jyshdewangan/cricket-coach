import React from 'react';

export default function ScoreGauge({ score }) {
  const finalScore = Math.max(1, Math.min(10, score || 1));

  const getScoreTier = (val) => {
    if (val <= 3) return { text: 'Broken Fundamentals', color: 'var(--accent-red)' };
    if (val <= 5) return { text: 'Below Average', color: 'var(--accent-gold)' };
    if (val <= 7) return { text: 'Club Standard', color: '#34c759' };
    if (val <= 9) return { text: 'Strong Technique', color: 'var(--accent-cyan)' };
    return { text: 'Elite Textbook', color: 'var(--accent-cyan)' };
  };

  const tier = getScoreTier(finalScore);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      width: '160px',
      height: '160px',
      boxSizing: 'border-box',
      flexShrink: 0
    }}>
      <span style={{
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Technique Score
      </span>
      
      <span style={{
        fontSize: '2.5rem',
        fontWeight: 800,
        color: '#ffffff',
        fontFamily: 'var(--font-heading)'
      }}>
        {finalScore} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ 10</span>
      </span>
      
      <span style={{
        fontSize: '0.82rem',
        fontWeight: 600,
        color: tier.color
      }}>
        {tier.text}
      </span>
    </div>
  );
}
