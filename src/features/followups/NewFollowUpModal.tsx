import React, { useState } from 'react';
import { X, Clock, Calendar, Sparkles } from 'lucide-react';
import { Lead, FollowUp, Profile } from '../../types/crm';

interface NewFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveFollowUp: (followUp: FollowUp) => void;
  leads: Lead[];
  defaultLeadId?: string;
  profiles: Profile[];
  currentUserId: string;
}

export default function NewFollowUpModal({
  isOpen,
  onClose,
  onSaveFollowUp,
  leads,
  defaultLeadId,
  profiles,
  currentUserId
}: NewFollowUpModalProps) {
  const [selectedLeadId, setSelectedLeadId] = useState(defaultLeadId || (leads[0]?.id || ''));
  const [note, setNote] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState(currentUserId);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) {
      setError('Please select a student lead.');
      return;
    }
    if (!note.trim()) {
      setError('Follow-up note cannot be empty.');
      return;
    }
    if (!dueDate) {
      setError('Please choose a due date and time.');
      return;
    }

    const targetLead = leads.find(l => l.id === selectedLeadId);
    const assignee = profiles.find(p => p.id === assignedTo);

    const newFollowUp: FollowUp = {
      id: `fu-${Date.now()}`,
      lead_id: selectedLeadId,
      assigned_to: assignedTo,
      due_at: new Date(dueDate).toISOString(),
      note: note.trim(),
      status: 'pending',
      completed_at: null,
      created_by: currentUserId,
      created_at: new Date().toISOString(),
      lead_name: targetLead?.full_name,
      assignee_name: assignee?.full_name
    };

    onSaveFollowUp(newFollowUp);
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#f59e0b" />
            <div className="modal-title">Schedule Follow-up Call or Task</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid #f43f5e',
                color: '#fb7185',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Select Student Enquiry *</label>
              <select
                className="form-select"
                value={selectedLeadId}
                onChange={e => setSelectedLeadId(e.target.value)}
              >
                {leads.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.full_name} ({l.course_interest})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Due Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  className="form-input"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Assigned Counsellor</label>
                <select
                  className="form-select"
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.full_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Follow-up Action Note *</label>
              <textarea
                className="form-textarea"
                rows={3}
                required
                placeholder="e.g. Call parents to discuss diagnostic test feedback and batch slot confirmation..."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} /> Schedule Follow-up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
