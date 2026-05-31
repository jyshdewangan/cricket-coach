import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ImageUploader from '../components/ImageUploader';
import CoachingReport from '../components/CoachingReport';
import SessionCard from '../components/SessionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { createSession, getSessions } from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  
  // State for AI response
  const [latestReport, setLatestReport] = useState(null);
  const [latestImageUrl, setLatestImageUrl] = useState(null);
  
  // State for session history
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  
  // Loading & Error states for active analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Fetch session history callback
  const fetchHistory = useCallback(async (page = 0) => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await getSessions(page, 6);
      if (res.data) {
        setHistory(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setCurrentPage(res.data.number || 0);
      }
    } catch (err) {
      console.error("Failed to load session history:", err);
      setHistoryError("Could not retrieve session history.");
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  // Fetch history on mount
  useEffect(() => {
    fetchHistory(0);
  }, [fetchHistory]);

  // Handle stance analysis upload
  const handleAnalyze = async (file) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setLatestReport(null);
    setLatestImageUrl(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await createSession(formData);
      if (res.data) {
        setLatestReport(res.data);
        
        // Resolve image URL using the correct DTO field name 'imagePath'
        const rawPath = res.data.imagePath;
        const resolvedUrl = rawPath.startsWith('uploads/') ? `/${rawPath}` : `/uploads/${rawPath}`;
        setLatestImageUrl(resolvedUrl);

        // Reload history
        fetchHistory(0);
        
        // Scroll smoothly to results
        setTimeout(() => {
          document.getElementById('ai-results-anchor')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error("Stance analysis failed:", err);
      setAnalysisError(
        err.response?.data?.message || 
        "The AI coach encountered a processing defect. Please ensure your image is clear and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      fetchHistory(pageNumber);
      document.getElementById('history-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetUploader = () => {
    setLatestReport(null);
    setLatestImageUrl(null);
    setAnalysisError(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Simple Welcome Section */}
        <section style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          paddingBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>
              Athlete Portal: {user?.fullName}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Standard Profile: <strong>{user?.role}</strong> ({user?.experienceLevel} level)
            </p>
          </div>
          
          <span className="badge badge-cyan">
            {user?.sport} Stance Diagnostics
          </span>
        </section>

        {/* Section 1: Upload / Action Zone */}
        <section style={{ maxWidth: '720px', width: '100%', margin: '0 auto' }}>
          {isAnalyzing ? (
            <div className="premium-card" style={{ padding: '40px', border: '1px dashed var(--accent-cyan)' }}>
              <LoadingSpinner message="Interrogating stance and scoring fundamentals..." />
            </div>
          ) : latestReport ? (
            /* Switch uploader area to show a clean "Generate New Upload" card */
            <div className="premium-card" style={{
              padding: '32px',
              textAlign: 'center',
              border: '1px solid var(--accent-green)',
              background: 'rgba(52, 199, 89, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(52, 199, 89, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-green)',
                border: '1px solid rgba(52, 199, 89, 0.2)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>Stance Analysis Complete</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Review your score card and drills below, then click below to evaluate another stance.
                </p>
              </div>
              <button 
                onClick={handleResetUploader} 
                className="btn-primary" 
                style={{ 
                  padding: '10px 24px', 
                  fontSize: '0.85rem',
                  background: 'var(--grad-primary)',
                  border: 'none',
                  boxShadow: 'none'
                }}
              >
                Analyze New Stance
              </button>
            </div>
          ) : (
            <ImageUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          )}
        </section>

        {/* Section 2: Error Block */}
        {analysisError && (
          <section className="premium-card" style={{
            border: '1px solid rgba(255,59,48,0.2)',
            background: 'rgba(255,59,48,0.03)',
            padding: '20px',
            color: 'var(--accent-red)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            maxWidth: '720px',
            width: '100%',
            margin: '0 auto'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <h4 style={{ color: 'var(--accent-red)', fontSize: '0.95rem', fontWeight: 700 }}>AI Diagnostics Failure</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{analysisError}</p>
            </div>
          </section>
        )}

        {/* Section 3: Active AI Diagnosis Report */}
        {latestReport && (
          <section id="ai-results-anchor" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '720px', width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
                Active Evaluation Report
              </h3>
              <button 
                onClick={handleResetUploader}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.82rem'
                }}
              >
                Dismiss results
              </button>
            </div>
            
            <div className="premium-card" style={{ padding: '24px' }}>
              <CoachingReport report={latestReport} imageUrl={latestImageUrl} />
            </div>
          </section>
        )}

        {/* Section 4: Session History Feed */}
        <section id="history-anchor" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
                Diagnostic History Logs
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                Toggle any row below to expand the complete evaluation details in place
              </p>
            </div>
            
            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                  disabled={currentPage === 0 || isHistoryLoading}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Prev
                </button>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '0 4px' }}>
                  {currentPage + 1} / {totalPages}
                </span>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' }}
                  disabled={currentPage === totalPages - 1 || isHistoryLoading}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* History content */}
          {isHistoryLoading && history.length === 0 ? (
            <div className="premium-card" style={{ padding: '32px', textAlign: 'center' }}>
              <LoadingSpinner message="Querying session database..." />
            </div>
          ) : historyError ? (
            <div className="premium-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--accent-red)', fontSize: '0.9rem' }}>
              <p>{historyError}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="premium-card" style={{
              padding: '48px 32px',
              textAlign: 'center',
              border: '1px dashed rgba(255,255,255,0.08)'
            }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                No stance logs on record. Complete your first upload above.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}

          {/* Simple bottom page tags */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              marginTop: '8px'
            }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: currentPage === i ? 'var(--grad-primary)' : 'rgba(255,255,255,0.02)',
                    color: currentPage === i ? '#080b1a' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

        </section>

      </main>
    </div>
  );
}
