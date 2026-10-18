import React, { useState } from 'react';
import { Search, Bell, Plus, Menu, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  onOpenNewDeal, 
  onToggleSidebar 
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    { id: 1, title: 'Contract signed by Vanguard', time: '10m ago', unread: true },
    { id: 2, title: 'Amara (Orion) scheduled demo', time: '1h ago', unread: true },
    { id: 3, title: 'Target milestone reached (75%)', time: '3h ago', unread: false },
  ];

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
            placeholder="Search deals, accounts, contacts, or tasks (Ctrl + K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-actions">
        <button 
          className="btn-primary"
          onClick={onOpenNewDeal}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Deal / Lead</span>
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="notify-dot"></span>
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '300px',
              backgroundColor: '#131b2e',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              padding: '1rem',
              zIndex: 50
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Activity Alerts</span>
                <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {mockNotifications.map(n => (
                  <div key={n.id} style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    backgroundColor: n.unread ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ fontWeight: 500 }}>{n.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="user-profile-btn">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" 
            alt="Marcus Vance" 
            className="user-avatar" 
          />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Marcus Vance</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Sales Director</span>
          </div>
        </div>
      </div>
    </header>
  );
}
