import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function NewDealModal({ isOpen, onClose, onSaveDeal, stages }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    contactName: '',
    email: '',
    phone: '',
    value: '',
    stage: 'lead',
    priority: 'Medium',
    expectedClose: '',
    tags: 'Enterprise, SaaS'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;

    const newDeal = {
      id: `deal-${Date.now()}`,
      title: formData.title,
      company: formData.company,
      contactName: formData.contactName || 'New Prospect',
      email: formData.email || 'contact@company.com',
      phone: formData.phone || '+1 (555) 000-0000',
      value: Number(formData.value) || 25000,
      stage: formData.stage,
      priority: formData.priority,
      probability: formData.stage === 'lead' ? 25 : formData.stage === 'discovery' ? 45 : formData.stage === 'proposal' ? 65 : 85,
      expectedClose: formData.expectedClose || '2026-12-15',
      owner: 'Marcus Vance',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    onSaveDeal(newDeal);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Create New Deal Opportunity</div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Deal / Opportunity Title *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. NextGen Cloud Core Modernization"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Company / Organization *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Acme Global Logistics"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Estimated Value ($ USD) *</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  placeholder="e.g. 75000"
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Key Contact Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rachel Adams"
                  value={formData.contactName}
                  onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. rachel@acmeglobal.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Sales Pipeline Stage</label>
                <select
                  className="form-select"
                  value={formData.stage}
                  onChange={e => setFormData({ ...formData, stage: e.target.value })}
                >
                  {stages.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Priority Tier</label>
                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target Close Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.expectedClose}
                  onChange={e => setFormData({ ...formData, expectedClose: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Tags (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Cloud, SaaS, Q4"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} /> Save & Add to Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
