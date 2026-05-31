import React from 'react';
import ScoreGauge from './ScoreGauge';

export default function CoachingReport({ report, imageUrl }) {
  if (!report) return null;

  const {
    overallScore,
    strengths = [],
    areasToImprove = [],
    priorityFix = "",
    drillSuggestion = "",
    confidenceLevel = "Medium",
    confidenceReason = ""
  } = report;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Image & Score Overview */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '24px',
        alignItems: 'stretch',
        width: '100%',
        flexWrap: 'wrap' // Wrap gracefully only on very narrow screens
      }}>
        {/* Stance Photo */}
        {imageUrl && (
          <div style={{
            flex: '1 1 300px',
            background: 'var(--bg-secondary)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '272px',
            boxSizing: 'border-box'
          }}>
            <img 
              src={imageUrl} 
              alt="Analyzed Stance" 
              style={{
                maxWidth: '100%',
                maxHeight: '248px',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
          </div>
        )}

        {/* Score and Stats block */}
        <div style={{
          flex: '1 1 340px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          boxSizing: 'border-box'
        }}>
          {/* Row container to display ScoreGauge and Feedback Image side-by-side */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            width: '100%',
            flexWrap: 'wrap'
          }}>
            <ScoreGauge score={overallScore} />
            
            {/* Dynamic perfectly square score-based feedback photo */}
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(15, 19, 42, 0.6) 0%, rgba(8, 11, 26, 0.7) 100%)',
              flexShrink: 0,
              boxSizing: 'border-box'
            }}>
              <img 
                src={`/assets/${overallScore}.png`} 
                alt={`Feedback for score ${overallScore}`} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover' // Guarantees a perfect square crop
                }}
              />
            </div>
          </div>
          
          <div style={{
            width: '100%',
            fontSize: '0.85rem',
            lineHeight: '1.5',
            color: 'var(--text-secondary)',
            background: 'rgba(255, 255, 255, 0.01)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.03)'
          }}>
            <p><strong>Confidence:</strong> {confidenceLevel}</p>
            {confidenceReason && <p style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{confidenceReason}</p>}
          </div>
        </div>
      </div>

      {/* Priority Fix */}
      {priorityFix && (
        <div style={{
          padding: '16px',
          background: 'rgba(255, 59, 48, 0.08)',
          border: '1px solid rgba(255, 59, 48, 0.2)',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: 'var(--accent-red)', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
            Priority Action Item
          </h4>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
            {priorityFix}
          </p>
        </div>
      )}

      {/* Flaws / Areas to Improve */}
      <div>
        <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Technical Flaws
        </h4>
        {areasToImprove.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No flaws identified.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {areasToImprove.map((item, idx) => (
              <div key={idx} style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderLeft: '3px solid var(--accent-red)',
                borderRadius: '0 8px 8px 0'
              }}>
                <h5 style={{ fontSize: '0.9rem', color: 'var(--accent-red)', marginBottom: '4px' }}>
                  {idx + 1}. {item.issue}
                </h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strengths */}
      <div>
        <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '12px' }}>
          Correct Elements
        </h4>
        {strengths.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No correct elements identified.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {strengths.map((str, idx) => (
              <span key={idx} className="badge badge-green" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                ✓ {str}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Drill Suggestion */}
      {drillSuggestion && (
        <div style={{
          padding: '16px',
          background: 'rgba(0, 242, 254, 0.03)',
          border: '1px solid rgba(0, 242, 254, 0.1)',
          borderRadius: '8px'
        }}>
          <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
            Remediation Net Drill
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
            {drillSuggestion}
          </p>
        </div>
      )}
    </div>
  );
}
