import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8, 11, 26, 0.8)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'all var(--transition-normal)'
    }}>
      <div className="container" style={{
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand/Logo */}
        <Link to={user ? "/dashboard" : "/"} style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {/* Logo Image */}
          <img 
            src="/assets/logo.png" 
            alt="Ghost Coach Logo" 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              objectFit: 'cover',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
          
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #ffffff, #00f2fe, #4facfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase'
          }}>
            Kohlified, or not?
          </span>
        </Link>

        {/* Auth / Menu list */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              
              {/* Profile Context badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '6px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }} className="nav-profile-badge">
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-cyan)',
                  boxShadow: '0 0 8px var(--accent-cyan)'
                }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                    {user.fullName}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {user.role} ({user.experienceLevel})
                  </span>
                </div>
              </div>

              {/* Log out Button */}
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-secondary)',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-red)';
                  e.currentTarget.style.color = 'var(--accent-red)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Log In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
      
      <style>{`
        @media (max-width: 640px) {
          .nav-profile-badge {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
