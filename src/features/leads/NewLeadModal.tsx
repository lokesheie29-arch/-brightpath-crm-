import React, { useState } from 'react';
import { X, Sparkles, GraduationCap } from 'lucide-react';
import { Lead, LeadStatus, Profile } from '../../types/crm';
import { COURSE_OPTIONS, SOURCE_OPTIONS } from '../../mockData';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLead: (lead: Lead) => void;
  profiles: Profile[];
  currentUserId: string;
}

export default function NewLeadModal({
  isOpen,
  onClose,
  onSaveLead,
  profiles,
  currentUserId
}: NewLeadModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    courseInterest: COURSE_OPTIONS[0],
    source: SOURCE_OPTIONS[0],
    assignedTo: currentUserId,
    notes: ''
  });

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setError('Student name and phone number are required.');
      return;
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please provide a valid email format.');
      return;
    }

    const now = new Date().toISOString();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      full_name: formData.fullName.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim(),
      course_interest: formData.courseInterest,
      source: formData.source,
      status: 'New',
      assigned_to: formData.assignedTo || null,
      created_by: currentUserId,
      notes: formData.notes.trim() || null,
      created_at: now,
      updated_at: now
    };

    onSaveLead(newLead);
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} color="#38bdf8" />
            <div className="modal-title">Register New Student Enquiry</div>
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
              <label>Student / Parent Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Siddharth Verma"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Primary Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="e.g. +1 (555) 345-6789"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. siddharth@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Course Program Interest *</label>
                <select
                  className="form-select"
                  value={formData.courseInterest}
                  onChange={e => setFormData({ ...formData, courseInterest: e.target.value })}
                >
                  {COURSE_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Enquiry Channel / Source *</label>
                <select
                  className="form-select"
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                >
                  {SOURCE_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Assigned Academic Counsellor</label>
              <select
                className="form-select"
                value={formData.assignedTo}
                onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>{p.full_name} ({p.role})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Initial Enquiry Notes / Student Goals</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Mention student grade, target exam year, baseline score, or parent requirements..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} /> Save Student Enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
