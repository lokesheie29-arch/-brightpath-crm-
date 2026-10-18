import React, { useState } from 'react';
import { 
  UserPlus, 
  Filter, 
  Search, 
  Phone, 
  Mail, 
  ExternalLink, 
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { Lead, LeadStatus, Profile } from '../../types/crm';
import { STATUS_CONFIG, COURSE_OPTIONS, SOURCE_OPTIONS } from '../../mockData';

interface LeadsViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onOpenNewLead: () => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  searchQuery: string;
  profiles: Profile[];
}

export default function LeadsView({
  leads,
  onSelectLead,
  onOpenNewLead,
  onUpdateStatus,
  searchQuery,
  profiles
}: LeadsViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === '' ||
      lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.course_interest.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesCourse = courseFilter === 'ALL' || lead.course_interest === courseFilter;
    const matchesSource = sourceFilter === 'ALL' || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesCourse && matchesSource;
  });

  const resetFilters = () => {
    setStatusFilter('ALL');
    setCourseFilter('ALL');
    setSourceFilter('ALL');
  };

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
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Student Enquiries & Admissions</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Track student leads from initial enquiry to diagnostic testing, counselling, and enrolment.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn-primary" onClick={onOpenNewLead}>
            <UserPlus size={16} />
            <span>New Enquiry</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          <Filter size={15} />
          <span>Filters:</span>
        </div>

        <select 
          className="form-select" 
          style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>

        <select 
          className="form-select" 
          style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
        >
          <option value="ALL">All Courses</option>
          {COURSE_OPTIONS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select 
          className="form-select" 
          style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
          value={sourceFilter}
          onChange={e => setSourceFilter(e.target.value)}
        >
          <option value="ALL">All Enquiry Channels</option>
          {SOURCE_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {(statusFilter !== 'ALL' || courseFilter !== 'ALL' || sourceFilter !== 'ALL') && (
          <button 
            className="btn-secondary" 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', marginLeft: 'auto' }}
            onClick={resetFilters}
          >
            <RotateCcw size={12} /> Reset Filters
          </button>
        )}
      </div>

      {/* Leads Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="contacts-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Student / Lead Name</th>
                <th>Course Interest</th>
                <th>Enquiry Channel</th>
                <th>Admission Status</th>
                <th>Contact Phone & Email</th>
                <th>Counsellor</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const initials = lead.full_name.split(' ').map(n => n[0]).join('');
                const cfg = STATUS_CONFIG[lead.status];
                const counsellor = profiles.find(p => p.id === lead.assigned_to);

                return (
                  <tr key={lead.id}>
                    <td>
                      <div className="contact-name-cell">
                        <div className="contact-avatar">{initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{lead.full_name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Added {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <BookOpen size={14} color="#38bdf8" />
                        <span>{lead.course_interest}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{lead.source}</span>
                    </td>
                    <td>
                      <select
                        className="stage-select"
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        style={{
                          background: cfg?.bg,
                          color: cfg?.color,
                          borderColor: cfg?.color,
                          fontWeight: 600
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.78rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f8fafc' }}>
                          <Phone size={12} color="#10b981" /> {lead.phone}
                        </span>
                        {lead.email && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
                            <Mail size={12} color="#38bdf8" /> {lead.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                      {counsellor ? counsellor.full_name : 'Unassigned'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', marginLeft: 'auto' }}
                        onClick={() => onSelectLead(lead)}
                      >
                        Details <ExternalLink size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              No student enquiries found matching the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
