import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import DealsKanbanView from './components/DealsKanbanView';
import ContactsView from './components/ContactsView';
import TasksView from './components/TasksView';
import AnalyticsView from './components/AnalyticsView';
import NewDealModal from './components/NewDealModal';
import ContactModal from './components/ContactModal';
import { 
  INITIAL_STAGES, 
  INITIAL_DEALS, 
  INITIAL_CONTACTS, 
  INITIAL_TASKS, 
  INITIAL_ACTIVITIES 
} from './mockData';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [stages] = useState(INITIAL_STAGES);
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Update Deal Stage
  const handleUpdateDealStage = (dealId, newStage) => {
    const stageObj = stages.find(s => s.id === newStage);
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        return { ...d, stage: newStage };
      }
      return d;
    }));

    const deal = deals.find(d => d.id === dealId);
    if (deal && stageObj) {
      showToast(`Moved "${deal.title}" to ${stageObj.name}`);
      // Append activity
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          type: 'stage_change',
          title: `Deal Advanced: ${stageObj.name}`,
          description: `${deal.company} was shifted into ${stageObj.name}.`,
          user: 'Marcus Vance',
          time: 'Just now',
          badge: stageObj.name,
          badgeColor: stageObj.color
        },
        ...prev
      ]);
    }
  };

  // Save new deal / lead
  const handleSaveDeal = (newDeal) => {
    setDeals(prev => [newDeal, ...prev]);
    
    // Also add to contacts if not existing
    const existingContact = contacts.find(c => c.name.toLowerCase() === newDeal.contactName.toLowerCase());
    if (!existingContact && newDeal.contactName) {
      const newContact = {
        id: `c-${Date.now()}`,
        name: newDeal.contactName,
        role: 'Key Executive',
        company: newDeal.company,
        email: newDeal.email,
        phone: newDeal.phone,
        status: 'Hot',
        dealsCount: 1,
        totalValue: newDeal.value,
        location: 'United States',
        lastActivity: 'Just now',
        notes: `Created deal opportunity: ${newDeal.title}`
      };
      setContacts(prev => [newContact, ...prev]);
    }

    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'deal_added',
        title: `Opportunity Created: $${newDeal.value.toLocaleString()}`,
        description: `${newDeal.title} added for ${newDeal.company}.`,
        user: 'Marcus Vance',
        time: 'Just now',
        badge: 'New Lead',
        badgeColor: '#38bdf8'
      },
      ...prev
    ]);

    showToast(`Successfully added deal: ${newDeal.title}`);
  };

  // Toggle Task Completed
  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) {
          showToast(`Completed task: "${t.title.slice(0, 30)}..."`);
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  // Add Task
  const handleAddTask = (task) => {
    setTasks(prev => [task, ...prev]);
    showToast(`Added action item: ${task.title.slice(0, 30)}...`);
  };

  // Add Note to Contact
  const handleAddContactNote = (contactId, note) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        const updatedNotes = c.notes ? `${c.notes}\n• [${new Date().toLocaleDateString()}]: ${note}` : `• [${new Date().toLocaleDateString()}]: ${note}`;
        return { ...c, notes: updatedNotes, lastActivity: 'Just now' };
      }
      return c;
    }));

    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact(prev => ({
        ...prev,
        notes: prev.notes ? `${prev.notes}\n• [${new Date().toLocaleDateString()}]: ${note}` : `• [${new Date().toLocaleDateString()}]: ${note}`
      }));
    }

    showToast('Log note added successfully');
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        dealsCount={deals.length}
        tasksCount={tasks.filter(t => !t.completed).length}
      />

      <div className="main-wrapper">
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNewDeal={() => setIsNewDealOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {activeTab === 'dashboard' && (
          <DashboardView 
            deals={deals}
            stages={stages}
            tasks={tasks}
            activities={activities}
            onSelectTab={setActiveTab}
            onOpenDeal={() => setActiveTab('deals')}
          />
        )}

        {activeTab === 'deals' && (
          <DealsKanbanView 
            deals={deals}
            stages={stages}
            onUpdateDealStage={handleUpdateDealStage}
            onOpenNewDeal={() => setIsNewDealOpen(true)}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'contacts' && (
          <ContactsView 
            contacts={contacts}
            onSelectContact={setSelectedContact}
            searchQuery={searchQuery}
            onOpenNewDeal={() => setIsNewDealOpen(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView 
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            deals={deals}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView 
            deals={deals}
          />
        )}
      </div>

      {/* Modals */}
      <NewDealModal 
        isOpen={isNewDealOpen}
        onClose={() => setIsNewDealOpen(false)}
        onSaveDeal={handleSaveDeal}
        stages={stages}
      />

      <ContactModal 
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onAddNote={handleAddContactNote}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={18} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
