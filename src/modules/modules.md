src/
└── modules/
    ├── auth/
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.repository.ts
    │   ├── auth.routes.ts
    │   ├── dto/
    │   │   ├── login.dto.ts
    │   │   ├── register.dto.ts
    │   │   └── resetPassword.dto.ts
    │   ├── strategies/
    │   │   ├── jwt.strategy.ts
    │   │   ├── google.strategy.ts
    │   │   └── clerk.strategy.ts
    │   └── types/
    │       └── auth.types.ts
    │
    ├── student/
    │   ├── student.controller.ts
    │   ├── student.service.ts
    │   ├── student.repository.ts
    │   ├── student.routes.ts
    │   ├── dto/
    │   │   ├── createStudent.dto.ts
    │   │   ├── updateStudent.dto.ts
    │   │   └── applyJob.dto.ts
    │   └── types/
    │       └── student.types.ts
    │
    ├── company/
    │   ├── company.controller.ts
    │   ├── company.service.ts
    │   ├── company.repository.ts
    │   ├── company.routes.ts
    │   ├── dto/
    │   │   ├── createCompany.dto.ts
    │   │   ├── updateCompany.dto.ts
    │   │   └── postJob.dto.ts
    │   └── types/
    │       └── company.types.ts
    │
    ├── collegeAdmin/
    │   ├── collegeAdmin.controller.ts
    │   ├── collegeAdmin.service.ts
    │   ├── collegeAdmin.repository.ts
    │   ├── collegeAdmin.routes.ts
    │   ├── dto/
    │   │   ├── createCollege.dto.ts
    │   │   └── verifyCollege.dto.ts
    │   └── types/
    │       └── collegeAdmin.types.ts
    │
    ├── superAdmin/
    │   ├── superAdmin.controller.ts
    │   ├── superAdmin.service.ts
    │   ├── superAdmin.repository.ts
    │   ├── superAdmin.routes.ts
    │   ├── dto/
    │   │   ├── createSuperAdmin.dto.ts
    │   │   ├── managePermissions.dto.ts
    │   │   └── statsQuery.dto.ts
    │   └── types/
    │       └── superAdmin.types.ts
    │
    ├── jobs/
    │   ├── jobPosting.controller.ts
    │   ├── jobPosting.service.ts
    │   ├── jobPosting.repository.ts
    │   ├── jobPosting.routes.ts
    │   ├── jobApplication.controller.ts
    │   ├── jobApplication.service.ts
    │   ├── jobApplication.repository.ts
    │   ├── jobApplication.routes.ts
    │   ├── dto/
    │   │   ├── createJob.dto.ts
    │   │   ├── updateJob.dto.ts
    │   │   └── applyJob.dto.ts
    │   └── types/
    │       └── job.types.ts
    │
    └── shared/
        ├── base.repository.ts         # reusable DB helpers (pagination, filters)
        ├── base.service.ts            # generic CRUD logic
        ├── constants.ts               # app-wide constants
        ├── helpers.ts                 # formatting, parsing, date utils
        ├── responses.ts               # standardized API responses
        └── validators.ts              # reusable zod/joi schemas



modules/notifications/
├── notification.service.ts
├── notification.repository.ts
├── notification.controller.ts
├── notification.routes.ts
└── templates/
    ├── jobApplied.html
    ├── verificationPending.html
    └── weeklySummary.html
