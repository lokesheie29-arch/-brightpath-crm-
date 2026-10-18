import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './features/dashboard/DashboardView';
import LeadsView from './features/leads/LeadsView';
import NewLeadModal from './features/leads/NewLeadModal';
import LeadDetailModal from './features/leads/LeadDetailModal';
import FollowUpsView from './features/followups/FollowUpsView';
import NewFollowUpModal from './features/followups/NewFollowUpModal';
import ReportsView from './features/reports/ReportsView';
import SupabaseStatusBanner from './components/SupabaseStatusBanner';
import AuthModal from './features/auth/AuthModal';
import { useAuth } from './features/auth/AuthContext';
import { 
  INITIAL_LEADS, 
  INITIAL_FOLLOW_UPS, 
  INITIAL_ACTIVITIES, 
  INITIAL_PROFILES 
} from './mockData';
import { Lead, LeadStatus, FollowUp, Activity, Profile } from './types/crm';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const { profile: authProfile, switchDemoProfile } = useAuth();
  const [profiles] = useState<Profile[]>(INITIAL_PROFILES);
  const currentUser = authProfile || INITIAL_PROFILES[0];

  const [leads, setLeals] = useState<Lead[]>(INITIAL_LEADS);
  const [followUps, setFollowUps] = useState<FollowUp[]>(INITIAL_FOLLOW_UPS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState<boolean>(false);
  const [isNewFollowUpOpen, setIsNewFollowUpOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [scheduleForLeadId, setScheduleForLeadId] = useState<string | undefined>(undefined);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Status Update
  const handleUpdateStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeals(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, status: newStatus, updated_at: new Date().toISOString() };
      }
      return l;
    }));

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }

    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      showToast(`Updated ${lead.full_name}'s status to ${newStatus}`);
      // Record Activity
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        lead_id: leadId,
        actor_id: currentUser.id,
        activity_type: 'status_changed',
        description: `Status changed to ${newStatus}`,
        metadata: { status: newStatus },
        created_at: new Date().toISOString(),
        actor_name: currentUser.full_name
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  };

  // Save New Lead
  const handleSaveLead = (newLead: Lead) => {
    setLeals(prev => [newLead, ...prev]);
    
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      lead_id: newLead.id,
      actor_id: currentUser.id,
      activity_type: 'lead_created',
      description: `New enquiry registered for ${newLead.course_interest}`,
      created_at: new Date().toISOString(),
      actor_name: currentUser.full_name
    };
    setActivities(prev => [newActivity, ...prev]);

    showToast(`Registered student enquiry: ${newLead.full_name}`);
  };

  // Toggle FollowUp Completed/Pending
  const handleToggleFollowUp = (followUpId: string) => {
    setFollowUps(prev => prev.map(f => {
      if (f.id === followUpId) {
        const nextStatus = f.status === 'completed' ? 'pending' : 'completed';
        const completedAt = nextStatus === 'completed' ? new Date().toISOString() : null;
        if (nextStatus === 'completed') {
          showToast('Follow-up marked completed!');
        }
        return { ...f, status: nextStatus, completed_at: completedAt };
      }
      return f;
    }));
  };

  // Save FollowUp
  const handleSaveFollowUp = (newFollowUp: FollowUp) => {
    setFollowUps(prev => [newFollowUp, ...prev]);

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      lead_id: newFollowUp.lead_id,
      actor_id: currentUser.id,
      activity_type: 'follow_up_scheduled',
      description: `Follow-up scheduled: "${newFollowUp.note}"`,
      created_at: new Date().toISOString(),
      actor_name: currentUser.full_name
    };
    setActivities(prev => [newActivity, ...prev]);

    showToast('Follow-up scheduled successfully!');
  };

  // Add Note to Lead
  const handleAddNote = (leadId: string, note: string) => {
    const timestamp = new Date().toLocaleDateString();
    setLeals(prev => prev.map(l => {
      if (l.id === leadId) {
        const updated = l.notes ? `${l.notes}\n• [${timestamp} - ${currentUser.full_name}]: ${note}` : `• [${timestamp} - ${currentUser.full_name}]: ${note}`;
        return { ...l, notes: updated, updated_at: new Date().toISOString() };
      }
      return l;
    }));

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? {
        ...prev,
        notes: prev.notes ? `${prev.notes}\n• [${timestamp} - ${currentUser.full_name}]: ${note}` : `• [${timestamp} - ${currentUser.full_name}]: ${note}`
      } : null);
    }

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      lead_id: leadId,
      actor_id: currentUser.id,
      activity_type: 'note_added',
      description: `Note added: "${note.slice(0, 40)}..."`,
      created_at: new Date().toISOString(),
      actor_name: currentUser.full_name
    };
    setActivities(prev => [newActivity, ...prev]);

    showToast('Counselling note logged');
  };

  const overdueCount = followUps.filter(f => f.status === 'pending' && new Date(f.due_at) < new Date()).length;

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        leadsCount={leads.length}
        overdueCount={overdueCount}
        currentUser={currentUser}
      />

      <div className="main-wrapper">
        <SupabaseStatusBanner />
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNewLead={() => setIsNewLeadOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentUser={currentUser}
          onSwitchUser={switchDemoProfile}
          profiles={profiles}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {activeTab === 'dashboard' && (
          <DashboardView 
            leads={leads}
            followUps={followUps}
            activities={activities}
            currentUser={currentUser}
            onSelectTab={setActiveTab}
            onSelectLead={setSelectedLead}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsView 
            leads={leads}
            onSelectLead={setSelectedLead}
            onOpenNewLead={() => setIsNewLeadOpen(true)}
            onUpdateStatus={handleUpdateStatus}
            searchQuery={searchQuery}
            profiles={profiles}
          />
        )}

        {activeTab === 'followups' && (
          <FollowUpsView 
            followUps={followUps}
            leads={leads}
            onToggleFollowUp={handleToggleFollowUp}
            onOpenScheduleFollowUp={(leadId) => {
              setScheduleForLeadId(leadId);
              setIsNewFollowUpOpen(true);
            }}
            onSelectLead={setSelectedLead}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView 
            leads={leads}
            profiles={profiles}
          />
        )}
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <NewLeadModal 
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onSaveLead={handleSaveLead}
        profiles={profiles}
        currentUserId={currentUser.id}
      />

      <LeadDetailModal 
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={handleUpdateStatus}
        onAddNote={handleAddNote}
        followUps={followUps}
        activities={activities}
        onOpenScheduleFollowUp={(leadId) => {
          setScheduleForLeadId(leadId);
          setIsNewFollowUpOpen(true);
        }}
        onToggleFollowUp={handleToggleFollowUp}
        profiles={profiles}
      />

      <NewFollowUpModal 
        isOpen={isNewFollowUpOpen}
        onClose={() => {
          setIsNewFollowUpOpen(false);
          setScheduleForLeadId(undefined);
        }}
        onSaveFollowUp={handleSaveFollowUp}
        leads={leads}
        defaultLeadId={scheduleForLeadId}
        profiles={profiles}
        currentUserId={currentUser.id}
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
