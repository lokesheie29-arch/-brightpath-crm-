import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock, 
  Award, 
  ChevronRight,
  PhoneCall,
  Mail,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function DashboardView({ 
  deals, 
  stages, 
  tasks, 
  activities, 
  onSelectTab,
  onOpenDeal 
}) {
  const totalPipeline = deals
    .filter(d => d.stage !== 'won')
    .reduce((sum, d) => sum + d.value, 0);

  const totalWon = deals
    .filter(d => d.stage === 'won')
    .reduce((sum, d) => sum + d.value, 0);

  const activeCount = deals.filter(d => d.stage !== 'won').length;
  const wonCount = deals.filter(d => d.stage === 'won').length;
  const winRate = deals.length > 0 ? Math.round((wonCount / deals.length) * 100) : 0;

  const kpis = [
    {
      label: 'Active Pipeline Value',
      value: `$${(totalPipeline / 1000).toFixed(1)}k`,
      trend: '+24.5%',
      isUp: true,
      sub: 'vs last month',
      icon: DollarSign,
      accent: '#38bdf8'
    },
    {
      label: 'Closed Won (Q4)',
      value: `$${(totalWon / 1000).toFixed(1)}k`,
      trend: '+18.2%',
      isUp: true,
      sub: 'Ahead of target',
      icon: Award,
      accent: '#10b981'
    },
    {
      label: 'Open Opportunities',
      value: activeCount.toString(),
      trend: '+3 new',
      isUp: true,
      sub: 'In active review',
      icon: Target,
      accent: '#a855f7'
    },
    {
      label: 'Win Rate Efficiency',
      value: `${winRate}%`,
      trend: '+5.4%',
      isUp: true,
      sub: 'Industry benchmark: 22%',
      icon: TrendingUp,
      accent: '#f59e0b'
    }
  ];

  return (
    <div className="page-content">
      {/* Welcome Banner */}
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
              Executive Overview
            </span>
            <span style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', color: '#7dd3fc' }}>
              Q4 Forecast Live
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Welcome back, Marcus! You have 3 deals ready to close this week.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            Total forecasted revenue is pacing 18% above quarterly expectations.
          </p>
        </div>
        <button 
          className="btn-secondary" 
          onClick={() => onSelectTab('deals')}
          style={{ whiteSpace: 'nowrap' }}
        >
          View Kanban Board <ChevronRight size={16} />
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
              style={{ '--card-accent': kpi.accent }}
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
                  {kpi.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {kpi.trend}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Funnel Distribution */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Target size={18} color="#38bdf8" />
            <span>Pipeline Distribution by Stage</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Total pipeline active: ${totalPipeline.toLocaleString()}
          </span>
        </div>

        <div style={{ display: 'flex', height: '14px', borderRadius: '8px', overflow: 'hidden', gap: '3px', background: '#090d16' }}>
          {stages.map((stage) => {
            const stageTotal = deals
              .filter(d => d.stage === stage.id)
              .reduce((s, d) => s + d.value, 0);
            const totalCalc = totalPipeline + totalWon || 1;
            const pct = Math.max(8, (stageTotal / totalCalc) * 100);
            return (
              <div 
                key={stage.id} 
                style={{
                  width: `${pct}%`,
                  backgroundColor: stage.color,
                  transition: 'width 0.3s ease'
                }}
                title={`${stage.name}: $${stageTotal.toLocaleString()}`}
              />
            );
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '1rem' }}>
          {stages.map((stage) => {
            const count = deals.filter(d => d.stage === stage.id).length;
            const stageVal = deals
              .filter(d => d.stage === stage.id)
              .reduce((s, d) => s + d.value, 0);
            return (
              <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: stage.color }} />
                <span style={{ color: '#94a3b8' }}>{stage.name}:</span>
                <span style={{ fontWeight: 600 }}>${(stageVal / 1000).toFixed(0)}k</span>
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: High Priority Deals & Activity / Tasks */}
      <div className="content-grid-2">
        {/* Priority Deals */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <DollarSign size={18} color="#10b981" />
              <span>Highest Impact Deals</span>
            </div>
            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              onClick={() => onSelectTab('deals')}
            >
              See All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {deals
              .slice()
              .sort((a, b) => b.value - a.value)
              .slice(0, 4)
              .map((deal) => {
                const stageObj = stages.find(s => s.id === deal.stage);
                return (
                  <div 
                    key={deal.id}
                    className="deal-card"
                    style={{ margin: 0 }}
                    onClick={() => onSelectTab('deals')}
                  >
                    <div className="deal-card-header">
                      <div>
                        <div className="deal-title">{deal.title}</div>
                        <div className="deal-company">{deal.company}</div>
                      </div>
                      <span className={`priority-badge priority-${deal.priority.toLowerCase()}`}>
                        {deal.priority}
                      </span>
                    </div>
                    <div className="deal-footer">
                      <div className="deal-amount">${deal.value.toLocaleString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          fontSize: '0.72rem', 
                          padding: '2px 8px', 
                          borderRadius: '999px',
                          background: stageObj?.bg,
                          color: stageObj?.color,
                          fontWeight: 600
                        }}>
                          {stageObj?.name}
                        </span>
                        <img 
                          src={deal.ownerAvatar} 
                          alt={deal.owner} 
                          className="deal-avatar"
                          title={deal.owner}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Live Feed & Key Action Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Tasks */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-title">
                <Clock size={18} color="#f59e0b" />
                <span>Today's Priority Tasks</span>
              </div>
              <button 
                className="btn-secondary" 
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                onClick={() => onSelectTab('tasks')}
              >
                View ({tasks.filter(t => !t.completed).length})
              </button>
            </div>
            <div>
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-left">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: task.priority === 'High' ? '#f43f5e' : '#f59e0b' }} />
                    <div>
                      <div className="task-text">{task.title}</div>
                      <div className="task-meta">{task.dueDate} • {task.assignedTo}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-title">
                <Sparkles size={18} color="#c084fc" />
                <span>Recent Milestone Activity</span>
              </div>
            </div>
            <div className="activity-list">
              {activities.map((act) => (
                <div key={act.id} className="activity-item">
                  <div className="activity-icon-bubble">
                    <Award size={14} color={act.badgeColor} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{act.title}</div>
                    <div className="activity-desc">{act.description}</div>
                    <div className="activity-meta">{act.time} by {act.user}</div>
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
