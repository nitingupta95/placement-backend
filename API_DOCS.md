# Placement Portal Backend — API Documentation

**Base URL:** `http://localhost:4000/api`

---

## Table of Contents

- [Authentication](#authentication)
  - [Student Register](#post-apiauthstudentregister)
  - [Student Login](#post-apiauthstudentlogin)
  - [Company Register](#post-apiauthcompanyregister)
  - [Company Login](#post-apiauthcompanylogin)
  - [Admin Login](#post-apiauthadminlogin)
  - [Super Admin Login](#post-apiauthsuperadminlogin)
  - [Logout](#post-apiauthlogout)
  - [Upload Resume (Student)](#post-apiauthstudentupload)
  - [Upload File (Company)](#post-apiauthcompanyupload)
- [RBAC Test Routes](#rbac-test-routes)
- [Student](#student)
  - [Get Profile](#get-apistudentprofile)
  - [Update Profile](#put-apistudentprofile)
  - [Get Resume](#get-apistudentresume)
  - [Delete Resume](#delete-apistudentresume)
  - [Get Student Details](#get-apistudentdetails)
  - [Get Resume ATS Runs](#get-apistudentresumeats-runs)
- [Job Intelligence (Public / Student-facing)](#job-intelligence-public)
  - [Get Latest Jobs for Student](#get-apijob-intelligencelatest)
- [Student Matching (Public / Admin-facing)](#student-matching-public)
  - [Get Eligible Students for Job](#get-apistudent-matchingeligible-students)
  - [Approve Student for Job](#post-apistudent-matchingapprove)
- [Internal Endpoints](#internal-endpoints)
  - [List Students (Internal)](#get-apiinternalstudents)
  - [Get Student Profile by ID (Internal)](#get-apiinternalstudentsstudentidprofile)
  - [Bulk Create Jobs (Internal)](#post-apiinternaljob-intelligencebulk)
  - [Get Latest Job Run (Internal)](#get-apiinternaljob-intelligencelatest)
  - [Get Jobs by Run ID (Internal)](#get-apiinternaljob-intelligencerunrunid)
  - [Get Open Job Postings (Internal)](#get-apiinternaljob-postingsopen)
  - [Create ATS Report (Internal)](#post-apiinternalats-reports)
  - [Create Student Match Run (Internal)](#post-apiinternalstudent-matchingruns)

---

## Auth Headers

| Type | Header | Format |
|---|---|---|
| JWT (user-facing) | `Authorization` | `Bearer <jwt_token>` |
| Internal token (service-to-service) | `Authorization` | `Bearer <BACKEND_INTERNAL_TOKEN>` |

---

## Authentication

### `POST /api/auth/student/register`

Register a new student account.

**Auth:** None

**Request Body:**

```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "phone": "string (optional)",
  "rollNo": "string (optional)",
  "collegeId": "number (optional)",
  "graduationYear": "number (optional)",
  "skills": ["string"] ,
  "portfolioUrl": "string (optional, valid URL or empty)",
  "linkedinUrl": "string (optional, valid URL or empty)",
  "activeBacklogs": "boolean (optional)"
}
```

**Response `201`:**

```json
{
  "success": true,
  "student": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": null,
    "rollNo": null,
    "collegeId": null,
    "portfolioUrl": null,
    "aadharNumber": null,
    "graduationYear": null,
    "resumeUrl": null,
    "profilePitch": null,
    "linkedinUrl": null,
    "skills": [],
    "isPlaced": false,
    "activeBacklogs": false,
    "isActive": true,
    "createdAt": "2026-02-19T00:00:00.000Z",
    "legalDocType": null,
    "legalDocUrl": null,
    "superAdminId": null
  },
  "token": "<jwt_token>"
}
```

**Error `400`:**

```json
{
  "success": false,
  "message": "Student already exists"
}
```

---

### `POST /api/auth/student/login`

Login as a student.

**Auth:** None

**Request Body:**

```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}
```

**Response `200`:**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": null,
    "rollNo": null,
    "collegeId": null,
    "portfolioUrl": null,
    "graduationYear": null,
    "resumeUrl": null,
    "linkedinUrl": null,
    "skills": [],
    "isPlaced": false,
    "activeBacklogs": false,
    "isActive": true,
    "createdAt": "2026-02-19T00:00:00.000Z"
  },
  "token": "<jwt_token>"
}
```

**Error `400`:**

```json
{
  "success": false,
  "message": "User not found | Invalid credentials"
}
```

---

### `POST /api/auth/company/register`

Register a new company account.

**Auth:** None

**Request Body:**

```json
{
  "companyName": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "websiteUrl": "string (optional)"
}
```

**Response `201`:**

```json
{
  "success": true,
  "company": {
    "id": 1,
    "companyName": "Acme Corp",
    "email": "hr@acme.com",
    "websiteUrl": null,
    "logoUrl": null,
    "description": null,
    "industry": null,
    "location": null,
    "createdAt": "2026-02-19T00:00:00.000Z",
    "superAdminId": null
  },
  "token": "<jwt_token>"
}
```

**Error `400`:**

```json
{
  "success": false,
  "message": "Company already exists"
}
```

---

### `POST /api/auth/company/login`

Login as a company.

**Auth:** None

**Request Body:**

```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}
```

**Response `200`:**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "companyName": "Acme Corp",
    "email": "hr@acme.com",
    "websiteUrl": null,
    "logoUrl": null,
    "description": null,
    "industry": null,
    "location": null,
    "createdAt": "2026-02-19T00:00:00.000Z"
  },
  "token": "<jwt_token>"
}
```

**Error `400`:**

```json
{
  "success": false,
  "message": "User not found | Invalid credentials"
}
```

---

### `POST /api/auth/admin/login`

Login as a college admin.

**Auth:** None

**Request Body:**

```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}
```

**Response `200`:**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "collegeId": "CLG001",
    "name": "Admin Name",
    "email": "admin@college.edu",
    "university": "Some University",
    "address": null,
    "websiteUrl": null,
    "logoUrl": null,
    "verificationStatus": null,
    "createdAt": "2026-02-19T00:00:00.000Z"
  },
  "token": "<jwt_token>"
}
```

**Error `400`:**

```json
{
  "success": false,
  "message": "User not found | Invalid credentials"
}
```

---

### `POST /api/auth/superadmin/login`

Login as a super admin.

**Auth:** None

**Request Body:**

```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}
```

**Response `200`:**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "firstName": "Super",
    "lastName": "Admin",
    "email": "superadmin@portal.com",
    "phone": null,
    "role": "SUPERADMIN",
    "createdAt": "2026-02-19T00:00:00.000Z"
  },
  "token": "<jwt_token>"
}
```

**Error `400`:**

```json
{
  "success": false,
  "message": "User not found | Invalid credentials"
}
```

---

### `POST /api/auth/logout`

Logout the current user (client-side token cleanup).

**Auth:** `Bearer <jwt_token>`

**Request Body:** None

**Response `200`:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### `POST /api/auth/student/upload`

Upload a resume file for the authenticated student. Supports PDF and image files. After upload, triggers an async LangGraph resume-processing pipeline.

**Auth:** `Bearer <jwt_token>` (Role: STUDENT)

**Request:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | File | Resume file (PDF or image, max 5 MB) |

**Response `200`:**

```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "resume": {
    "fileName": "resume.pdf",
    "fileUrl": "https://res.cloudinary.com/…/resume.pdf",
    "fileSize": 204800,
    "uploadedAt": "2026-02-19T12:00:00.000Z"
  }
}
```

**Error `400`:**

```json
{
  "success": false,
  "message": "No file uploaded"
}
```

---

### `POST /api/auth/company/upload`

Upload a file (logo / document) for the authenticated company. Same behaviour as the student upload endpoint but scoped to COMPANY role.

**Auth:** `Bearer <jwt_token>` (Role: COMPANY)

**Request:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | File | File (PDF or image, max 5 MB) |

**Response `200`:**

```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "resume": {
    "fileName": "logo.png",
    "fileUrl": "https://res.cloudinary.com/…/logo.png",
    "fileSize": 102400,
    "uploadedAt": "2026-02-19T12:00:00.000Z"
  }
}
```

---

## RBAC Test Routes

These endpoints verify that role-based access control is working correctly.

### `GET /api/auth/test/student`

**Auth:** `Bearer <jwt_token>` (Role: STUDENT, ADMIN, SUPERADMIN)

**Response `200`:**

```json
{
  "success": true,
  "message": "✅ Student endpoint accessed successfully",
  "user": { "id": 1, "role": "STUDENT", "iat": 1234567890, "exp": 1235172690 },
  "accessibleBy": ["STUDENT", "ADMIN", "SUPERADMIN"]
}
```

### `GET /api/auth/test/company`

**Auth:** `Bearer <jwt_token>` (Role: COMPANY, ADMIN, SUPERADMIN)

**Response `200`:** Same structure as above, with `"message": "✅ Company endpoint accessed successfully"`.

### `GET /api/auth/test/admin`

**Auth:** `Bearer <jwt_token>` (Role: ADMIN, SUPERADMIN)

**Response `200`:** Same structure, with `"message": "✅ Admin endpoint accessed successfully"`.

### `GET /api/auth/test/superadmin`

**Auth:** `Bearer <jwt_token>` (Role: SUPERADMIN)

**Response `200`:** Same structure, with `"message": "✅ SuperAdmin endpoint accessed successfully"`.

---

## Student

> All student routes require JWT authentication with the **STUDENT** role.

### `GET /api/student/profile`

Get the authenticated student's profile (password excluded).

**Auth:** `Bearer <jwt_token>` (Role: STUDENT)

**Response `200`:**

```json
{
  "success": true,
  "student": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": null,
    "rollNo": null,
    "collegeId": null,
    "portfolioUrl": null,
    "aadharNumber": null,
    "graduationYear": null,
    "resumeUrl": "https://…",
    "profilePitch": null,
    "linkedinUrl": null,
    "skills": ["Python", "React"],
    "isPlaced": false,
    "activeBacklogs": false,
    "isActive": true,
    "createdAt": "2026-02-19T00:00:00.000Z",
    "legalDocType": null,
    "legalDocUrl": null,
    "superAdminId": null
  }
}
```

---

### `PUT /api/student/profile`

Update the authenticated student's profile.

**Auth:** `Bearer <jwt_token>` (Role: STUDENT)

**Request Body (all fields optional):**

```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "rollNo": "string",
  "graduationYear": 2026,
  "skills": ["Python", "React"],
  "portfolioUrl": "https://portfolio.dev",
  "linkedinUrl": "https://linkedin.com/in/john",
  "activeBacklogs": false
}
```

**Response `200`:**

```json
{
  "success": true,
  "student": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "...": "... (all student fields minus password)"
  }
}
```

---

### `GET /api/student/resume`

Get the authenticated student's resume info.

**Auth:** `Bearer <jwt_token>` (Role: STUDENT)

**Response `200` (resume exists):**

```json
{
  "success": true,
  "resume": {
    "id": "1",
    "studentId": "1",
    "fileName": "resume.pdf",
    "fileUrl": "https://res.cloudinary.com/…/resume.pdf",
    "fileSize": 0,
    "uploadedAt": "2026-02-19T00:00:00.000Z",
    "updatedAt": "2026-02-19T00:00:00.000Z"
  }
}
```

**Response `200` (no resume):**

```json
{
  "success": true,
  "resume": null
}
```

---

### `DELETE /api/student/resume`

Delete the authenticated student's resume (sets `resumeUrl` to `null`).

**Auth:** `Bearer <jwt_token>` (Role: STUDENT)

**Response `200`:**

```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

### `GET /api/student/details`

Get the authenticated student's full details including college info and ATS run summaries.

**Auth:** `Bearer <jwt_token>` (Role: STUDENT)

**Response `200`:**

```json
{
  "success": true,
  "student": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": null,
    "rollNo": null,
    "collegeId": 1,
    "portfolioUrl": null,
    "aadharNumber": null,
    "graduationYear": 2026,
    "resumeUrl": "https://…",
    "profilePitch": null,
    "linkedinUrl": null,
    "skills": ["Python"],
    "isPlaced": false,
    "activeBacklogs": false,
    "isActive": true,
    "createdAt": "2026-02-19T00:00:00.000Z",
    "legalDocType": null,
    "legalDocUrl": null,
    "superAdminId": null,
    "college": {
      "id": 1,
      "name": "ABC Engineering College"
    },
    "atsRuns": [
      {
        "id": 1,
        "createdAt": "2026-02-19T00:00:00.000Z",
        "overallScore": 82.5
      }
    ]
  }
}
```

---

### `GET /api/student/resume/ats-runs`

Get all ATS analysis runs for the authenticated student's resume.

**Auth:** `Bearer <jwt_token>` (Role: STUDENT)

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "resumeUrl": "https://…/resume.pdf",
      "resumeId": null,
      "overallScore": 82.5,
      "summary": "Strong resume with good technical depth…",
      "strengths": ["Clear project descriptions", "Relevant skills"],
      "weaknesses": ["Missing quantified achievements"],
      "recommendations": ["Add metrics to project outcomes"],
      "keywordMatch": { "matched": 12, "total": 15 },
      "modelUsed": "gpt-4o",
      "success": true,
      "error": null,
      "createdAt": "2026-02-19T00:00:00.000Z"
    }
  ]
}
```

---

## Job Intelligence (Public)

### `GET /api/job-intelligence/latest`

Get the latest job intelligence run results for the authenticated student. The `applyLink` is hidden for jobs the student has **not** been approved for.

**Auth:** `Bearer <jwt_token>` (Role: STUDENT)

**Query Parameters:** None

**Response `200`:**

```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Backend Developer",
      "companyName": "Acme Corp",
      "location": "Remote",
      "jobType": "Full-time",
      "source": "linkedin",
      "applyLink": null,
      "finalScore": 0.92,
      "scoreBreakdown": { "relevance": 0.9, "freshness": 0.95 },
      "description": "We are looking for…",
      "runId": 1,
      "createdAt": "2026-02-19T00:00:00.000Z",
      "approved": false,
      "approvedAt": null
    }
  ],
  "runId": 1,
  "runCreatedAt": "2026-02-19T00:00:00.000Z",
  "totalJobs": 15
}
```

**Response `404`:**

```json
{
  "error": "No job intelligence runs found",
  "jobs": []
}
```

---

## Student Matching (Public)

### `GET /api/student-matching/eligible-students`

Get students that matched a specific job, with optional filtering.

**Auth:** `Bearer <jwt_token>` (Role: ADMIN, SUPERADMIN)

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `jobId` | number | *required* | The job ID to look up |
| `jobSource` | string | `"job_intelligence"` | `"job_intelligence"` or `"job_posting"` |
| `limit` | number | `200` | Max students to return (capped at 500) |
| `maxScore` | number | — | Filter matches ≤ this score |
| `approvedOnly` | boolean | `false` | Only return already-approved students |

**Response `200`:**

```json
{
  "success": true,
  "jobSource": "job_intelligence",
  "jobId": 1,
  "job": {
    "sourceType": "job_intelligence",
    "id": 1,
    "title": "Backend Developer",
    "companyName": "Acme Corp",
    "jobType": "Full-time",
    "location": "Remote",
    "source": "linkedin",
    "createdAt": "2026-02-19T00:00:00.000Z",
    "finalScore": 0.92,
    "applyLink": "https://…"
  },
  "total": 2,
  "matches": [
    {
      "student": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "name": "John Doe",
        "email": "john@example.com",
        "skills": ["Python", "React"],
        "isActive": true,
        "isPlaced": false,
        "resumeUrl": "https://…",
        "linkedinUrl": null,
        "portfolioUrl": null
      },
      "match": {
        "id": 10,
        "runId": 5,
        "matchScore": 0.88,
        "skillMatchScore": 75,
        "atsScore": 82.5,
        "matchedSkills": ["Python", "SQL"],
        "missingSkills": ["Kubernetes"],
        "reasoning": {},
        "createdAt": "2026-02-19T00:00:00.000Z",
        "approved": true,
        "approvedAt": "2026-02-19T12:00:00.000Z"
      }
    }
  ]
}
```

---

### `POST /api/student-matching/approve`

Approve a student for a specific job (idempotent upsert).

**Auth:** `Bearer <jwt_token>` (Role: ADMIN, SUPERADMIN)

**Request Body:**

```json
{
  "jobSource": "job_intelligence",
  "jobId": 1,
  "studentId": 1
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `jobSource` | string | `"job_intelligence"` | `"job_intelligence"` or `"job_posting"` |
| `jobId` | number | *required* | The job ID |
| `studentId` | number | *required* | The student ID |

**Response `200`:**

```json
{
  "success": true,
  "approval": {
    "id": 1,
    "studentId": 1,
    "jobSource": "job_intelligence",
    "jobId": 1,
    "approvedAt": "2026-02-19T12:00:00.000Z"
  }
}
```

**Error `400`:**

```json
{
  "success": false,
  "error": "Missing/invalid jobId or studentId"
}
```

---

## Internal Endpoints

> All internal endpoints authenticate using the `BACKEND_INTERNAL_TOKEN` (service-to-service).  
> Header: `Authorization: Bearer <BACKEND_INTERNAL_TOKEN>`

---

### `GET /api/internal/students`

List students (used by the orchestrator for batch matching).

**Auth:** Internal Token

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `limit` | number | `500` | Max students to return (capped at 2000) |
| `isActive` | string | — | Filter by `true` / `false` |

**Response `200`:**

```json
{
  "students": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isActive": true,
      "isPlaced": false,
      "activeBacklogs": false,
      "skills": ["Python", "React"]
    }
  ],
  "count": 1
}
```

---

### `GET /api/internal/students/:studentId/profile`

Get a student's full profile by ID (used internally).

**Auth:** Internal Token

**Path Parameters:**

| Param | Type | Description |
|---|---|---|
| `studentId` | number | The student's ID |

**Response `200`:**

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": null,
  "rollNo": null,
  "collegeId": 1,
  "portfolioUrl": null,
  "graduationYear": 2026,
  "resumeUrl": "https://…",
  "linkedinUrl": null,
  "skills": ["Python"],
  "isPlaced": false,
  "activeBacklogs": false,
  "isActive": true,
  "createdAt": "2026-02-19T00:00:00.000Z",
  "college": {
    "id": 1,
    "name": "ABC Engineering College"
  },
  "atsRuns": [
    {
      "id": 1,
      "createdAt": "2026-02-19T00:00:00.000Z",
      "overallScore": 82.5
    }
  ]
}
```

**Error `404`:**

```json
{
  "success": false,
  "error": "Student not found"
}
```

---

### `POST /api/internal/job-intelligence/bulk`

Bulk-create job intelligence records from an external market scan.

**Auth:** Internal Token

**Request Body:**

```json
{
  "jobs": [
    {
      "title": "string (required)",
      "company": "string (required)",
      "apply_link": "string (required)",
      "source": "string (required)",
      "final_score": 0.92,
      "score_breakdown": {},
      "description": "string (optional)",
      "skills": ["string"],
      "experience_range": "string (optional)",
      "job_type": "string (optional)",
      "location": "string (optional)",
      "min_salary": 50000,
      "max_salary": 80000,
      "currency": "USD",
      "company_rating": 4.2,
      "reviews_count": 150,
      "why_selected": "string (optional)",
      "job_id": "string (optional)"
    }
  ]
}
```

**Response `200`:**

```json
{
  "saved": 15,
  "run_id": 1,
  "jobs": [
    {
      "id": 1,
      "title": "Backend Developer",
      "companyName": "Acme Corp",
      "location": "Remote",
      "jobType": "Full-time",
      "source": "linkedin",
      "applyLink": "https://…",
      "finalScore": 0.92,
      "scoreBreakdown": {},
      "description": "…",
      "skills": ["Python"],
      "runId": 1,
      "createdAt": "2026-02-19T00:00:00.000Z"
    }
  ]
}
```

**Error `400`:**

```json
{
  "error": "Invalid or empty jobs array"
}
```

---

### `GET /api/internal/job-intelligence/latest`

Get the most recent job intelligence run and its jobs.

**Auth:** Internal Token

**Response `200`:**

```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Backend Developer",
      "companyName": "Acme Corp",
      "location": "Remote",
      "jobType": "Full-time",
      "source": "linkedin",
      "applyLink": "https://…",
      "finalScore": 0.92,
      "scoreBreakdown": {},
      "description": "…",
      "skills": ["Python"],
      "runId": 1,
      "createdAt": "2026-02-19T00:00:00.000Z"
    }
  ],
  "runId": 1,
  "runCreatedAt": "2026-02-19T00:00:00.000Z",
  "totalJobs": 15
}
```

**Response `404`:**

```json
{
  "error": "No job intelligence runs found",
  "jobs": []
}
```

---

### `GET /api/internal/job-intelligence/run/:runId`

Get all jobs for a specific job intelligence run.

**Auth:** Internal Token

**Path Parameters:**

| Param | Type | Description |
|---|---|---|
| `runId` | number | The run ID |

**Response `200`:**

```json
{
  "jobs": [ "..." ],
  "runId": 1,
  "runCreatedAt": "2026-02-19T00:00:00.000Z",
  "totalJobs": 15,
  "runType": "EXTERNAL_MARKET_SCAN"
}
```

**Error `400`:**

```json
{
  "error": "Invalid run ID"
}
```

**Error `404`:**

```json
{
  "error": "Run not found"
}
```

---

### `GET /api/internal/job-postings/open`

Get all open job postings (from the company-posted jobs table).

**Auth:** Internal Token

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `limit` | number | `200` | Max results (capped at 500) |

**Response `200`:**

```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Frontend Developer",
      "jobDescription": "Build UIs…",
      "jobType": "Full-time",
      "jobLocation": "Bangalore",
      "salaryRange": "8-12 LPA",
      "requiredSkills": ["React", "TypeScript"],
      "status": "open",
      "postedOn": "2026-02-19T00:00:00.000Z",
      "companyId": 1,
      "noOfSeats": 5,
      "company": {
        "id": 1,
        "companyName": "Acme Corp",
        "location": "Bangalore",
        "industry": "IT",
        "websiteUrl": "https://acme.com",
        "logoUrl": null
      }
    }
  ],
  "count": 1
}
```

---

### `POST /api/internal/ats-reports`

Persist an ATS (Applicant Tracking System) resume analysis report from the AI pipeline.

**Auth:** Internal Token

**Request Body (snake_case — sent by Python service):**

```json
{
  "student_id": 1,
  "resume_id": null,
  "resume_url": "https://res.cloudinary.com/…/resume.pdf",
  "ats_report": {
    "ats_score": 82.5,
    "score_breakdown": { "format": 90, "keywords": 75 },
    "summary_feedback": "Strong resume with good technical depth…",
    "strengths": ["Clear project descriptions"],
    "improvements": ["Add quantified achievements"],
    "recommendations": ["Include metrics in project outcomes"],
    "keyword_match": { "matched": 12, "total": 15 },
    "model_used": "gpt-4o",
    "success": true,
    "error": null
  }
}
```

**Response `200`:**

```json
{
  "ats_run_id": 1,
  "success": true
}
```

**Error `400`:**

```json
{
  "error": "Missing required fields: student_id and ats_report"
}
```

**Error `404`:**

```json
{
  "error": "Student not found"
}
```

---

### `POST /api/internal/student-matching/runs`

Create a student-job match run with match results (from the AI matching pipeline).

**Auth:** Internal Token

**Request Body (snake_case — sent by Python service):**

```json
{
  "student_id": 1,
  "job_intelligence_run_id": 1,
  "top_k": 5,
  "jobs_considered": 20,
  "student_ats_score": 82.5,
  "matches": [
    {
      "jobId": 1,
      "jobSource": "job_intelligence",
      "score": 0.88,
      "reasoning": { "summary": "Strong skills match" },
      "skill": {
        "score": 75,
        "matched": ["Python", "SQL"],
        "missing": ["Kubernetes"]
      }
    }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `student_id` | number | yes | Student's ID |
| `job_intelligence_run_id` | number | no | Linked run ID |
| `top_k` | number | no | Defaults to match count |
| `jobs_considered` | number | no | Defaults to match count |
| `student_ats_score` | number | no | Student's latest ATS score |
| `matches` | array | yes | Array of match items |
| `matches[].jobId` | number | yes | Job ID (intelligence or posting) |
| `matches[].jobSource` | string | no | `"job_intelligence"` (default) or `"job_posting"` |
| `matches[].score` | number | yes | Overall match score |
| `matches[].reasoning` | object | no | AI reasoning payload |
| `matches[].skill.score` | number | no | Skill match score |
| `matches[].skill.matched` | string[] | no | Matched skills |
| `matches[].skill.missing` | string[] | no | Missing skills |

**Response `200`:**

```json
{
  "success": true,
  "match_run_id": 1,
  "saved_matches": 5
}
```

**Error `400`:**

```json
{
  "error": "Missing required field: student_id"
}
```

**Error `404`:**

```json
{
  "error": "Student not found"
}
```

---

## Error Responses (Global)

All endpoints may return these common error shapes:

**`401 Unauthorized` (missing / invalid JWT):**

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**`401 Unauthorized` (expired JWT):**

```json
{
  "success": false,
  "message": "Token expired."
}
```

**`403 Forbidden` (insufficient role):**

```json
{
  "success": false,
  "message": "Access forbidden. Insufficient permissions.",
  "requiredRoles": ["ADMIN"],
  "userRole": "STUDENT"
}
```

**`404 Not Found` (route does not exist):**

```json
{
  "message": "Not Found"
}
```

**`500 Internal Server Error`:**

```json
{
  "message": "Internal Server Error"
}
```

---

## JWT Token Payload

```json
{
  "id": 1,
  "role": "STUDENT | COMPANY | ADMIN | SUPERADMIN",
  "iat": 1234567890,
  "exp": 1235172690
}
```

Token expires in **7 days**.

---

## Role Hierarchy

| Role | Can Access |
|---|---|
| **SUPERADMIN** | All routes |
| **ADMIN** | ADMIN, COMPANY, STUDENT routes |
| **COMPANY** | COMPANY routes only |
| **STUDENT** | STUDENT routes only |
