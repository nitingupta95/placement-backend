import { Request, Response } from "express";
import { StudentMatchingService } from "./student-matching.service";

const service = new StudentMatchingService();

// ─── Get eligible students for matching ───
export const getEligibleStudents = async (req: Request, res: Response) => {
  try {
    const isActive = req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined;
    const students = await service.getEligibleStudents({ isActive });
    res.json({ success: true, students, count: students.length });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Approve a job match ───
export const approveJobMatch = async (req: Request, res: Response) => {
  try {
    const { jobId, jobSource } = req.body;
    if (!jobId) return res.status(400).json({ success: false, message: "jobId is required" });
    const studentId = req.user!.id;
    const approval = await service.approveJob(studentId, jobId, jobSource);
    res.status(201).json({ success: true, approval });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Create batch match (from orchestrator) ───
export const createBatchMatch = async (req: Request, res: Response) => {
  try {
    const { studentId, jobIntelligenceRunId, topK, jobsConsidered, studentAtsScore, matches } = req.body;
    if (!studentId || !matches || !Array.isArray(matches)) {
      return res.status(400).json({ error: "studentId and matches array are required" });
    }
    const run = await service.createBatchMatch({
      studentId,
      jobIntelligenceRunId,
      topK,
      jobsConsidered,
      studentAtsScore,
      matches,
    });
    res.status(201).json({ success: true, run });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Get student match results ───
export const getStudentMatches = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 20;
    const results = await service.getStudentMatches(studentId, limit);
    res.json({ success: true, results, count: results.length });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get student approvals ───
export const getStudentApprovals = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.id;
    const approvals = await service.getStudentApprovals(studentId);
    res.json({ success: true, approvals });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Internal: Get all match runs ───
export const getMatchRuns = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const runs = await service.getMatchRuns(limit);
    res.json({ runs, count: runs.length });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
