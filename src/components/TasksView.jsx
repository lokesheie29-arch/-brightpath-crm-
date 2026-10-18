import React, { useState } from 'react';
import { CheckSquare, Plus, Clock, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function TasksView({ tasks, onToggleTask, onAddTask, deals }) {
  const [filter, setFilter] = useState('ALL');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newDueDate, setNewDueDate] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'PENDING') return !t.completed;
    if (filter === 'COMPLETED') return t.completed;
    return true;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      dueDate: newDueDate || 'This week',
      priority: newPriority,
      completed: false,
      assignedTo: 'Marcus Vance'
    });
    setNewTitle('');
    setNewDueDate('');
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
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Action Items & Follow-ups</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Track client commitments, proposal reviews, and key deadline deliverables.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', background: '#131b2e', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {['ALL', 'PENDING', 'COMPLETED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                background: filter === status ? '#38bdf8' : 'transparent',
                color: filter === status ? '#0f172a' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 2, minWidth: '220px' }}
            placeholder="Add new high-priority sales task or client reminder..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, minWidth: '140px' }}
            placeholder="Due date (e.g. Tomorrow, 2 PM)"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
          <select
            className="form-select"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <button type="submit" className="btn-primary">
            <Plus size={16} /> Add Task
          </button>
        </form>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onToggleTask(task.id)}
            >
              <div className="task-left">
                <input 
                  type="checkbox" 
                  className="task-checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                />
                <div>
                  <div className="task-text">{task.title}</div>
                  <div className="task-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '3px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {task.dueDate}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <User size={12} /> {task.assignedTo}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <CheckCircle size={36} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
              <div>No tasks found for this view.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
