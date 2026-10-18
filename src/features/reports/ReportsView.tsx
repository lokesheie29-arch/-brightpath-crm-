import React from 'react';
import { BarChart3, PieChart, Users, Award, TrendingUp, BookOpen } from 'lucide-react';
import { Lead, Profile } from '../../types/crm';
import { SOURCE_OPTIONS, STATUS_CONFIG } from '../../mockData';

interface ReportsViewProps {
  leads: Lead[];
  profiles: Profile[];
}

export default function ReportsView({ leads, profiles }: ReportsViewProps) {
  const totalLeads = leads.length;

  // Breakdown by Source
  const sourceStats = SOURCE_OPTIONS.map(src => {
    const srcLeads = leads.filter(l => l.source === src);
    const converted = srcLeads.filter(l => l.status === 'Converted').length;
    const count = srcLeads.length;
    const convRate = count > 0 ? Math.round((converted / count) * 100) : 0;
    return {
      source: src,
      count,
      converted,
      convRate
    };
  });

  // Counsellor workload & conversion
  const counsellorStats = profiles
    .filter(p => p.role === 'counsellor' || p.role === 'manager')
    .map(c => {
      const assigned = leads.filter(l => l.assigned_to === c.id);
      const converted = assigned.filter(l => l.status === 'Converted').length;
      const rate = assigned.length > 0 ? Math.round((converted / assigned.length) * 100) : 0;
      return {
        name: c.full_name,
        role: c.role,
        assignedCount: assigned.length,
        convertedCount: converted,
        rate
      };
    });

  return (
    <div className="page-content">
      <div style={{ marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Admissions & Conversion Reports</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          Evaluate enquiry acquisition channels, course popularity, and counselling team efficiency.
        </p>
      </div>

      <div className="content-grid-2">
        {/* Enquiries by Acquisition Source */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <PieChart size={18} color="#38bdf8" />
              <span>Conversion by Acquisition Channel</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>All Channels</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {sourceStats.map(s => {
              const pct = totalLeads > 0 ? Math.round((s.count / totalLeads) * 100) : 0;
              return (
                <div key={s.source}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{s.source}</span>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem' }}>
                      <span style={{ color: '#94a3b8' }}>{s.count} enquiries</span>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>{s.converted} enrolled ({s.convRate}%)</span>
                    </div>
                  </div>
                  <div style={{ height: '8px', background: '#090d16', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                      borderRadius: '999px'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Counsellor Conversion Performance */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">
              <Award size={18} color="#10b981" />
              <span>Counsellor Conversion Ratio</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {counsellorStats.map(c => (
              <div key={c.name} style={{
                padding: '0.85rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'capitalize' }}>{c.role}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#38bdf8' }}>{c.rate}% Converted</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{c.convertedCount} of {c.assignedCount} leads</div>
                  </div>
                </div>
                <div style={{ height: '6px', background: '#090d16', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${c.rate}%`,
                    background: 'linear-gradient(90deg, #38bdf8, #10b981)',
                    borderRadius: '999px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
