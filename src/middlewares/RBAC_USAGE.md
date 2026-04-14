# Role-Based Access Control (RBAC) Middleware

## Overview

This system provides middleware functions for securing routes across two files:

### `auth.middleware.ts`

- `verifyToken` - Verifies JWT token and authenticates the user

### `role.middleware.ts`

- `allowedRoles` - Checks if authenticated user has required role(s) with hierarchical permissions
- Helper functions: `isStudent`, `isCompany`, `isAdmin`, `isSuperAdmin`

## Available Roles (Hierarchical)

- `SUPERADMIN` - Can access **ALL** routes (SUPERADMIN + ADMIN + COMPANY + STUDENT)
- `ADMIN` - Can access ADMIN, COMPANY, and STUDENT routes
- `COMPANY` - Can only access COMPANY routes
- `STUDENT` - Can only access STUDENT routes

### Role Hierarchy

```
SUPERADMIN (highest)
    ├── Can access: SUPERADMIN, ADMIN, COMPANY, STUDENT routes
    │
ADMIN
    ├── Can access: ADMIN, COMPANY, STUDENT routes
    │
COMPANY
    ├── Can access: COMPANY routes only
    │
STUDENT (lowest)
    └── Can access: STUDENT routes only
```

## Usage Examples

### Basic Usage

```typescript
import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware";
import { allowedRoles } from "../../middlewares/role.middleware";

const router = Router();

// Only authenticated users (any role)
router.get("/profile", verifyToken, profileController);

// Only ADMIN (and SUPERADMIN via hierarchy) can access
router.get(
  "/admin-dashboard",
  verifyToken,
  allowedRoles(["ADMIN"]), // SUPERADMIN automatically has access
  adminDashboardController
);

// COMPANY and ADMIN can access (SUPERADMIN via hierarchy)
router.post(
  "/post-job",
  verifyToken,
  allowedRoles(["COMPANY"]), // ADMIN and SUPERADMIN automatically have access
  postJobController
);

// STUDENT and ADMIN can access (SUPERADMIN via hierarchy)
router.post(
  "/apply-job",
  verifyToken,
  allowedRoles(["STUDENT"]), // ADMIN and SUPERADMIN automatically have access
  applyJobController
);
```

### Using Helper Middlewares

```typescript
import { verifyToken } from "../../middlewares/auth.middleware";
import {
  isStudent,
  isCompany,
  isAdmin,
  isSuperAdmin,
} from "../../middlewares/role.middleware";

const router = Router();

// Student routes - STUDENT, ADMIN, and SUPERADMIN can access
router.get("/student/profile", verifyToken, isStudent, getStudentProfile);
router.put("/student/profile", verifyToken, isStudent, updateStudentProfile);

// Company routes - COMPANY, ADMIN, and SUPERADMIN can access
router.post("/company/job", verifyToken, isCompany, postJob);
router.get("/company/applications", verifyToken, isCompany, getApplications);

// Admin routes - ADMIN and SUPERADMIN can access
router.get("/admin/colleges", verifyToken, isAdmin, getColleges);
router.post("/admin/verify", verifyToken, isAdmin, verifyCollege);

// SuperAdmin only routes - Only SUPERADMIN can access
router.delete("/superadmin/user/:id", verifyToken, isSuperAdmin, deleteUser);
router.post("/superadmin/config", verifyToken, isSuperAdmin, updateConfig);
```

### Complete Route Example

```typescript
// src/modules/student/student.routes.ts
import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware";
import {
  isStudent,
  isAdmin,
  allowedRoles,
} from "../../middlewares/role.middleware";
import * as studentController from "./student.controller";

const router = Router();

// Public route (no authentication needed)
router.get("/public/colleges", studentController.listColleges);

// Student routes - STUDENT, ADMIN, and SUPERADMIN can access
router.get("/profile", verifyToken, isStudent, studentController.getProfile);
router.put("/profile", verifyToken, isStudent, studentController.updateProfile);
router.post(
  "/apply/:jobId",
  verifyToken,
  isStudent,
  studentController.applyJob
);
router.get(
  "/applications",
  verifyToken,
  isStudent,
  studentController.getMyApplications
);

// Admin routes - ADMIN and SUPERADMIN can access
router.get("/all", verifyToken, isAdmin, studentController.getAllStudents);
router.put("/:id", verifyToken, isAdmin, studentController.updateStudentById);

// Company routes (with hierarchy) - COMPANY, ADMIN, and SUPERADMIN can access
router.get(
  "/statistics",
  verifyToken,
  allowedRoles(["COMPANY"]), // ADMIN and SUPERADMIN can also access
  studentController.getStatistics
);

export default router;
```

