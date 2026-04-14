import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import studentRoutes from "../modules/student/student.routes";
import jobIntelligenceRoutes, { studentJobIntelligenceRouter } from "../modules/job-intelligence/job-intelligence.routes";
import atsReportsRoutes from "../modules/ats-reports/ats-reports.routes";
import jobRouter from "../modules/jobs/job.routes";
import applicationRouter from "../modules/applications/application.routes";
import companyRouter from "../modules/company/company.routes";
import { adminRouter, internalRouter } from "../modules/admin/admin.routes";
import { studentMatchingRouter, internalStudentMatchingRouter } from "../modules/student-matching/student-matching.routes";

const router = Router();

// ─── Auth ───
router.use("/auth", authRoutes);

// ─── Student ───
router.use("/student", studentRoutes);

// ─── Jobs ───
router.use("/jobs", jobRouter);

// ─── Applications ───
router.use("/applications", applicationRouter);

// ─── Company ───
router.use("/company", companyRouter);

// ─── Admin ───
router.use("/admin", adminRouter);

// ─── Student Matching ───
router.use("/student-matching", studentMatchingRouter);

// ─── Job Intelligence (student-facing) ───
router.use("/job-intelligence", studentJobIntelligenceRouter);

// ─── Internal: Job Intelligence ───
router.use("/internal/job-intelligence", jobIntelligenceRoutes);

// ─── Internal: ATS Reports ───
router.use("/internal/ats-reports", atsReportsRoutes);

// ─── Internal: Students, Job Postings ───
router.use("/internal", internalRouter);

// ─── Internal: Student Matching ───
router.use("/internal/student-matching", internalStudentMatchingRouter);

export default router;
