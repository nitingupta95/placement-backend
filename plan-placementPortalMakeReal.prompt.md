# Plan: Make Placement Portal Production-Ready

**TL;DR:** Build all missing backend modules (Jobs, Applications, Company, Admin, Job-Intelligence, Student-Matching) in the Express backend, then replace every mock/hardcoded data source in all three frontend dashboards with real API calls. Auth logout is frontend-only. All three portals are tackled in parallel per module.

---

## PHASE 1 — Backend: Missing Modules

### Step 1 — Jobs Module
Create `placement-portal-backend/src/modules/jobs/` with:
- `job.routes.ts` — mount at `/jobs`
- `job.controller.ts` — handlers: `listJobs`, `getJobById`, `createJob`, `updateJob`, `deleteJob`, `applyToJob`
- `job.service.ts` — business logic, eligibility check against student `skills` and `activeBacklogs`
- `job.repository.ts` — Prisma queries on `JobPosting` and `JobApplication` models
- DTOs: `create-job.dto.ts`, `apply-job.dto.ts`

Endpoints to implement:
```
GET    /jobs                    [Student: see eligible jobs, Company: see own jobs, Admin: see all]
GET    /jobs/:id
POST   /jobs                    [Company only]
PUT    /jobs/:id                [Company only]
DELETE /jobs/:id                [Company/Admin]
PATCH  /jobs/:id/status         [Admin: approve/reject]
POST   /jobs/:id/apply          [Student only]
```

### Step 2 — Applications Module
Create `placement-portal-backend/src/modules/applications/`:
- `application.routes.ts`, `application.controller.ts`, `application.service.ts`, `application.repository.ts`

Endpoints:
```
GET    /applications/:id
PATCH  /applications/:id/status    [Company: shortlisted|interview|offered|rejected]
GET    /jobs/:id/applications      [Company: applications per job]
```

### Step 3 — Student Module Extensions
Add to `placement-portal-backend/src/modules/student/student.routes.ts`:
```
GET    /student/dashboard/stats     → { applied, shortlisted, interviews, offers }
GET    /student/applications        → paginated application list
GET    /student/saved-jobs          → saved job list
POST   /student/saved-jobs/:jobId
DELETE /student/saved-jobs/:jobId
GET    /student/resume/ats-runs     → ATS analysis history from LangGraph
```
Add `SavedJob` model to `prisma/schema.prisma` (Student → JobPosting join via saved_jobs table).

### Step 4 — Company Module
Create `placement-portal-backend/src/modules/company/`:
```
GET    /company/profile
PUT    /company/profile
GET    /company/dashboard/stats     → { totalJobs, totalApplications, interviewsScheduled, hired }
GET    /company/jobs                → own job listings
GET    /company/analytics           → funnel stats
```

### Step 5 — Admin Module
Create `placement-portal-backend/src/modules/admin/`:
```
GET    /admin/dashboard/stats
GET    /admin/companies             (+ PATCH /:id/verify)
GET    /admin/students              (+ analytics endpoint)
GET    /admin/analytics/students
GET    /admin/analytics/companies
GET/PATCH /admin/jobs/pending       (approve/reject)
GET/POST/PUT/DELETE /admin/announcements
GET/POST/DELETE /admin/headlines
GET/POST /admin/outreach
GET    /admin/alumni
POST   /admin/reports/generate
GET/POST/PATCH/DELETE /admin/users
```

### Step 6 — Job Intelligence Module
Create `placement-portal-backend/src/modules/job-intelligence/`:
- Store scraped job results in DB (new `ScrapedJob` Prisma model)
- Proxy to existing scraper microservice at `VITE_SCRAPER_URL`

```
GET    /internal/job-intelligence/latest
GET    /internal/job-intelligence/run/:runId
POST   /internal/job-intelligence/trigger
GET    /job-intelligence/latest         [Student-facing]
```

### Step 7 — Student Matching Module
Create `placement-portal-backend/src/modules/student-matching/`:
- Proxy to existing orchestrator microservice at `VITE_ORCHESTRATOR_URL`

```
GET    /student-matching/eligible-students?jobId=...
POST   /student-matching/approve
POST   /student-matching/batch
```

### Step 8 — Auth Logout
Add `POST /auth/logout` to `placement-portal-backend/src/modules/auth/auth.routes.ts` (frontend-only: just return 200; client clears localStorage).

### Step 9 — Register All New Routes
Register all new modules in `placement-portal-backend/src/routes/index.ts`.

---

## PHASE 2 — Frontend: Replace All Mocks

### Step 10 — Student Dashboard API Layer
Rewrite `src/features/dashboard/pages/studentDashboard/api/client.ts` to use the real Axios instance from `src/services/api.ts` instead of `mockApiCall`. Then update:
- `student.api.ts` → call real `GET /student/profile`, `PUT /student/profile`
- `job.api.ts` → call real `GET /jobs`, `GET /jobs/:id`, `POST /jobs/:id/apply`, saved jobs endpoints
- `application.api.ts` → call real `GET /student/applications`
- Dashboard stats → call real `GET /student/dashboard/stats`
- Delete `mockData.ts` after all are wired

### Step 11 — Company Dashboard
Replace inline hardcoded arrays in:
- `CompanyDashboardPage.tsx` → `GET /company/dashboard/stats`
- `MyJobsPage.tsx` → `GET /company/jobs`
- `ApplicationsPage.tsx` → `GET /jobs/:id/applications`
- Wire `PostJobPage.tsx` `onSubmit` → `POST /jobs`
- Add company signup page (`/register/company`) calling `authService.companyRegister`

