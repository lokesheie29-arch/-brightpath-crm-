import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Building, Calendar, Plus, MessageSquare, CheckCircle } from 'lucide-react';

export default function ContactModal({ contact, onClose, onAddNote }) {
  const [noteText, setNoteText] = useState('');

  if (!contact) return null;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddNote(contact.id, noteText.trim());
    setNoteText('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="contact-avatar" style={{ width: '40px', height: '40px' }}>
              {contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{contact.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{contact.role} • {contact.company}</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.75rem',
            background: '#090d16',
            padding: '1rem',
            borderRadius: '10px'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Email</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#38bdf8' }}>{contact.email}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Direct Line</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{contact.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Location</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{contact.location}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Lifetime Pipeline</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>${contact.totalValue.toLocaleString()}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={16} color="#38bdf8" />
              <span>Executive Briefing & Notes</span>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '0.85rem',
              fontSize: '0.82rem',
              color: '#cbd5e1',
              lineHeight: 1.5
            }}>
              {contact.notes || 'No active notes documented for this contact.'}
            </div>
          </div>

          <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>
              Append Meeting Note or Communication Log
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                placeholder="Log call summary, objection handling, or next steps..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.6rem 0.9rem' }}>
                <Plus size={16} /> Log Note
              </button>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close Profile</button>
        </div>
      </div>
    </div>
  );
}
