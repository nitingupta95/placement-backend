import { Router } from "express";
import {
  getEligibleStudents,
  approveJobMatch,
  createBatchMatch,
  getStudentMatches,
  getStudentApprovals,
  getMatchRuns,
} from "./student-matching.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { isStudent, isAdmin } from "../../middlewares/role.middleware";
import { authenticateInternalToken } from "../job-intelligence/job-intelligence.middleware";

const studentMatchingRouter = Router();

// ─── Admin routes ───

/**
 * @swagger
 * /student-matching/eligible-students:
 *   get:
 *     summary: Get students eligible for job matching
 *     tags: [Student Matching]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Eligible students list
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
 *                 count:
 *                   type: integer
 */
studentMatchingRouter.get("/eligible-students", verifyToken, isAdmin, getEligibleStudents);

// ─── Student routes ───

/**
 * @swagger
 * /student-matching/approve:
 *   post:
 *     summary: Approve / save a job match
 *     tags: [Student Matching]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId]
 *             properties:
 *               jobId:
 *                 type: integer
 *               jobSource:
 *                 type: string
 *                 default: job_intelligence
 *     responses:
 *       201:
 *         description: Job approved/saved
 *       400:
 *         description: Already approved or invalid input
 */
studentMatchingRouter.post("/approve", verifyToken, isStudent, approveJobMatch);

/**
 * @swagger
 * /student-matching/my-matches:
 *   get:
 *     summary: Get current student's match results
 *     tags: [Student Matching]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Match results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       jobId:
 *                         type: integer
 *                       matchScore:
 *                         type: number
 *                       matchedSkills:
 *                         type: array
 *                         items:
 *                           type: string
 *                       missingSkills:
 *                         type: array
 *                         items:
 *                           type: string
 *                 count:
 *                   type: integer
 */
studentMatchingRouter.get("/my-matches", verifyToken, isStudent, getStudentMatches);

/**
 * @swagger
 * /student-matching/my-approvals:
 *   get:
 *     summary: Get current student's job approvals
 *     tags: [Student Matching]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Student approvals
 */
studentMatchingRouter.get("/my-approvals", verifyToken, isStudent, getStudentApprovals);

/**
 * @swagger
 * /internal/student-matching/runs:
 *   get:
 *     summary: Get all match runs (internal)
 *     tags: [Student Matching]
 *     security:
 *       - InternalToken: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Match runs
 */
const internalStudentMatchingRouter = Router();
internalStudentMatchingRouter.use(authenticateInternalToken);
internalStudentMatchingRouter.get("/runs", getMatchRuns);

/**
 * @swagger
 * /internal/student-matching/batch:
 *   post:
 *     summary: Create batch match results (from AI orchestrator)
 *     tags: [Student Matching]
 *     security:
 *       - InternalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [studentId, matches]
 *             properties:
 *               studentId:
 *                 type: integer
 *               jobIntelligenceRunId:
 *                 type: integer
 *               topK:
 *                 type: integer
 *               jobsConsidered:
 *                 type: integer
 *               studentAtsScore:
 *                 type: number
 *               matches:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [jobId, matchScore]
 *                   properties:
 *                     jobId:
 *                       type: integer
 *                     jobSource:
 *                       type: string
 *                     matchScore:
 *                       type: number
 *                     skillMatchScore:
 *                       type: number
 *                     atsScore:
 *                       type: number
 *                     matchedSkills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     missingSkills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     reasoning:
 *                       type: object
 *     responses:
 *       201:
 *         description: Match run created with results
 *       400:
 *         description: Invalid input
 */
internalStudentMatchingRouter.post("/batch", createBatchMatch);

export { studentMatchingRouter, internalStudentMatchingRouter };