### Step 12 — Admin Dashboard
Replace all `mockData.ts` imports in every page under `adminDashboard/pages/`:
- `OpportunitiesPage.tsx` → `GET /admin/jobs/pending` + `GET /internal/job-intelligence/latest`
- `CompaniesPage.tsx` → `GET /admin/companies`
- `AnnouncementsPage.tsx` → CRUD on `/admin/announcements`
- `AlumniPage.tsx` → `GET /admin/alumni`
- `ReportsPage.tsx` → `POST /admin/reports/generate`
- `StudentsAnalyticsPage.tsx` → `GET /admin/analytics/students`
- `ReviewJobsPage.tsx` → `GET /admin/jobs/pending` + `PATCH /admin/jobs/:id/approve`
- `MockInterviewsPage.tsx` → connect to mock interview module
- `HeadlinesPage.tsx` → CRUD on `/admin/headlines`
- `OutreachPage.tsx` → `/admin/outreach`
- Delete `adminDashboard/api/mockData.ts` after all pages are wired

---

## PHASE 3 — Database Schema Updates

Add to `prisma/schema.prisma`:
- `SavedJob` model (Student ↔ JobPosting many-to-many)
- `ScrapedJob` model (for storing job intelligence scraping results)
- `Announcement` model (title, content, createdBy, createdAt)
- `Headline` model (company, headline text, date)
- `ATSRun` model (studentId, resumeUrl, score, suggestions, createdAt) for storing LangGraph results
- `MockInterview` model if interview service stores results locally

---

## API Documentation

### Base URL: `http://localhost:5000/api`

### AUTH MODULE (`/auth`) — Exists ✅
```
POST   /auth/student/register
POST   /auth/student/login
POST   /auth/company/register
POST   /auth/company/login
POST   /auth/admin/login
POST   /auth/superadmin/login
POST   /auth/logout                ← ADD (frontend-only, returns 200)
POST   /auth/student/upload
POST   /auth/company/upload
```

### STUDENT MODULE (`/student`) — Partially Exists ⚠️
```
GET    /student/profile
PUT    /student/profile
GET    /student/resume
DELETE /student/resume
GET    /student/resume/ats-runs    ← ADD
GET    /student/dashboard/stats    ← ADD
GET    /student/applications       ← ADD
GET    /student/saved-jobs         ← ADD
POST   /student/saved-jobs/:jobId  ← ADD
DELETE /student/saved-jobs/:jobId  ← ADD
```

### JOBS MODULE (`/jobs`) — Missing ❌
```
GET    /jobs
GET    /jobs/:id
POST   /jobs
PUT    /jobs/:id
DELETE /jobs/:id
PATCH  /jobs/:id/status
POST   /jobs/:id/apply
GET    /jobs/:id/applications
```

**POST /jobs request body:**
```json
{
  "title": "string",
  "jobDescription": "string",
  "jobType": "FULL_TIME | INTERNSHIP | CONTRACT",
  "jobLocation": "string",
  "salaryRange": "string",
  "requiredSkills": ["string"],
  "noOfSeats": 1
}
```

### APPLICATIONS MODULE (`/applications`) — Missing ❌
```
GET    /applications/:id
PATCH  /applications/:id/status
```

**PATCH /applications/:id/status request body:**
```json
{
  "status": "shortlisted | interview | offered | rejected"
}
```

### COMPANY MODULE (`/company`) — Missing ❌
```
GET    /company/profile
PUT    /company/profile
GET    /company/dashboard/stats
GET    /company/jobs
GET    /company/analytics
```

### ADMIN MODULE (`/admin`) — Missing ❌
```
GET    /admin/dashboard/stats
GET    /admin/companies
PATCH  /admin/companies/:id/verify
GET    /admin/students
GET    /admin/analytics/students
GET    /admin/analytics/companies
GET    /admin/jobs/pending
PATCH  /admin/jobs/:id/approve
DELETE /admin/jobs/:id
GET    /admin/alumni
POST   /admin/announcements
GET    /admin/announcements
PUT    /admin/announcements/:id
DELETE /admin/announcements/:id
POST   /admin/headlines
GET    /admin/headlines
DELETE /admin/headlines/:id
GET    /admin/outreach
POST   /admin/outreach
GET    /admin/reports
POST   /admin/reports/generate
GET    /admin/users
POST   /admin/users
PATCH  /admin/users/:id/permissions
DELETE /admin/users/:id
```

### JOB INTELLIGENCE MODULE — Missing ❌
```
GET    /internal/job-intelligence/latest
GET    /internal/job-intelligence/run/:runId
POST   /internal/job-intelligence/trigger
GET    /job-intelligence/latest
```

### STUDENT MATCHING MODULE — Missing ❌
```
GET    /student-matching/eligible-students?jobId=...
POST   /student-matching/approve
POST   /student-matching/batch
```

---

## External Microservices (already built)

| Service | Env Var | What it Does |
|---|---|---|
| Job Scraper | `VITE_SCRAPER_URL` | Scrapes LinkedIn, Naukri etc. for job listings |
| Orchestrator | `VITE_ORCHESTRATOR_URL` | AI student-job matching pipeline |
| LangGraph | `LANGGRAPH_URL` (backend) | Resume processing after upload, ATS scoring |

---

## Decisions Locked

- Microservices (scraper + orchestrator) are already built — backend will proxy to them
- All three portals built in parallel per module
- Logout is frontend-only (clear localStorage, backend returns 200)

---

## Verification Checklist

- [ ] Run `npx prisma migrate dev` after schema changes
- [ ] Student: register → upload resume → check ATS results → browse jobs → apply → check applications
- [ ] Company: register → post job → view applications → update application status
- [ ] Admin: login → view stats → approve company → approve job → view eligible students
- [ ] Scraper trigger from admin opportunities page works end-to-end
- [ ] Student job-intelligence feed shows scraped jobs
- [ ] All mock data files deleted after real API wiring complete
