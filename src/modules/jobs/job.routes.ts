import { Router } from "express";
import {
  listJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  applyToJob,
  getJobApplications,
} from "./job.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import {
  isStudent,
  isCompany,
  isAdmin,
} from "../../middlewares/role.middleware";

const jobRouter = Router();

// All job routes require authentication
jobRouter.use(verifyToken);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: List jobs (role-aware)
 *     description: >
 *       Students see open jobs. Companies see their own. Admins see all.
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of jobs
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
jobRouter.get("/", listJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get a single job by ID
 *     tags: [Jobs]
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
 *         description: Job details
 *       404:
 *         description: Job not found
 */
jobRouter.get("/:id", getJobById);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job posting (Company only)
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobInput'
 *     responses:
 *       201:
 *         description: Job created
 *       400:
 *         description: Validation error
 */
jobRouter.post("/", isCompany, createJob);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update a job posting (Company owner only)
 *     tags: [Jobs]
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
 *             $ref: '#/components/schemas/UpdateJobInput'
 *     responses:
 *       200:
 *         description: Job updated
 *       400:
 *         description: Error
 */
jobRouter.put("/:id", isCompany, updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job posting (Company owner or Admin)
 *     tags: [Jobs]
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
 *       400:
 *         description: Error
 */
jobRouter.delete("/:id", isCompany, deleteJob);

/**
 * @swagger
 * /jobs/{id}/status:
 *   patch:
 *     summary: Update job status (Admin — approve/reject)
 *     tags: [Jobs]
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
 *                 enum: [open, closed, approved, rejected]
 *     responses:
 *       200:
 *         description: Status updated
 */
jobRouter.patch("/:id/status", isAdmin, updateJobStatus);

/**
 * @swagger
 * /jobs/{id}/apply:
 *   post:
 *     summary: Apply to a job (Student only)
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Application submitted
 *       400:
 *         description: Already applied or job not open
 */
jobRouter.post("/:id/apply", isStudent, applyToJob);

/**
 * @swagger
 * /jobs/{id}/applications:
 *   get:
 *     summary: Get all applications for a job (Company owner or Admin)
 *     tags: [Jobs]
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
 *         description: List of applications
 *       400:
 *         description: Error
 */
jobRouter.get("/:id/applications", isCompany, getJobApplications);

export default jobRouter;
