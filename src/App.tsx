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
import { leadsService } from './services/leadsService';
import { activitiesService } from './services/activitiesService';
import { 
  INITIAL_LEADS, 
  INITIAL_FOLLOW_UPS, 
  INITIAL_ACTIVITIES, 
  INITIAL_PROFILES 
} from './mockData';
import { Lead, LeadStatus, FollowUp, Activity, Profile } from './types/crm';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

export default function App() {
  const { profile: authProfile, switchDemoProfile } = useAuth();
  const [profiles] = useState<Profile[]>(INITIAL_PROFILES);
  const currentUser = authProfile || INITIAL_PROFILES[0];

  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [followUps, setFollowUps] = useState<FollowUp[]>(INITIAL_FOLLOW_UPS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [isLoadingLeads, setIsLoadingLeads] = useState<boolean>(true);

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

  // Load persisted leads & activities
  useEffect(() => {
    async function loadData() {
      setIsLoadingLeads(true);
      const [leadsRes, actsRes] = await Promise.all([
        leadsService.fetchLeads(),
        activitiesService.fetchActivities()
      ]);
      if (leadsRes.data) {
        setLeads(leadsRes.data);
      }
      if (actsRes) {
        setActivities(actsRes);
      }
      setIsLoadingLeads(false);
    }
    loadData();
  }, []);

  // Status Update with persistence
  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    const lead = leads.find(l => l.id === leadId);

    // Optimistic UI update
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, status: newStatus, updated_at: new Date().toISOString() };
      }
      return l;
    }));

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }

    if (lead) {
      showToast(`Updated ${lead.full_name}'s status to ${newStatus}`);
      
      // Persist status change
      await leadsService.updateLeadStatus(leadId, newStatus);

      // Record Activity
      const newAct = await activitiesService.recordActivity(
        leadId,
        currentUser.id,
        currentUser.full_name,
        'status_changed',
        `Status changed to ${newStatus}`,
        { previousStatus: lead.status, newStatus }
      );
      setActivities(prev => [newAct, ...prev]);
    }
  };

  // Save New Lead with persistence
  const handleSaveLead = async (newLead: Lead) => {
    // Optimistic UI update
    setLeads(prev => [newLead, ...prev]);

    // Persist to database / localStorage
    const res = await leadsService.createLead(newLead);
    if (res.error) {
      showToast(`Error saving: ${res.error}`);
    } else {
      showToast(`Registered student enquiry: ${newLead.full_name}`);
    }
    
    const newAct = await activitiesService.recordActivity(
      newLead.id,
      currentUser.id,
      currentUser.full_name,
      'lead_created',
      `New enquiry registered for ${newLead.course_interest}`,
      { source: newLead.source }
    );
    setActivities(prev => [newAct, ...prev]);
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
  const handleSaveFollowUp = async (newFollowUp: FollowUp) => {
    setFollowUps(prev => [newFollowUp, ...prev]);

    const newAct = await activitiesService.recordActivity(
      newFollowUp.lead_id,
      currentUser.id,
      currentUser.full_name,
      'follow_up_scheduled',
      `Follow-up scheduled: "${newFollowUp.note}"`,
      { due_at: newFollowUp.due_at }
    );
    setActivities(prev => [newAct, ...prev]);

    showToast('Follow-up scheduled successfully!');
  };

  // Add Note to Lead with persistence
  const handleAddNote = async (leadId: string, note: string) => {
    const res = await leadsService.appendLeadNote(leadId, note, currentUser.full_name);
    
    if (res.updatedNotes) {
      setLeads(prev => prev.map(l => {
        if (l.id === leadId) {
          return { ...l, notes: res.updatedNotes, updated_at: new Date().toISOString() };
        }
        return l;
      }));

      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(prev => prev ? {
          ...prev,
          notes: res.updatedNotes
        } : null);
      }
    }

    const newAct = await activitiesService.recordActivity(
      leadId,
      currentUser.id,
      currentUser.full_name,
      'note_added',
      `Note added: "${note.slice(0, 40)}..."`
    );
    setActivities(prev => [newAct, ...prev]);

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
