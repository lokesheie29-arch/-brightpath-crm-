import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  User, 
  ExternalLink 
} from 'lucide-react';
import { FollowUp, Lead } from '../../types/crm';

interface FollowUpsViewProps {
  followUps: FollowUp[];
  leads: Lead[];
  onToggleFollowUp: (id: string) => void;
  onOpenScheduleFollowUp: (leadId?: string) => void;
  onSelectLead: (lead: Lead) => void;
}

export default function FollowUpsView({
  followUps,
  leads,
  onToggleFollowUp,
  onOpenScheduleFollowUp,
  onSelectLead
}: FollowUpsViewProps) {
  const [filter, setFilter] = useState<'ALL' | 'OVERDUE' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const now = new Date();

  const filteredFollowUps = followUps.filter(fu => {
    const isOverdue = fu.status === 'pending' && new Date(fu.due_at) < now;
    const isUpcoming = fu.status === 'pending' && new Date(fu.due_at) >= now;

    if (filter === 'OVERDUE') return isOverdue;
    if (filter === 'UPCOMING') return isUpcoming;
    if (filter === 'COMPLETED') return fu.status === 'completed';
    return true;
  });

  const overdueCount = followUps.filter(f => f.status === 'pending' && new Date(f.due_at) < now).length;

  return (
    <div className="page-content">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '0.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Follow-ups & Counselling Calls</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Schedule and track callbacks, parent counselling sessions, and scholarship test reminders.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem', background: '#131b2e', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['ALL', 'OVERDUE', 'UPCOMING', 'COMPLETED'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                style={{
                  background: filter === st ? '#38bdf8' : 'transparent',
                  color: filter === st ? '#0f172a' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {st} {st === 'OVERDUE' && overdueCount > 0 && `(${overdueCount})`}
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={() => onOpenScheduleFollowUp()}>
            <Plus size={16} />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredFollowUps.map(fu => {
            const isOverdue = fu.status === 'pending' && new Date(fu.due_at) < now;
            const targetLead = leads.find(l => l.id === fu.lead_id);

            return (
              <div 
                key={fu.id}
                className={`task-item ${fu.status === 'completed' ? 'completed' : ''}`}
                style={{
                  borderLeft: isOverdue ? '3px solid #f43f5e' : '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div className="task-left">
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={fu.status === 'completed'}
                    onChange={() => onToggleFollowUp(fu.id)}
                    title={fu.status === 'completed' ? 'Mark pending' : 'Mark completed'}
                  />
                  <div>
                    <div className="task-text">{fu.note}</div>
                    <div className="task-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '4px' }}>
                      <span style={{
                        color: isOverdue ? '#f43f5e' : '#94a3b8',
                        fontWeight: isOverdue ? 700 : 400,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Calendar size={12} /> Due: {new Date(fu.due_at).toLocaleDateString()} at {new Date(fu.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {fu.assignee_name && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <User size={12} /> {fu.assignee_name}
                        </span>
                      )}
                      {targetLead && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLead(targetLead);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#38bdf8',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            padding: 0
                          }}
                        >
                          Student: {targetLead.full_name} <ExternalLink size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  background: isOverdue ? 'rgba(244, 63, 94, 0.15)' : fu.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  color: isOverdue ? '#fb7185' : fu.status === 'completed' ? '#34d399' : '#38bdf8'
                }}>
                  {isOverdue ? 'Overdue' : fu.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
            );
          })}

          {filteredFollowUps.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <CheckCircle size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
              <div>No follow-up items found for this filter.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
