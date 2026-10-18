import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, isCloudMode } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        const res = await signIn(email, password);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess('Signed in successfully!');
          setTimeout(() => onClose(), 800);
        }
      } else {
        if (!fullName.trim()) {
          setError('Full name is required for registration.');
          setLoading(false);
          return;
        }
        const res = await signUp(email, password, fullName.trim());
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess('Registration successful! Profile auto-created.');
          setTimeout(() => onClose(), 1000);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during authentication';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="#38bdf8" />
            <div className="modal-title">
              {tab === 'signin' ? 'Staff Authentication' : 'Create Staff Account'}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#090d16' }}>
          <button
            type="button"
            onClick={() => { setTab('signin'); setError(null); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'signin' ? '2px solid #38bdf8' : 'none',
              color: tab === 'signin' ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(null); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'signup' ? '2px solid #38bdf8' : 'none',
              color: tab === 'signup' ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid #f43f5e',
                color: '#fb7185',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                color: '#34d399',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            {!isCloudMode && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#fbbf24',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem'
              }}>
                Notice: Supabase cloud is not configured in .env. Entering an email will simulate role switching for workshop testing.
              </div>
            )}

            {tab === 'signup' && (
              <div className="form-group">
                <label>Staff Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. Marcus Vance"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Staff Work Email *</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="counsellor@brightpath.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {tab === 'signup' && (
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
                New accounts automatically receive the least-privileged <strong>counsellor</strong> role. Administrators can promote roles through the database.
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Sparkles size={16} />
              <span>{loading ? 'Authenticating...' : tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
