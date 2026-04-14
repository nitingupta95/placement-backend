import { Router } from "express";
import {
  getDashboardStats,
  getCompanies,
  verifyCompany,
  getStudents,
  getStudentAnalytics,
  getCompanyAnalytics,
  getPendingJobs,
  approveJob,
  deleteJob,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getHeadlines,
  createHeadline,
  deleteHeadline,
  getInternalStudents,
  getInternalStudentProfile,
  getOpenJobPostings,
} from "./admin.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/role.middleware";
import { authenticateInternalToken } from "../job-intelligence/job-intelligence.middleware";

const adminRouter = Router();

// ──────────── Admin routes (JWT + ADMIN role) ────────────

/**
 * @swagger
 * /admin/dashboard/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalStudents:
 *                   type: integer
 *                 totalCompanies:
 *                   type: integer
 *                 totalJobs:
 *                   type: integer
 *                 totalApplications:
 *                   type: integer
 *                 pendingJobs:
 *                   type: integer
 *                 activeJobs:
 *                   type: integer
 */
adminRouter.get("/dashboard/stats", verifyToken, isAdmin, getDashboardStats);

/**
 * @swagger
 * /admin/companies:
 *   get:
 *     summary: List all companies
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 companies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 */
adminRouter.get("/companies", verifyToken, isAdmin, getCompanies);

/**
 * @swagger
 * /admin/companies/{id}/verify:
 *   patch:
 *     summary: Verify / reject a company
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [verified, rejected, pending]
 *     responses:
 *       200:
 *         description: Company verification updated
 */
adminRouter.patch("/companies/:id/verify", verifyToken, isAdmin, verifyCompany);

/**
 * @swagger
 * /admin/students:
 *   get:
 *     summary: List all students
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 */
adminRouter.get("/students", verifyToken, isAdmin, getStudents);

/**
 * @swagger
 * /admin/analytics/students:
 *   get:
 *     summary: Get student placement analytics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Student analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalStudents:
 *                   type: integer
 *                 placed:
 *                   type: integer
 *                 placementRate:
 *                   type: number
 *                 avgApplicationsPerStudent:
 *                   type: number
 */
adminRouter.get("/analytics/students", verifyToken, isAdmin, getStudentAnalytics);

/**
 * @swagger
 * /admin/analytics/companies:
 *   get:
 *     summary: Get company hiring analytics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Company analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalCompanies:
 *                   type: integer
 *                 verified:
 *                   type: integer
 *                 totalJobsPosted:
 *                   type: integer
 *                 totalHires:
 *                   type: integer
 */
adminRouter.get("/analytics/companies", verifyToken, isAdmin, getCompanyAnalytics);

/**
 * @swagger
 * /admin/jobs/pending:
 *   get:
 *     summary: Get pending jobs awaiting approval
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Pending jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobPosting'
 */
adminRouter.get("/jobs/pending", verifyToken, isAdmin, getPendingJobs);

/**
 * @swagger
 * /admin/jobs/{id}/approve:
 *   patch:
 *     summary: Approve or reject a job posting
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, rejected, closed]
 *     responses:
 *       200:
 *         description: Job status updated
 */
adminRouter.patch("/jobs/:id/approve", verifyToken, isAdmin, approveJob);

/**
 * @swagger
 * /admin/jobs/{id}:
 *   delete:
 *     summary: Delete a job posting
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job deleted
 */
adminRouter.delete("/jobs/:id", verifyToken, isAdmin, deleteJob);

/**
 * @swagger
 * /admin/announcements:
 *   get:
 *     summary: List all announcements
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of announcements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 announcements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Announcement'
 *   post:
 *     summary: Create an announcement
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Announcement created
 */
adminRouter.get("/announcements", verifyToken, isAdmin, getAnnouncements);
adminRouter.post("/announcements", verifyToken, isAdmin, createAnnouncement);

/**
 * @swagger
 * /admin/announcements/{id}:
 *   put:
 *     summary: Update an announcement
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Announcement updated
 *   delete:
 *     summary: Delete an announcement
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Announcement deleted
 */
adminRouter.put("/announcements/:id", verifyToken, isAdmin, updateAnnouncement);
adminRouter.delete("/announcements/:id", verifyToken, isAdmin, deleteAnnouncement);

/**
 * @swagger
 * /admin/headlines:
 *   get:
 *     summary: List all headlines
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of headlines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 headlines:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Headline'
 *   post:
 *     summary: Create a headline
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [company, headline]
 *             properties:
 *               company:
 *                 type: string
 *               headline:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Headline created
 */
adminRouter.get("/headlines", verifyToken, isAdmin, getHeadlines);
adminRouter.post("/headlines", verifyToken, isAdmin, createHeadline);

/**
 * @swagger
 * /admin/headlines/{id}:
 *   delete:
 *     summary: Delete a headline
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Headline deleted
 */
adminRouter.delete("/headlines/:id", verifyToken, isAdmin, deleteHeadline);

// ──────────── Internal routes (service-to-service, InternalToken) ────────────

/**
 * @swagger
 * /internal/students:
 *   get:
 *     summary: List students for internal services
 *     tags: [Internal]
 *     security:
 *       - InternalToken: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 500
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Students list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *                 count:
 *                   type: integer
 */
const internalRouter = Router();
internalRouter.use(authenticateInternalToken);
internalRouter.get("/students", getInternalStudents);

/**
 * @swagger
 * /internal/students/{studentId}/profile:
 *   get:
 *     summary: Get student profile by ID for internal services
 *     tags: [Internal]
 *     security:
 *       - InternalToken: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 */
internalRouter.get("/students/:studentId/profile", getInternalStudentProfile);

/**
 * @swagger
 * /internal/job-postings/open:
 *   get:
 *     summary: Get open job postings for internal services
 *     tags: [Internal]
 *     security:
 *       - InternalToken: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 200
 *     responses:
 *       200:
 *         description: Open job postings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobPosting'
 *                 count:
 *                   type: integer
 */
internalRouter.get("/job-postings/open", getOpenJobPostings);

export { adminRouter, internalRouter };
