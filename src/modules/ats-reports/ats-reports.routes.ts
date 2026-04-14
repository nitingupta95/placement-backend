import { Router } from "express";
import { createATSReport } from "./ats-reports.controller";
import { authenticateInternalToken } from "../job-intelligence/job-intelligence.middleware";

const router = Router();

console.log("[ATS Reports Routes] Module loaded");

/**
 * @swagger
 * /internal/ats-reports:
 *   post:
 *     summary: Create an ATS resume analysis report
 *     description: >
 *       Internal service-to-service endpoint called by the AI orchestrator
 *       after it finishes analysing a student's resume. Persists ATS score,
 *       strengths, weaknesses, recommendations, and keyword match data.
 *     tags: [ATS Reports]
 *     security:
 *       - InternalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ATSReportInput'
 *     responses:
 *       200:
 *         description: ATS report created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ats_run_id:
 *                   type: integer
 *                   example: 7
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Server error
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
router.post("/", authenticateInternalToken, createATSReport);

export default router;
