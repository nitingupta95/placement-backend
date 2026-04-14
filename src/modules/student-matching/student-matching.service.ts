import { StudentMatchingRepository } from "./student-matching.repository";

const repo = new StudentMatchingRepository();

export class StudentMatchingService {
  // ─── Get eligible students ───
  async getEligibleStudents(filters?: { isActive?: boolean }) {
    const students = await repo.getEligibleStudents(filters);
    return students;
  }

  // ─── Approve a job match for a student ───
  async approveJob(studentId: number, jobId: number, jobSource = "job_intelligence") {
    const existing = await repo.findApproval(studentId, jobId, jobSource);
    if (existing) throw new Error("Job already approved for this student");
    return repo.approveJob(studentId, jobId, jobSource);
  }

  // ─── Batch matching: create run + results (from orchestrator) ───
  async createBatchMatch(data: {
    studentId: number;
    jobIntelligenceRunId?: number;
    topK?: number;
    jobsConsidered?: number;
    studentAtsScore?: number;
    matches: {
      jobId: number;
      jobSource?: string;
      matchScore: number;
      skillMatchScore?: number;
      atsScore?: number;
      matchedSkills?: string[];
      missingSkills?: string[];
      reasoning?: any;
    }[];
  }) {
    const run = await repo.createMatchRun({
      studentId: data.studentId,
      jobIntelligenceRunId: data.jobIntelligenceRunId,
      topK: data.topK,
      jobsConsidered: data.jobsConsidered,
      studentAtsScore: data.studentAtsScore,
    });

    if (data.matches.length > 0) {
      const results = data.matches.map((m) => ({
        runId: run.id,
        studentId: data.studentId,
        jobId: m.jobId,
        jobSource: m.jobSource || "job_intelligence",
        matchScore: m.matchScore,
        skillMatchScore: m.skillMatchScore,
        atsScore: m.atsScore,
        matchedSkills: m.matchedSkills || [],
        missingSkills: m.missingSkills || [],
        reasoning: m.reasoning,
      }));
      await repo.createMatchResults(results);
    }

    return repo.getMatchRunById(run.id);
  }

  // ─── Get match results for student ───
  async getStudentMatches(studentId: number, limit = 20) {
    return repo.getStudentMatchResults(studentId, limit);
  }

  // ─── Get student approvals ───
  async getStudentApprovals(studentId: number) {
    return repo.getStudentApprovals(studentId);
  }

  // ─── Get all runs (internal) ───
  async getMatchRuns(limit = 50) {
    return repo.getMatchRuns(limit);
  }

  // ─── Get details of a run ───
  async getMatchRunById(runId: number) {
    const run = await repo.getMatchRunById(runId);
    if (!run) throw new Error("Match run not found");
    return run;
  }
}
