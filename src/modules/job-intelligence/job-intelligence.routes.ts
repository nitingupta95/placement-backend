import { Router } from "express";
import { bulkCreateJobs, getLatestRun, getRunById, getStudentJobIntelligence, getScrapedJobs, getJobExpiryPrefs, updateJobExpiryPrefs } from "./job-intelligence.controller";
import { authenticateInternalToken } from "./job-intelligence.middleware";
import { verifyToken } from "../../middlewares/auth.middleware";
import { isStudent } from "../../middlewares/role.middleware";

const router = Router();

console.log("[JobIntelligence Routes] Module loaded");

/**
 * @swagger
 * /internal/job-intelligence/bulk:
 *   post:
 *     summary: Bulk-create job intelligence records
 *     description: >
 *       Internal service-to-service endpoint used by the AI orchestrator
 *       to persist scraped & scored job listings. Creates a new
 *       `JobIntelligenceRun` and inserts all jobs under it.
 *     tags: [Job Intelligence]
 *     security:
 *       - InternalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobIntelligenceBulkInput'
 *     responses:
 *       200:
 *         description: Jobs saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saved:
 *                   type: integer
 *                   example: 15
 *                 run_id:
 *                   type: integer
 *                   example: 42
 *       400:
 *         description: Invalid or empty jobs array
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or empty jobs array"
 *       401:
 *         description: Missing or invalid internal token
 *       500:
 *         description: Server error while persisting jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post(
  "/bulk",
  (req, res, next) => {
    console.log("[JobIntelligence] /bulk route hit");
    next();
  },
  authenticateInternalToken,
  bulkCreateJobs,
);

/**
 * @swagger
 * /internal/job-intelligence/latest:
 *   get:
 *     summary: Get the latest job intelligence run with all jobs
 *     tags: [Job Intelligence]
 *     security:
 *       - InternalToken: []
 *     responses:
 *       200:
 *         description: Latest run with jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 run:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     runType:
 *                       type: string
 *                     totalJobs:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     jobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/JobIntelligenceJob'
 *       404:
 *         description: No runs found
 */
router.get("/latest", authenticateInternalToken, getLatestRun);

/**
 * @swagger
 * /internal/job-intelligence/run/{runId}:
 *   get:
 *     summary: Get a specific job intelligence run by ID
 *     tags: [Job Intelligence]
 *     security:
 *       - InternalToken: []
 *     parameters:
 *       - in: path
 *         name: runId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Run details with jobs
 *       404:
 *         description: Run not found
 */
router.get("/run/:runId", authenticateInternalToken, getRunById);

/**
 * @swagger
 * /internal/job-intelligence/scraped-jobs:
 *   get:
 *     summary: Get all scraped jobs from the ScrapedJob table
 *     tags: [Job Intelligence]
 *     security:
 *       - InternalToken: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by job title, company, or location
 *     responses:
 *       200:
 *         description: Paginated scraped jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
router.get("/scraped-jobs", authenticateInternalToken, getScrapedJobs);

/**
 * @swagger
 * /internal/job-intelligence/job-expiry-preferences:
 *   get:
 *     summary: Get job expiry preferences (active days, inactive days)
 *     tags: [Job Intelligence]
 *     security:
 *       - InternalToken: []
 *     responses:
 *       200:
 *         description: Current preferences
 */
router.get("/job-expiry-preferences", authenticateInternalToken, getJobExpiryPrefs);

/**
 * @swagger
 * /internal/job-intelligence/job-expiry-preferences:
 *   put:
 *     summary: Update job expiry preferences
 *     tags: [Job Intelligence]
 *     security:
 *       - InternalToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activeDays:
 *                 type: integer
 *               inactiveDays:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated preferences
 */
router.put("/job-expiry-preferences", authenticateInternalToken, updateJobExpiryPrefs);

export default router;

// ─── Student-facing job intelligence routes ───
const studentJobIntelligenceRouter = Router();

/**
 * @swagger
 * /job-intelligence/latest:
 *   get:
 *     summary: Browse latest job intelligence results (student-facing)
 *     tags: [Job Intelligence]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated job intelligence results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobIntelligenceJob'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 runId:
 *                   type: integer
 *                 runDate:
 *                   type: string
 *                   format: date-time
 */
studentJobIntelligenceRouter.get("/latest", verifyToken, isStudent, getStudentJobIntelligence);

/**
 * @swagger
 * /job-intelligence/scraped-jobs:
 *   get:
 *     summary: Get scraped jobs from the ScrapedJob table (student-facing)
 *     tags: [Job Intelligence]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated scraped jobs
 */
studentJobIntelligenceRouter.get("/scraped-jobs", verifyToken, isStudent, getScrapedJobs);

export { studentJobIntelligenceRouter };
 