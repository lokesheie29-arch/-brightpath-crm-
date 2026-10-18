import React, { useState } from 'react';
import { Search, Bell, UserPlus, Menu, Shield } from 'lucide-react';
import { Profile } from '../types/crm';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewLead: () => void;
  onToggleSidebar: () => void;
  currentUser: Profile;
  onSwitchUser: (profile: Profile) => void;
  profiles: Profile[];
}

export default function Header({
  searchQuery,
  setSearchQuery,
  onOpenNewLead,
  onToggleSidebar,
  currentUser,
  onSwitchUser,
  profiles
}: HeaderProps) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

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
            title="Switch User Role (Demo Mode)"
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
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
                Workshop User Simulator
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
