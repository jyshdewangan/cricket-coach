import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    sport: 'Cricket',
    role: 'Right-hand Batsman',
    experienceLevel: 'Beginner'
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        err.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic instruction preview based on chosen level
  const getExperienceContext = (level) => {
    switch (level) {
      case 'Beginner':
        return "Coaching will prioritize absolute fundamentals: grip, stance width, head alignment, and bat path.";
      case 'Intermediate':
        return "Coaching will critique backlift stability, shoulder alignment, weight transfer, and balance at setup.";
      case 'Advanced':
        return "Coaching will scrutinize micro-adjustments: wrist cock, elbow extension, trigger movement timing, and precision match readiness.";
      default:
        return "";
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
          maxWidth: '520px',
          background: 'linear-gradient(135deg, rgba(15, 19, 42, 0.8) 0%, rgba(8, 11, 26, 0.9) 100%)',
          border: '1px solid var(--border-glow)'
        }}>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
            <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>Athlete Registration</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '12px', fontWeight: 500 }}>
              Create an account to check if you are Better or Not?
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
              marginBottom: '20px',
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Account Credentials Group */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }} className="form-group-split">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="glass-input"
                  placeholder="Virat Kohli"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="glass-input"
                  placeholder="virat@rcb.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
              <input
                type="password"
                name="password"
                className="glass-input"
                placeholder="Must be at least 6 characters"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Profile Configurations */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '16px'
            }} className="form-group-split">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sport Focus</label>
                <select
                  name="sport"
                  className="glass-input glass-select"
                  value={formData.sport}
                  onChange={handleChange}
                  disabled={true} /* Tailored only to Cricket */
                >
                  <option value="Cricket">Cricket (Strict Edition)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Batting Role</label>
                <select
                  name="role"
                  className="glass-input glass-select"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="Right-hand Batsman">Right-hand Batsman</option>
                  <option value="Left-hand Batsman">Left-hand Batsman</option>
                  <option value="Wicket-keeper Batsman">Wicket-keeper Batsman</option>
                  <option value="All-rounder (Batting Focus)">All-rounder</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Experience/Skill Level</label>
              <select
                name="experienceLevel"
                className="glass-input glass-select"
                value={formData.experienceLevel}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced (Elite Rubric)</option>
              </select>
            </div>

            {/* Experience level context summary card */}
            <div style={{
              background: 'rgba(0, 242, 254, 0.03)',
              border: '1px solid rgba(0, 242, 254, 0.08)',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.4'
            }}>
              <strong style={{ color: 'var(--accent-cyan)' }}>AI Target Focus:</strong> {getExperienceContext(formData.experienceLevel)}
            </div>

            {/* Register submit */}
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
                  Creating Profile...
                </>
              ) : (
                "Register & Open Portal"
              )}
            </button>
          </form>

          {/* Login redirect */}
          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '16px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            Already have an active profile?{" "}
            <Link to="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>
              Authenticate
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .form-group-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
