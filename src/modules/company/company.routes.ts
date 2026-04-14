import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getDashboardStats,
  getCompanyJobs,
  getAnalytics,
  uploadLogo,
} from "./company.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { isCompany } from "../../middlewares/role.middleware";
import { upload } from "../../middlewares/upload.middleware";

const companyRouter = Router();

companyRouter.use(verifyToken);
companyRouter.use(isCompany);

/**
 * @swagger
 * /company/profile:
 *   get:
 *     summary: Get company profile
 *     tags: [Company]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Company profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 */
companyRouter.get("/profile", getProfile);

/**
 * @swagger
 * /company/profile:
 *   put:
 *     summary: Update company profile
 *     tags: [Company]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               websiteUrl:
 *                 type: string
 *               description:
 *                 type: string
 *               industry:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
companyRouter.put("/profile", updateProfile);

/**
 * @swagger
 * /company/dashboard/stats:
 *   get:
 *     summary: Get company dashboard statistics
 *     tags: [Company]
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
 *                 totalJobs:
 *                   type: integer
 *                 totalApplications:
 *                   type: integer
 *                 interviewsScheduled:
 *                   type: integer
 *                 hired:
 *                   type: integer
 */
companyRouter.get("/dashboard/stats", getDashboardStats);

/**
 * @swagger
 * /company/jobs:
 *   get:
 *     summary: Get company's own job postings
 *     tags: [Company]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of company's jobs
 */
companyRouter.get("/jobs", getCompanyJobs);

/**
 * @swagger
 * /company/analytics:
 *   get:
 *     summary: Get company hiring analytics (funnel)
 *     tags: [Company]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data with funnel breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 funnel:
 *                   type: object
 *                   properties:
 *                     pending:
 *                       type: integer
 *                     shortlisted:
 *                       type: integer
 *                     interview:
 *                       type: integer
 *                     offered:
 *                       type: integer
 *                     rejected:
 *                       type: integer
 *                 totalJobs:
 *                   type: integer
 */
companyRouter.get("/analytics", getAnalytics);

/**
 * @swagger
 * /company/upload:
 *   post:
 *     summary: Upload company logo / profile file
 *     tags: [Company]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image or document file (max 5 MB)
 *     responses:
 *       200:
 *         description: File uploaded successfully
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
 *                 file:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                     fileUrl:
 *                       type: string
 *                     fileSize:
 *                       type: integer
 *                     uploadedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Upload failed
 */
companyRouter.post("/upload", upload.single("file"), uploadLogo);

export default companyRouter;
