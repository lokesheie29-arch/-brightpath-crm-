import React from 'react';
import { 
  LayoutDashboard, 
  Kanban, 
  Users, 
  CheckSquare, 
  BarChart3, 
  Compass, 
  Settings, 
  TrendingUp,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, dealsCount, tasksCount }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deals', label: 'Deals & Pipeline', icon: Kanban, badge: dealsCount },
    { id: 'contacts', label: 'Contacts & Leads', icon: Users },
    { id: 'tasks', label: 'Tasks & Follow-ups', icon: CheckSquare, badge: tasksCount },
    { id: 'analytics', label: 'Analytics & Quotas', icon: BarChart3 },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Compass size={22} />
        </div>
        <div className="brand-info">
          <span className="brand-title">BrightPath</span>
          <span className="brand-tag">CRM Enterprise</span>
        </div>
        {isOpen && (
          <button 
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="nav-section">
        <div className="nav-label">Main Navigation</div>
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
              {item.badge !== undefined && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="sidebar-quota">
        <div className="quota-header">
          <span>Q4 Sales Target</span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>79%</span>
        </div>
        <div className="quota-progress">
          <div className="quota-bar" style={{ width: '79%' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
          <span>$635,500</span>
          <span>$800,000</span>
        </div>
      </div>
    </aside>
  );
}
