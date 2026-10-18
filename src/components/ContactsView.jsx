import React, { useState } from 'react';
import { Mail, Phone, MapPin, Building, ExternalLink, UserPlus, Filter } from 'lucide-react';

export default function ContactsView({ 
  contacts, 
  onSelectContact, 
  searchQuery,
  onOpenNewDeal 
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredContacts = contacts.filter(contact => {
    const matchesQuery = searchQuery === '' ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || contact.status.toUpperCase() === statusFilter;

    return matchesQuery && matchesStatus;
  });

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
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Contacts & Accounts</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Enterprise decision makers, procurement contacts, and stakeholder records.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem', background: '#131b2e', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {['ALL', 'HOT', 'ACTIVE', 'PENDING'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  background: statusFilter === st ? '#38bdf8' : 'transparent',
                  color: statusFilter === st ? '#0f172a' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={onOpenNewDeal}>
            <UserPlus size={16} />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="contacts-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Contact Name</th>
                <th>Company & Role</th>
                <th>Status</th>
                <th>Contact Channels</th>
                <th>Lifetime Value</th>
                <th>Last Touchpoint</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((c) => {
                const initials = c.name.split(' ').map(n => n[0]).join('');
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="contact-name-cell">
                        <div className="contact-avatar">{initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <MapPin size={11} /> {c.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: '#e2e8f0' }}>{c.company}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.role}</div>
                    </td>
                    <td>
                      <span className={`status-pill status-${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.78rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
                          <Mail size={12} color="#38bdf8" /> {c.email}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
                          <Phone size={12} color="#10b981" /> {c.phone}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#38bdf8' }}>${c.totalValue.toLocaleString()}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.dealsCount} deal(s)</div>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                      {c.lastActivity}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', marginLeft: 'auto' }}
                        onClick={() => onSelectContact(c)}
                      >
                        Profile <ExternalLink size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
