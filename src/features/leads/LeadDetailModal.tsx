import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  BookOpen, 
  Clock, 
  Plus, 
  CheckCircle2, 
  MessageSquare,
  History,
  Calendar
} from 'lucide-react';
import { Lead, LeadStatus, FollowUp, Activity, Profile } from '../../types/crm';
import { STATUS_CONFIG } from '../../mockData';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onAddNote: (leadId: string, note: string) => void;
  followUps: FollowUp[];
  activities: Activity[];
  onOpenScheduleFollowUp: (leadId: string) => void;
  onToggleFollowUp: (followUpId: string) => void;
  profiles: Profile[];
}

export default function LeadDetailModal({
  lead,
  onClose,
  onUpdateStatus,
  onAddNote,
  followUps,
  activities,
  onOpenScheduleFollowUp,
  onToggleFollowUp,
  profiles
}: LeadDetailModalProps) {
  const [newNote, setNewNote] = useState('');

  if (!lead) return null;

  const leadFollowUps = followUps.filter(f => f.lead_id === lead.id);
  const leadActivities = activities.filter(a => a.lead_id === lead.id);
  const cfg = STATUS_CONFIG[lead.status];
  const counsellor = profiles.find(p => p.id === lead.assigned_to);

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(lead.id, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="contact-avatar" style={{ width: '40px', height: '40px' }}>
              {lead.full_name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{lead.full_name}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{lead.course_interest}</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Quick Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            background: '#090d16',
            padding: '1rem',
            borderRadius: '10px'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Phone</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>{lead.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Email</div>
              <div style={{ fontSize: '0.82rem', color: '#38bdf8' }}>{lead.email || 'None'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Channel</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{lead.source}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Counsellor</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{counsellor?.full_name || 'Unassigned'}</div>
            </div>
          </div>

          {/* Status Progression */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Enquiry Stage:</span>
            <select
              className="form-select"
              value={lead.status}
              onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
              style={{
                background: cfg?.bg,
                color: cfg?.color,
                fontWeight: 700,
                borderColor: cfg?.color
              }}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Existing Notes */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={16} color="#38bdf8" />
              <span>Counselling Notes</span>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '0.85rem',
              fontSize: '0.82rem',
              color: '#cbd5e1',
              whiteSpace: 'pre-wrap'
            }}>
              {lead.notes || 'No notes documented yet.'}
            </div>
          </div>

          {/* Append Note Form */}
          <form onSubmit={handleNoteSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1 }}
              placeholder="Add counselling note or call summary..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.6rem 0.9rem' }}>
              Add Note
            </button>
          </form>

          {/* Scheduled Follow-ups */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} color="#f59e0b" />
                <span>Follow-ups ({leadFollowUps.length})</span>
              </span>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                onClick={() => onOpenScheduleFollowUp(lead.id)}
              >
                <Plus size={13} /> Schedule
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {leadFollowUps.map(fu => (
                <div 
                  key={fu.id} 
                  className={`task-item ${fu.status === 'completed' ? 'completed' : ''}`}
                  onClick={() => onToggleFollowUp(fu.id)}
                  style={{ cursor: 'pointer', margin: 0 }}
                >
                  <div className="task-left">
                    <input 
                      type="checkbox" 
                      className="task-checkbox" 
                      checked={fu.status === 'completed'}
                      onChange={() => {}}
                    />
                    <div>
                      <div className="task-text">{fu.note}</div>
                      <div className="task-meta">
                        Due: {new Date(fu.due_at).toLocaleDateString()} • Status: {fu.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {leadFollowUps.length === 0 && (
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                  No follow-ups currently scheduled for this student.
                </div>
              )}
            </div>
          </div>

          {/* Audit History */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <History size={16} color="#c084fc" />
              <span>Activity History</span>
            </div>
            <div className="activity-list">
              {leadActivities.map(act => (
                <div key={act.id} className="activity-item" style={{ fontSize: '0.78rem' }}>
                  <div className="activity-icon-bubble" style={{ width: '24px', height: '24px' }}>
                    <Calendar size={12} color="#38bdf8" />
                  </div>
                  <div className="activity-content">
                    <div style={{ fontWeight: 600 }}>{act.description}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {new Date(act.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
