import { Request, Response } from "express";
import prisma from "../../db/prismaClient";

// Python sends snake_case fields
interface PythonATSReportInput {
  student_id: number;
  resume_id?: number | null;
  resume_url?: string | null;
  ats_report: {
    ats_score: number; // Python sends this
    score_breakdown?: any;
    summary_feedback?: string;
    strengths?: string[];
    improvements?: string[]; // Python calls it improvements, not weaknesses
    recommendations?: string[];
    keyword_match?: any;
    model_used?: string;
    success?: boolean;
    error?: string;
  };
}

export const createATSReport = async (req: Request, res: Response) => {
  try {
    console.log("[ATS Reports] Received request");
    console.log("[ATS Reports] Body:", JSON.stringify(req.body, null, 2));

    const { student_id, resume_id, resume_url, ats_report } =
      req.body as PythonATSReportInput;

    // Validate required fields
    if (!student_id || !ats_report) {
      console.log("[ATS Reports] Missing student_id or ats_report");
      return res.status(400).json({
        error: "Missing required fields: student_id and ats_report",
      });
    }

    if (!resume_url) {
      console.log("[ATS Reports] Missing resume_url");
      return res.status(400).json({
        error: "Missing required field: resume_url",
      });
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: student_id },
    });

    if (!student) {
      console.log(`[ATS Reports] Student not found: ${student_id}`);
      return res.status(404).json({ error: "Student not found" });
    }

    // Create ATS Run record
    const atsRun = await prisma.resumeATSRun.create({
      data: {
        studentId: student_id,
        resumeUrl: resume_url,
        resumeId: resume_id || null,
        overallScore: ats_report.ats_score,
        summary: ats_report.summary_feedback || null,
        strengths: ats_report.strengths || [],
        weaknesses: ats_report.improvements || [], // Python sends 'improvements'
        recommendations: ats_report.recommendations || [],
        keywordMatch:
          ats_report.score_breakdown || ats_report.keyword_match || {},
        modelUsed: ats_report.model_used || "unknown",
        success: ats_report.success !== false,
        error: ats_report.error || null,
      },
    });

    console.log(
      `[ATS Reports] Saved ATS report for student ${student_id} | ats_run_id=${atsRun.id}`,
    );

    return res.status(200).json({
      ats_run_id: atsRun.id,
      success: true,
    });
  } catch (error) {
    console.error("[ATS Reports] Error:", error);
    return res.status(500).json({
      error: "Failed to persist ATS report",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
