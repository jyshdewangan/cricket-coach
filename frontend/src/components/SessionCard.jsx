import React, { useState } from 'react';
import CoachingReport from './CoachingReport';

export default function SessionCard({ session }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    id,
    imagePath,
    overallScore,
    priorityFix,
    createdAt,
    sport,
    role,
    experienceLevel
  } = session;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getScoreBadgeClass = (score) => {
    if (score <= 3) return 'badge-red';
    if (score <= 5) return 'badge-gold';
    if (score <= 7) return 'badge-emerald';
    return 'badge-cyan';
  };

  const getStanceThumbnailUrl = () => {
    // In case the image is relative, point it properly.
    // The server proxy redirects '/uploads' to 'http://localhost:8080'
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('blob')) return imagePath;
    if (imagePath.startsWith('uploads/')) return `/${imagePath}`;
    if (imagePath.startsWith('/uploads/')) return imagePath;
    return `/uploads/${imagePath}`;
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className="premium-card animate-fade-in" 
      style={{ 
        cursor: 'pointer',
        borderLeft: isExpanded ? '4px solid var(--accent-cyan)' : '1px solid var(--border-color)',
        transition: 'all var(--transition-normal)',
        padding: '20px',
        overflow: 'hidden'
      }}
      onClick={handleToggle}
    >
      {/* Compact Card Layout */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '250px', flex: '1' }}>
          {/* Thumbnail */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <img 
              src={getStanceThumbnailUrl()} 
              alt="Stance Thumbnail" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          {/* Metadata */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                {role}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {formattedDate}
              </span>
            </div>
            
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '280px'
            }}>
              <strong>Fix:</strong> {priorityFix || "Technical analysis complete."}
            </p>
          </div>
        </div>

        {/* Score & Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Overall Score
            </span>
            <span className={`badge ${getScoreBadgeClass(overallScore)}`} style={{
              fontSize: '1rem',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '6px',
              marginTop: '4px'
            }}>
              {overallScore}/10
            </span>
          </div>

          <button
            onClick={handleToggle}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--transition-fast)'
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Report View */}
      {isExpanded && (
        <div 
          style={{ 
            marginTop: '24px', 
            paddingTop: '24px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            cursor: 'default'
          }}
          onClick={(e) => e.stopPropagation()} /* Prevent closing when clicking inner elements */
        >
          <CoachingReport 
            report={{
              overallScore,
              strengths: session.strengths,
              areasToImprove: session.areasToImprove,
              priorityFix,
              drillSuggestion: session.drillSuggestion,
              confidenceLevel: session.confidenceLevel,
              confidenceReason: session.confidenceReason
            }} 
            imageUrl={getStanceThumbnailUrl()} 
          />
        </div>
      )}
    </div>
  );
}
