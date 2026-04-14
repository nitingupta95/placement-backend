import { Router } from "express";
import {
  studentRegister,
  studentLogin,
  companyRegister,
  companyLogin,
  superAdminLogin,
  adminLogin,
  logout,
  testStudent,
  testCompany,
  testAdmin,
  testSuperAdmin,
} from "./auth.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import {
  isStudent,
  isCompany,
  isAdmin,
  isSuperAdmin,
} from "../../middlewares/role.middleware";

const authRouter = Router();

// ─── Student Registration ───

/**
 * @swagger
 * /auth/student/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentRegisterInput'
 *     responses:
 *       201:
 *         description: Student registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIs..."
 *       400:
 *         description: Validation error or student already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/student/register", studentRegister);

/**
 * @swagger
 * /auth/student/login:
 *   post:
 *     summary: Login as a student
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/Student'
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/student/login", studentLogin);

// ─── Company Registration ───

/**
 * @swagger
 * /auth/company/register:
 *   post:
 *     summary: Register a new company
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyRegisterInput'
 *     responses:
 *       201:
 *         description: Company registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation error or company already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/company/register", companyRegister);

/**
 * @swagger
 * /auth/company/login:
 *   post:
 *     summary: Login as a company
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/Company'
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/company/login", companyLogin);

// ─── Admin Logins ───

/**
 * @swagger
 * /auth/superadmin/login:
 *   post:
 *     summary: Login as a super admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/superadmin/login", superAdminLogin);

/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Login as a college admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/admin/login", adminLogin);

// ─── Logout ───

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout (invalidate session client-side)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/logout", verifyToken, logout);

// ─── RBAC Test Routes ───

/**
 * @swagger
 * /auth/test/student:
 *   get:
 *     summary: Test student role access (RBAC)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Student role verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                 accessibleBy:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — insufficient role
 */
authRouter.get("/test/student", verifyToken, isStudent, testStudent);

/**
 * @swagger
 * /auth/test/company:
 *   get:
 *     summary: Test company role access (RBAC)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Company role verified
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — insufficient role
 */
authRouter.get("/test/company", verifyToken, isCompany, testCompany);

/**
 * @swagger
 * /auth/test/admin:
 *   get:
 *     summary: Test admin role access (RBAC)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin role verified
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — insufficient role
 */
authRouter.get("/test/admin", verifyToken, isAdmin, testAdmin);

/**
 * @swagger
 * /auth/test/superadmin:
 *   get:
 *     summary: Test super admin role access (RBAC)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: SuperAdmin role verified
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — insufficient role
 */
authRouter.get("/test/superadmin", verifyToken, isSuperAdmin, testSuperAdmin);

export default authRouter;
