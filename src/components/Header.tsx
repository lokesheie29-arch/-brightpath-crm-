import React, { useState } from 'react';
import { Search, UserPlus, Menu, Shield, LogIn, LogOut, User } from 'lucide-react';
import { Profile } from '../types/crm';
import { useAuth } from '../features/auth/AuthContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewLead: () => void;
  onToggleSidebar: () => void;
  currentUser: Profile;
  onSwitchUser: (profile: Profile) => void;
  profiles: Profile[];
  onOpenAuthModal: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  onOpenNewLead,
  onToggleSidebar,
  currentUser,
  onSwitchUser,
  profiles,
  onOpenAuthModal
}: HeaderProps) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const { user, signOut, isCloudMode } = useAuth();

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Toggle menu">
          <Menu size={22} />
        </button>
        <div className="search-bar">
          <Search className="search-icon" size={17} />
          <input
            type="text"
            className="search-input"
            placeholder="Search student enquiries, courses, parents, phones (Ctrl + K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-actions">
        <button 
          className="btn-primary"
          onClick={onOpenNewLead}
        >
          <UserPlus size={16} strokeWidth={2.5} />
          <span>New Student Enquiry</span>
        </button>

        {/* User profile & Role switcher simulator for workshop */}
        <div style={{ position: 'relative' }}>
          <button 
            className="user-profile-btn"
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            title="Account & Role options"
          >
            <div className="contact-avatar" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>
              {currentUser.full_name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{currentUser.full_name}</span>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8', textTransform: 'capitalize' }}>
                {currentUser.role}
              </span>
            </div>
          </button>

          {showRoleDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '260px',
              backgroundColor: '#131b2e',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              padding: '0.75rem',
              zIndex: 50
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {isCloudMode ? 'Cloud Account' : 'Workshop Profiles'}
                </span>
                <span style={{ fontSize: '0.65rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '1px 5px', borderRadius: '4px', textTransform: 'capitalize' }}>
                  {currentUser.role}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {profiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSwitchUser(p);
                      setShowRoleDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.65rem',
                      background: p.id === currentUser.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                      color: p.id === currentUser.id ? '#38bdf8' : '#f8fafc',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.full_name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'capitalize' }}>{p.role}</div>
                    </div>
                    {p.id === currentUser.id && <span style={{ fontSize: '0.75rem' }}>✓</span>}
                  </button>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    onOpenAuthModal();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.65rem',
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                    borderRadius: '6px'
                  }}
                >
                  <LogIn size={14} />
                  <span>{user ? 'Switch / Re-authenticate' : 'Sign In / Register'}</span>
                </button>

                {user && (
                  <button
                    onClick={() => {
                      signOut();
                      setShowRoleDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.65rem',
                      background: 'none',
                      border: 'none',
                      color: '#fb7185',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      textAlign: 'left',
                      borderRadius: '6px'
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
