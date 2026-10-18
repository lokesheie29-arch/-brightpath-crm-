import React from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  AlertTriangle,
  GraduationCap, 
  Calendar, 
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react';
import { Lead, FollowUp, Activity, Profile } from '../../types/crm';
import { STATUS_CONFIG } from '../../mockData';

interface DashboardViewProps {
  leads: Lead[];
  followUps: FollowUp[];
  activities: Activity[];
  currentUser: Profile;
  onSelectTab: (tab: string) => void;
  onSelectLead: (lead: Lead) => void;
}

export default function DashboardView({
  leads,
  followUps,
  activities,
  currentUser,
  onSelectTab,
  onSelectLead
}: DashboardViewProps) {
  const now = new Date();

  // Metrics definitions adhering to Section 15 of master specification
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  
  // Guard against divide-by-zero
  const conversionRate = totalLeads > 0 
    ? Math.round((convertedLeads / totalLeads) * 100) 
    : 0;

  // Overdue follow-ups: status === 'pending' AND due_at < now()
  const overdueFollowUps = followUps.filter(f => {
    return f.status === 'pending' && new Date(f.due_at) < now;
  });

  const upcomingFollowUps = followUps.filter(f => {
    return f.status === 'pending' && new Date(f.due_at) >= now;
  });

  const kpis = [
    {
      label: 'Total Student Enquiries',
      value: totalLeads.toString(),
      trend: `${newLeads} new this week`,
      isUp: true,
      sub: 'Across all active courses',
      icon: Users,
      accent: '#38bdf8'
    },
    {
      label: 'Confirmed Enrolments',
      value: convertedLeads.toString(),
      trend: `${conversionRate}% conversion rate`,
      isUp: true,
      sub: 'Goal: 30% baseline',
      icon: Award,
      accent: '#10b981'
    },
    {
      label: 'Qualified Prospects',
      value: qualifiedLeads.toString(),
      trend: 'Ready for batch allotment',
      isUp: true,
      sub: 'Diagnostic test passed',
      icon: UserCheck,
      accent: '#a855f7'
    },
    {
      label: 'Overdue Follow-ups',
      value: overdueFollowUps.length.toString(),
      trend: overdueFollowUps.length > 0 ? 'Requires immediate action' : 'Zero overdue!',
      isUp: overdueFollowUps.length === 0,
      sub: 'Action required within 24h',
      icon: AlertTriangle,
      accent: overdueFollowUps.length > 0 ? '#f43f5e' : '#10b981'
    }
  ];

  const statuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

  return (
    <div className="page-content">
      {/* Academy Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(168, 85, 247, 0.15))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              BrightPath Academy Admissions
            </span>
            <span style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', color: '#7dd3fc', textTransform: 'capitalize' }}>
              Active Role: {currentUser.role}
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Hello, {currentUser.full_name}! {overdueFollowUps.length > 0 ? `You have ${overdueFollowUps.length} follow-up(s) requiring attention.` : 'All student follow-ups are on schedule!'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            Managing student enquiries, diagnostic assessments, and counselling follow-ups.
          </p>
        </div>
        <button 
          className="btn-secondary" 
          onClick={() => onSelectTab('leads')}
          style={{ whiteSpace: 'nowrap' }}
        >
          View All Enquiries <ChevronRight size={16} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className="kpi-card"
              style={{ '--card-accent': kpi.accent } as React.CSSProperties}
            >
              <div className="kpi-top">
                <span className="kpi-label">{kpi.label}</span>
                <div className="kpi-icon" style={{ color: kpi.accent }}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="kpi-value">{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`kpi-trend ${kpi.isUp ? 'trend-up' : 'trend-down'}`}>
                  {kpi.trend}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Status Breakdown */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <GraduationCap size={18} color="#38bdf8" />
            <span>Enquiry Progression Pipeline</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {totalLeads} total records in pipeline
          </span>
        </div>

        <div style={{ display: 'flex', height: '12px', borderRadius: '8px', overflow: 'hidden', gap: '3px', background: '#090d16' }}>
          {statuses.map((st) => {
            const count = leads.filter(l => l.status === st).length;
            const pct = totalLeads > 0 ? Math.max(5, (count / totalLeads) * 100) : 20;
            const cfg = STATUS_CONFIG[st];
            return (
              <div 
                key={st}
                style={{
                  width: `${pct}%`,
                  backgroundColor: cfg?.color || '#38bdf8',
                  transition: 'width 0.3s ease'
                }}
                title={`${cfg?.label}: ${count} leads`}
              />
            );
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '1rem' }}>
          {statuses.map((st) => {
            const count = leads.filter(l => l.status === st).length;
            const cfg = STATUS_CONFIG[st];
            return (
              <div key={st} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: cfg?.color }} />
                <span style={{ color: '#94a3b8' }}>{cfg?.label}:</span>
                <span style={{ fontWeight: 600 }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Section */}
      <div className="content-grid-2">
        {/* Recent Enquiries */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={18} color="#38bdf8" />
              <span>Active Student Enquiries</span>
            </div>
            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              onClick={() => onSelectTab('leads')}
            >
              Manage ({leads.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {leads.slice(0, 4).map((lead) => {
              const cfg = STATUS_CONFIG[lead.status];
              return (
                <div 
                  key={lead.id}
                  className="deal-card"
                  style={{ margin: 0 }}
                  onClick={() => onSelectLead(lead)}
                >
                  <div className="deal-card-header">
                    <div>
                      <div className="deal-title">{lead.full_name}</div>
                      <div className="deal-company">{lead.course_interest}</div>
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: cfg?.bg,
                      color: cfg?.color,
                      fontWeight: 600
                    }}>
                      {cfg?.label}
                    </span>
                  </div>
                  <div className="deal-footer">
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Channel: <span style={{ color: '#f8fafc', fontWeight: 500 }}>{lead.source}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {lead.phone}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overdue / Upcoming Follow-ups & Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Overdue Follow-ups */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-title">
                <Clock size={18} color={overdueFollowUps.length > 0 ? '#f43f5e' : '#10b981'} />
                <span>Overdue Follow-ups ({overdueFollowUps.length})</span>
              </div>
              <button 
                className="btn-secondary" 
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                onClick={() => onSelectTab('followups')}
              >
                All Tasks
              </button>
            </div>

            <div>
              {overdueFollowUps.length > 0 ? (
                overdueFollowUps.map(fu => (
                  <div key={fu.id} className="task-item" style={{ borderLeft: '3px solid #f43f5e' }}>
                    <div>
                      <div className="task-text">{fu.note}</div>
                      <div className="task-meta" style={{ color: '#f43f5e', fontWeight: 600 }}>
                        Student: {fu.lead_name} • Due: {new Date(fu.due_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#10b981', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                  ✓ No overdue follow-ups! Great job keeping on top of enquiries.
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-title">
                <TrendingUp size={18} color="#c084fc" />
                <span>Audit & Activity Stream</span>
              </div>
            </div>
            <div className="activity-list">
              {activities.slice(0, 3).map((act) => (
                <div key={act.id} className="activity-item">
                  <div className="activity-icon-bubble">
                    <GraduationCap size={14} color="#38bdf8" />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{act.description}</div>
                    <div className="activity-meta">
                      {act.actor_name} • {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
