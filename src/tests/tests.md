src/
└── tests/
    ├── unit/
    │   ├── student.service.test.ts      # unit test for business logic (mock repo)
    │   ├── company.service.test.ts
    │   ├── auth.service.test.ts
    │   ├── job.service.test.ts
    │   └── utils/
    │       └── pagination.test.ts
    ├── integration/
    │   ├── student.repository.test.ts   # tests DB layer (uses test DB)
    │   ├── company.repository.test.ts
    │   └── job.repository.test.ts
    ├── e2e/
    │   ├── auth.routes.test.ts          # full API endpoint test via supertest
    │   ├── student.routes.test.ts
    │   ├── company.routes.test.ts
    │   ├── job.routes.test.ts
    │   └── superAdmin.routes.test.ts
    └── setup/
        ├── testEnv.ts                   # loads test env vars
        ├── testServer.ts                # starts express app for testing
        ├── mockData.ts                  # mock data for tests
        └── teardown.ts                  # cleans up DB after tests
