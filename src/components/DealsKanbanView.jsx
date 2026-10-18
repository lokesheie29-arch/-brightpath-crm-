import React, { useState } from 'react';
import { Plus, Filter, ArrowRight, DollarSign, Calendar, User, Tag } from 'lucide-react';

export default function DealsKanbanView({ 
  deals, 
  stages, 
  onUpdateDealStage, 
  onOpenNewDeal, 
  searchQuery 
}) {
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filteredDeals = deals.filter(deal => {
    const matchesQuery = searchQuery === '' || 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = priorityFilter === 'ALL' || deal.priority.toUpperCase() === priorityFilter;

    return matchesQuery && matchesPriority;
  });

  return (
    <div className="page-content">
      {/* Action & Filter Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '0.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Sales Pipeline & Deals</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Manage and advance opportunities through your custom sales lifecycle stages.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#131b2e', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Filter size={14} color="#94a3b8" />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Priority:</span>
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                style={{
                  background: priorityFilter === p ? '#38bdf8' : 'transparent',
                  color: priorityFilter === p ? '#0f172a' : '#94a3b8',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={onOpenNewDeal}>
            <Plus size={16} />
            <span>Add Deal</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {stages.map((stage) => {
          const stageDeals = filteredDeals.filter(d => d.stage === stage.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div key={stage.id} className="kanban-column">
              <div className="column-header">
                <div className="column-title-wrap">
                  <span className="stage-dot" style={{ backgroundColor: stage.color }} />
                  <span className="column-title">{stage.name}</span>
                  <span className="column-count">{stageDeals.length}</span>
                </div>
                <div className="column-total">${(stageTotal / 1000).toFixed(0)}k</div>
              </div>

              <div className="cards-container">
                {stageDeals.map((deal) => (
                  <div key={deal.id} className="deal-card">
                    <div className="deal-card-header">
                      <div>
                        <div className="deal-title">{deal.title}</div>
                        <div className="deal-company">{deal.company}</div>
                      </div>
                      <span className={`priority-badge priority-${deal.priority.toLowerCase()}`}>
                        {deal.priority}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', margin: '0.4rem 0 0.65rem 0' }}>
                      {deal.tags && deal.tags.map((tag, i) => (
                        <span key={i} style={{
                          fontSize: '0.65rem',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#94a3b8',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <User size={13} /> {deal.contactName}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> {deal.expectedClose}
                      </span>
                    </div>

                    <div className="deal-footer">
                      <div className="deal-amount">${deal.value.toLocaleString()}</div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select
                          className="stage-select"
                          value={deal.stage}
                          onChange={(e) => onUpdateDealStage(deal.id, e.target.value)}
                          title="Advance or move stage"
                        >
                          {stages.map(s => (
                            <option key={s.id} value={s.id} style={{ background: '#131b2e', color: '#fff' }}>
                              → {s.name}
                            </option>
                          ))}
                        </select>
                        <img 
                          src={deal.ownerAvatar} 
                          alt={deal.owner} 
                          className="deal-avatar" 
                          title={deal.owner}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    border: '1px dashed rgba(255,255,255,0.08)',
                    borderRadius: '8px'
                  }}>
                    No deals in {stage.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
