import React, { useState, useRef } from 'react';

export default function ImageUploader({ onAnalyze, isAnalyzing }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validateAndSetFile = (file) => {
    setError(null);
    if (!file) return;

    // Check size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    // Check type
    if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
      setError("Unsupported format. Only JPG, JPEG, and PNG are allowed.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="premium-card animate-fade-in" style={{ padding: '32px' }}>
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.25rem',
        marginBottom: '16px',
        background: 'var(--grad-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        New Stance Analysis
      </h3>

      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          width: '100%',
          minHeight: '260px',
          border: `2px dashed ${dragActive ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '12px',
          background: dragActive ? 'rgba(0, 242, 254, 0.04)' : 'rgba(255, 255, 255, 0.01)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          transition: 'all var(--transition-fast)',
          cursor: 'pointer',
          position: 'relative'
        }}
        onClick={!selectedFile ? onButtonClick : undefined}
      >
        <input 
          ref={inputRef}
          type="file" 
          style={{ display: 'none' }} 
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
        />

        {!selectedFile ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0, 242, 254, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 242, 254, 0.1)',
              color: 'var(--accent-cyan)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff', marginBottom: '4px' }}>
                Drag and drop your stance photo here
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                or click to browse from files
              </p>
            </div>

            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <span>JPEG, JPG, PNG</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.1)' }}>|</span>
              <span>Max 5MB</span>
            </div>
          </div>
        ) : (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '16px',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <img 
              src={previewUrl} 
              alt="Stance Preview" 
              style={{
                maxWidth: '100%',
                maxHeight: '220px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                objectFit: 'contain',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '200px'
              }}>
                {selectedFile.name}
              </span>
              <button 
                onClick={handleClear}
                style={{
                  background: 'rgba(255, 59, 48, 0.15)',
                  border: '1px solid rgba(255, 59, 48, 0.25)',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-red)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                title="Remove image"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(255, 59, 48, 0.1)',
          border: '1px solid rgba(255, 59, 48, 0.2)',
          borderRadius: '8px',
          color: 'var(--accent-red)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {selectedFile && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button 
            className="btn-secondary" 
            onClick={handleClear}
            disabled={isAnalyzing}
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            Cancel
          </button>
          
          <button 
            className="btn-primary" 
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
            style={{ 
              padding: '10px 24px', 
              fontSize: '0.9rem',
              background: 'var(--grad-success)',
              boxShadow: '0 4px 15px rgba(52, 199, 89, 0.2)'
            }}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner-border" style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(8, 11, 26, 0.3)',
                  borderTopColor: '#080b1a',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                  marginRight: '8px'
                }}></span>
                Analyzing...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Get AI Analysis
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
