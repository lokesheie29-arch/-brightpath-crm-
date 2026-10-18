import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Clock, 
  CalendarCheck, 
  BarChart3, 
  Compass, 
  X,
  Sparkles,
  Users
} from 'lucide-react';
import { Profile } from '../types/crm';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  leadsCount: number;
  overdueCount: number;
  currentUser: Profile;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  leadsCount,
  overdueCount,
  currentUser
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Admissions Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Student Enquiries', icon: GraduationCap, badge: leadsCount },
    { id: 'followups', label: 'Follow-ups & Tasks', icon: Clock, alertBadge: overdueCount },
    { id: 'reports', label: 'Admissions Reports', icon: BarChart3 },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={22} />
        </div>
        <div className="brand-info">
          <span className="brand-title">BrightPath</span>
          <span className="brand-tag">Academy CRM</span>
        </div>
        {isOpen && (
          <button 
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="nav-section">
        <div className="nav-label">Core Modules</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                if (isOpen) setIsOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.alertBadge && item.alertBadge > 0 ? (
                <span className="nav-badge" style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#fb7185', fontWeight: 700 }}>
                  {item.alertBadge} overdue
                </span>
              ) : item.badge !== undefined ? (
                <span className="nav-badge">{item.badge}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="sidebar-quota">
        <div className="quota-header">
          <span>Q4 Enrolment Target</span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>72%</span>
        </div>
        <div className="quota-progress">
          <div className="quota-bar" style={{ width: '72%' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
          <span>144 / 200 Students</span>
          <span style={{ textTransform: 'capitalize', color: '#38bdf8' }}>{currentUser.role}</span>
        </div>
      </div>
    </aside>
  );
}
