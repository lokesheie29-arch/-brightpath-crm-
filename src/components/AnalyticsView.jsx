import React from 'react';
import { BarChart3, TrendingUp, PieChart, Users, Award, ShieldCheck, Zap } from 'lucide-react';
import { REVENUE_BY_SOURCE } from '../mockData';

export default function AnalyticsView({ deals }) {
  const teamPerformance = [
    { name: 'Marcus Vance', dealsWon: 5, totalWon: 420000, quotaAttainment: 92, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
    { name: 'Sarah Miller', dealsWon: 4, totalWon: 295000, quotaAttainment: 84, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
    { name: 'Elena Gomez', dealsWon: 3, totalWon: 215000, quotaAttainment: 78, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  ];

  return (
    <div className="page-content">
      <div style={{ marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Analytics & Quota Performance</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          Deep-dive telemetry into revenue attribution, velocity, and team pipeline efficiency.
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--card-accent': '#38bdf8' }}>
          <div className="kpi-top">
            <span className="kpi-label">Average Sales Cycle</span>
            <div className="kpi-icon" style={{ color: '#38bdf8' }}><Zap size={18} /></div>
          </div>
          <div className="kpi-value">26 Days</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>-4.2 days vs Q3</div>
        </div>

        <div className="kpi-card" style={{ '--card-accent': '#10b981' }}>
          <div className="kpi-top">
            <span className="kpi-label">Average Deal Size</span>
            <div className="kpi-icon" style={{ color: '#10b981' }}><TrendingUp size={18} /></div>
          </div>
          <div className="kpi-value">$119,200</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>+12% expansion</div>
        </div>

        <div className="kpi-card" style={{ '--card-accent': '#a855f7' }}>
          <div className="kpi-top">
            <span className="kpi-label">Forecast Realization</span>
            <div className="kpi-icon" style={{ color: '#a855f7' }}><Award size={18} /></div>
          </div>
          <div className="kpi-value">94.8%</div>
          <div style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600 }}>Consistent predictor</div>
        </div>

        <div className="kpi-card" style={{ '--card-accent': '#f59e0b' }}>
          <div className="kpi-top">
            <span className="kpi-label">Retention & Expansion</span>
            <div className="kpi-icon" style={{ color: '#f59e0b' }}><ShieldCheck size={18} /></div>
          </div>
          <div className="kpi-value">124%</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Net Revenue Retention</div>
        </div>
      </div>

      <div className="content-grid-2">
        {/* Revenue by Inbound Source */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <PieChart size={18} color="#38bdf8" />
              <span>Revenue Attribution by Source</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Year to Date</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
            {REVENUE_BY_SOURCE.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600 }}>{item.source}</span>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ color: '#94a3b8' }}>{item.value}</span>
                    <span style={{ fontWeight: 700, color: item.color }}>{item.share}%</span>
                  </div>
                </div>
                <div style={{ height: '8px', background: '#090d16', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${item.share}%`,
                    backgroundColor: item.color,
                    borderRadius: '999px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Leaderboard */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <Users size={18} color="#10b981" />
              <span>Team Quota Attainment</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>Live Q4</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {teamPerformance.map((member, idx) => (
              <div key={idx} style={{
                padding: '0.85rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img src={member.avatar} alt={member.name} className="deal-avatar" style={{ width: '28px', height: '28px' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{member.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.85rem' }}>
                    {member.quotaAttainment}%
                  </span>
                </div>
                <div style={{ height: '6px', background: '#090d16', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${member.quotaAttainment}%`,
                    background: 'linear-gradient(90deg, #38bdf8, #10b981)'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                  <span>${member.totalWon.toLocaleString()} won</span>
                  <span>{member.dealsWon} contracts closed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