### Accessing User Data in Controllers

After the `verifyToken` middleware runs, you can access user data from `req.user`:

```typescript
// src/modules/student/student.controller.ts
import { Request, Response } from "express";

export const getProfile = async (req: Request, res: Response) => {
  try {
    // Access authenticated user's data
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const userRole = req.user?.role;

    // Use the user data
    const profile = await studentService.getProfileById(userId);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};
```

## JWT Token Format

When making requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success (Authenticated & Authorized)

```json
{
  "success": true,
  "data": {...}
}
```

### Error: No Token

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Error: Invalid Token

```json
{
  "success": false,
  "message": "Invalid token."
}
```

### Error: Token Expired

```json
{
  "success": false,
  "message": "Token expired."
}
```

### Error: Insufficient Permissions

```json
{
  "success": false,
  "message": "Access forbidden. Insufficient permissions.",
  "requiredRoles": ["ADMIN", "SUPERADMIN"],
  "userRole": "STUDENT"
}
```

## Generating JWT Tokens

Make sure your login/register controllers generate tokens with the correct structure:

```typescript
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { JWTPayload } from "../../types";

export const studentLogin = async (req: Request, res: Response) => {
  // ... validate credentials ...

  const payload: JWTPayload = {
    id: student.id,
    email: student.email,
    role: "STUDENT",
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });

  res.json({
    success: true,
    token,
    user: {
      id: student.id,
      email: student.email,
      role: "STUDENT",
    },
  });
};
```

## Access Control Examples

### Who Can Access What?

```typescript
// STUDENT route - Accessible by: STUDENT, ADMIN, SUPERADMIN
router.post("/student/apply", verifyToken, isStudent, applyToJob);

// COMPANY route - Accessible by: COMPANY, ADMIN, SUPERADMIN
router.post("/company/post-job", verifyToken, isCompany, postJob);

// ADMIN route - Accessible by: ADMIN, SUPERADMIN
router.get("/admin/dashboard", verifyToken, isAdmin, getDashboard);

// SUPERADMIN route - Accessible by: SUPERADMIN only
router.delete("/superadmin/delete-user", verifyToken, isSuperAdmin, deleteUser);
```

### Real-World Scenarios

| Route Purpose             | Middleware     | Who Can Access             |
| ------------------------- | -------------- | -------------------------- |
| View own student profile  | `isStudent`    | STUDENT, ADMIN, SUPERADMIN |
| Post a job                | `isCompany`    | COMPANY, ADMIN, SUPERADMIN |
| View all colleges         | `isAdmin`      | ADMIN, SUPERADMIN          |
| Delete any user           | `isSuperAdmin` | SUPERADMIN only            |
| Apply to job              | `isStudent`    | STUDENT, ADMIN, SUPERADMIN |
| View company applications | `isCompany`    | COMPANY, ADMIN, SUPERADMIN |

## Best Practices

1. **Always use `verifyToken` first**: The `allowedRoles` middleware depends on `req.user` being set by `verifyToken`.

2. **Order matters**:

   ```typescript
   // ✅ Correct
   router.get("/route", verifyToken, allowedRoles(["ADMIN"]), controller);

   // ❌ Wrong - allowedRoles won't work without verifyToken
   router.get("/route", allowedRoles(["ADMIN"]), controller);
   ```

3. **Use helper middlewares for readability**:

   ```typescript
   // ✅ More readable
   router.get("/route", verifyToken, isAdmin, controller);

   // ✅ Also fine
   router.get("/route", verifyToken, allowedRoles(["ADMIN"]), controller);
   ```

4. **Understand the hierarchy**: You don't need to specify `["ADMIN", "SUPERADMIN"]` - just use `isAdmin` and SUPERADMIN will automatically have access.

   ```typescript
   // ✅ Correct - SUPERADMIN automatically included
   router.get("/admin-only", verifyToken, isAdmin, controller);

   // ❌ Redundant - SUPERADMIN already has access via hierarchy
   router.get(
     "/admin-only",
     verifyToken,
     allowedRoles(["ADMIN", "SUPERADMIN"]),
     controller
   );
   ```

5. **Combine with validation middleware**:

   ```typescript
   router.post(
     "/create-student",
     verifyToken,
     isAdmin,
     validateDto(CreateStudentDto),
     createStudentController
   );
   ```

6. **Handle TypeScript types properly**:

   ```typescript
   // Always check if req.user exists
   if (!req.user) {
     return res.status(401).json({ message: "Unauthorized" });
   }

   const userId = req.user.id; // Now TypeScript knows it exists
   ```
