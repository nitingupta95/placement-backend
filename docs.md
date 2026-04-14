
# Placement Portal - Project Documentation

## 1. Project Overview

The **Placement Portal** is a comprehensive web application designed to streamline the campus placement process. It acts as a centralized platform connecting **Students**, **Companies**, and **University Administrators**.

### Tech Stack

*   **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **UI Library**: [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Feature stores) & React Context (Global Auth)
*   **Networking**: [Axios](https://axios-http.com/) with Interceptors
*   **Validation**: [Zod](https://zod.dev/)
*   **Routing**: [React Router v7](https://reactrouter.com/)

## 2. System Architecture

The frontend interacts with a microservices-based backend ecosystem:

1.  **Main Backend (`:4000`)**: Handles user authentication, profile management, and core business logic.
2.  **Scraper Service (`:8000`)**: A Python-based service for scraping job listings from external sources.
3.  **Orchestrator (`:8001`)**: Manages complex workflows like "Batch Student Matching" and "Job Intelligence" processing.

### Data Flow
- **Authentication**: JWT-based. Tokens are stored in `localStorage` and injected into every API request via an Axios interceptor (`src/services/api.ts`).
- **State**: User session is managed via `AuthContext`. Complex UI state (like dashboard filters or wizard steps) is managed using `Zustand` stores.

## 3. Project Structure

The project follows a **Feature-First Architecture** in `src/features`, creating clear boundaries between different parts of the app.

```
src/
├── components/          # Shared UI components
│   ├── layout/          # Navbar, Footer, MainLayout
│   ├── ui/              # Shadcn primitive components (Button, Input, Dialog, etc.)
│   └── ProtectedRoute.tsx # Route guard component
├── contexts/            # Global React Contexts (AuthContext)
├── features/            # Feature-specific logic & UI
│   ├── auth/            # Login/Signup pages & components
│   ├── dashboard/       # Main Dashboard logic
│   │   ├── adminDashboard/   # Admin-specific pages & stores
│   │   ├── companyDashboard/ # Company-specific pages & stores
│   │   ├── studentDashboard/ # Student-specific pages & stores
│   │   └── pages/       # Shared dashboard container pages
│   └── landing/         # Public landing page
├── hooks/               # Custom hooks (useAuth, etc.)
├── services/            # API client definitions
│   ├── api.ts                  # Axios instance
│   ├── authService.ts          # Login/Register endpoints
│   ├── jobIntelligenceService.ts # Job scraping/fetching
│   └── studentMatchingService.ts # Matching algorithm endpoints
└── App.tsx              # Main routing configuration
```

## 4. Key Features

### Authentication & Authorization
- **Role-Based Access Control (RBAC)**: Supports `STUDENT`, `COMPANY`, `ADMIN`, `SUPERADMIN`.
- **Protected Routes**: Middleware-like component prevents unauthorized access to dashboard routes.
- **Auto-Logout**: Automatically logs users out on token expiry (401 response).

### Student Dashboard
- **Profile Management**: View and edit basic details.
- **Job Board**: View "Job Intelligence" (scraped) and "Direct" (posted) jobs.
- **Resume & ATS**: (Planned) Resume upload and ATS score analysis.
- **Applications**: Track status of applied jobs.

### Admin Dashboard
- **User Management**: View, approve, or ban students and companies.
- **Job Intelligence Control**: Trigger scraper runs manually.
- **Placement Analytics**: Visualize placement stats (Planned).

### Job Intelligence
- **Scraping**: Integrates with external scraper to pull fresh jobs.
- **Matching**: Uses an orchestrator service to match students to jobs based on skills and resume content.

## 5. Setup & Development

### Prerequisites
- Node.js (v18+)
- Backend services running (see `AUTH_SETUP.md` for ports)

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file in the root:
```env
VITE_API_URL=http://localhost:4000/api
VITE_SCRAPER_URL=http://localhost:8000
VITE_ORCHESTRATOR_URL=http://localhost:8001
VITE_BACKEND_INTERNAL_TOKEN=your_internal_token
```

### Running the App
```bash
npm run dev
```
Access the app at `http://localhost:5173`.

## 6. API & Integration
For a detailed list of implemented and planned API endpoints, refer to [API_REQUIREMENTS.md](./API_REQUIREMENTS.md).
For proposed architectural improvements, refer to [ENHANCEMENTS.md](./ENHANCEMENTS.md).
