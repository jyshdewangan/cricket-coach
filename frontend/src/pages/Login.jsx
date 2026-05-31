import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        err.message ||
        "Authentication failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="bg-glow-container">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div className="premium-card animate-fade-in" style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(135deg, rgba(15, 19, 42, 0.8) 0%, rgba(8, 11, 26, 0.9) 100%)',
          border: '1px solid var(--border-glow)'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img 
              src="/assets/logo.png" 
              alt="Ghost Coach Logo" 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                marginBottom: '16px',
                boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                objectFit: 'cover'
              }} 
            />
            <br />
            <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Came Again?</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800 }}>
              I bet, You're still not better than King
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
              Sign in to analyze your stance and track progress
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: 'rgba(255, 59, 48, 0.1)',
              border: '1px solid rgba(255, 59, 48, 0.2)',
              borderRadius: '8px',
              color: 'var(--accent-red)',
              fontSize: '0.85rem',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Registered Email Address
              </label>
              <input 
                type="email" 
                className="glass-input"
                placeholder="athlete@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password
                </label>
              </div>
              <input 
                type="password" 
                className="glass-input"
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(8, 11, 26, 0.3)',
                    borderTopColor: '#080b1a',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                    marginRight: '8px'
                  }}></span>
                  Securing Connection...
                </>
              ) : (
                "Authenticate & Enter"
              )}
            </button>
          </form>

          {/* Redirect */}
          <div style={{ 
            marginTop: '28px', 
            textAlign: 'center', 
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '20px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            First time using the platform?{" "}
            <Link to="/register" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>
              Create Account
            </Link>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
