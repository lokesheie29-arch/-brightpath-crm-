# BrightPath CRM — Master Execution Plan (`plan.md`)

This plan tracks the end-to-end implementation of **BrightPath CRM**, an intelligent, secure student enquiry and admissions relationship management system for BrightPath Academy, built according to the **Full Master Build Prompt** specification.

---

## 1. System Overview & Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Vanilla CSS Design System with rich dark SaaS aesthetics, micro-animations, and full responsiveness
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security, Supabase Auth)
- **Deployment Target**: Vercel (Frontend) + Supabase Cloud (Backend)
- **Repository**: Git & GitHub (`lokesheie29-arch/-brightpath-crm-`)

---

## 2. Core Relational Data Model

1. **`profiles`**: Linked 1:1 to `auth.users`. Contains `id`, `full_name`, `role` (`admin`, `manager`, `counsellor`), timestamps.
2. **`leads`**: Student enquiries with `full_name`, `email`, `phone`, `course_interest`, `source`, `status` (`New`, `Contacted`, `Qualified`, `Converted`, `Lost`), `assigned_to`, `created_by`, `notes`.
3. **`follow_ups`**: Scheduled actions tied to leads with `due_at`, `note`, `status` (`pending`, `completed`, `cancelled`), `completed_at`, `assigned_to`.
4. **`activities`**: Audit trail of events (`lead_created`, `status_changed`, `note_added`, `follow_up_scheduled`, `follow_up_completed`) with metadata.

---

## 3. Phased Execution Roadmap

### [ ] Phase 0: Inspection, Risk Assessment & Plan Initialization
- [x] Read `BrightPath_CRM_Full_Master_Build_Prompt.docx` completely.
- [x] Inspect existing workspace, Git remote, and package state.
- [x] Create `plan.md` tracking all phases and acceptance criteria.
- *Status*: **Completed**

---

### [x] Phase 1: TypeScript Conversion & Academy Domain Foundation
- [x] Install `typescript`, `@types/react`, `@types/react-dom`.
- [x] Configure `tsconfig.json`.
- [x] Scaffold folder hierarchy (`src/types/`, `src/components/`, `src/features/`, `src/lib/`, `src/services/`, `src/utils/`, `supabase/migrations/`).
- [x] Define comprehensive TypeScript data models in `src/types/crm.ts` matching coaching academy requirements.
- [x] Refactor UI domain from corporate B2B deals to BrightPath Academy student admissions (Courses: SAT Prep, Foundation, Science, Math; Sources: Walk-in, Website, Referral, Phone, Social; Statuses: New, Contacted, Qualified, Converted, Lost).
- [x] Update `index.html` to reference `src/main.tsx`.
- [x] Verify `npm run build` passes with zero type errors.
- *Status*: **Completed** (Verified: Vite build succeeded in 2.67s)

---

### [x] Phase 2: Supabase Client & Environment Configuration
- [x] Install `@supabase/supabase-js`.
- [x] Create `.env.example` with non-secret placeholders (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- [x] Ensure `.env` is ignored by Git in `.gitignore`.
- [x] Implement `src/lib/supabaseClient.ts` with strict environment variable validation.
- [x] Implement user-friendly configuration banner (`SupabaseStatusBanner.tsx`) displaying connection status and 3-step setup guide.
- [x] Verify app handles missing and present config safely.
- *Status*: **Completed** (Verified: build passed and banner rendered)

---

### [ ] Phase 3: SQL Migrations, Database Schema & RLS Policies
- [ ] Create `supabase/migrations/20261018000000_initial_schema.sql`.
- [ ] DDL for `profiles`, `leads`, `follow_ups`, `activities`.
- [ ] Add check constraints, foreign keys, cascade rules, and performance indexes.
- [ ] Enable RLS on all tables with granular policies for Counsellor vs Manager/Admin.
- [ ] Add `handle_new_user()` trigger to automatically create a default `counsellor` profile on Supabase auth signup.
- [ ] Provide SQL instructions for owner execution in Supabase SQL Editor.
- *Status*: **Pending**

---

### [ ] Phase 4: Authentication & User Role Lifecycle
- [ ] Implement Supabase Auth state listener in `src/features/auth/AuthContext.tsx`.
- [ ] Build Login / Register form modal with clean validation.
- [ ] Fetch and bind user profile with role (`admin`, `manager`, `counsellor`).
- [ ] Ensure client cannot self-escalate role.
- [ ] Verify sign-in, sign-out, session restoration, and unauthorized error states.
- *Status*: **Pending**

---

### [ ] Phase 5: Student Lead Management (Real Persistence)
- [ ] Build typed `src/services/leadsService.ts`.
- [ ] Lead List with search, filtering by status/source/counsellor, and sorting.
- [ ] Create Lead modal with validation (name, phone, course interest, source, notes).
- [ ] Lead Detail drawer showing full history, contact info, and status progression.
- [ ] Verify lead creation and editing persist across page refreshes.
- *Status*: **Pending**

---

### [ ] Phase 6: Follow-ups Scheduling & Automated Activity Trail
- [ ] Build typed `src/services/followupsService.ts` and `src/services/activitiesService.ts`.
- [ ] Schedule follow-ups with exact date/time, assignee, and note.
- [ ] Mark follow-up as completed (records `completed_at`, prevents appearing overdue).
- [ ] Filter into "Upcoming" vs "Overdue" (`due_at < now() && status = 'pending'`).
- [ ] Auto-log activity records when leads change status or follow-ups are marked done.
- *Status*: **Pending**

---

### [ ] Phase 7: Live Executive Dashboard & Analytics
- [ ] Compute real-time KPIs: Total Enquiries, New Leads, Converted Students, Overdue Follow-ups.
- [ ] True conversion rate calculation with divide-by-zero protection.
- [ ] Inbound channel distribution chart (Walk-in, Referral, Website, Phone, Social).
- [ ] Reconcile all dashboard counts 1:1 with permitted lead database rows.
- *Status*: **Pending**

---

### [ ] Phase 8: Accessibility, Responsive Polish & Resilient Feedback
- [ ] Responsive navigation for mobile and desktop screens.
- [ ] WCAG contrast validation, keyboard navigation, focus outlines.
- [ ] Toast notification system for async actions.
- [ ] Graceful network error handling (no unhandled promises or empty catch blocks).
- *Status*: **Pending**

---

### [ ] Phase 9: Verification, Static Checks & Documentation Handover
- [ ] Run full typecheck and build check (`npm run build`).
- [ ] Write student-friendly `README.md` with architecture, local setup, SQL execution steps, and limitations.
- *Status*: **Pending**

---

### [ ] Phase 10: Git Sync & Vercel Deployment Guide
- [ ] Commit milestone code to GitHub with descriptive messages.
- [ ] Provide Vercel environment variable and build configuration guide.
- [ ] Final live verification checklist.
- *Status*: **Pending**
