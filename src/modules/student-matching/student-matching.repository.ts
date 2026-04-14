import prisma from "../../db/prismaClient";

export class StudentMatchingRepository {
  // ─── Get eligible students for matching ───
  async getEligibleStudents(filters?: { isActive?: boolean; minAtsScore?: number }) {
    const where: any = {};
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    // ATS score filter requires join – handled at service level
    const students = await prisma.student.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        rollNo: true,
        skills: true,
        isActive: true,
        graduationYear: true,
        isPlaced: true,
      },
      orderBy: { firstName: "asc" },
    });
    return students;
  }

  // ─── Create a match run ───
  async createMatchRun(data: {
    studentId: number;
    jobIntelligenceRunId?: number;
    topK?: number;
    jobsConsidered?: number;
    studentAtsScore?: number;
  }) {
    return prisma.studentMatchRun.create({ data });
  }

  // ─── Create match results in bulk ───
  async createMatchResults(results: {
    runId: number;
    studentId: number;
    jobId: number;
    jobSource?: string;
    matchScore: number;
    skillMatchScore?: number;
    atsScore?: number;
    matchedSkills?: string[];
    missingSkills?: string[];
    reasoning?: any;
  }[]) {
    return prisma.studentMatchResult.createMany({ data: results });
  }

  // ─── Get match results for a student ───
  async getStudentMatchResults(studentId: number, limit = 20) {
    return prisma.studentMatchResult.findMany({
      where: { studentId },
      orderBy: { matchScore: "desc" },
      take: limit,
      include: { run: true },
    });
  }

  // ─── Get match run by ID ───
  async getMatchRunById(runId: number) {
    return prisma.studentMatchRun.findUnique({
      where: { id: runId },
      include: { matches: { orderBy: { matchScore: "desc" } } },
    });
  }

  // ─── Approve job for student ───
  async approveJob(studentId: number, jobId: number, jobSource = "job_intelligence") {
    return prisma.studentJobApproval.create({
      data: { studentId, jobId, jobSource },
    });
  }

  // ─── Check if already approved ───
  async findApproval(studentId: number, jobId: number, jobSource = "job_intelligence") {
    return prisma.studentJobApproval.findUnique({
      where: { studentId_jobSource_jobId: { studentId, jobSource, jobId } },
    });
  }

  // ─── Get all approvals for a student ───
  async getStudentApprovals(studentId: number) {
    return prisma.studentJobApproval.findMany({
      where: { studentId },
      orderBy: { approvedAt: "desc" },
    });
  }

  // ─── Get all match runs ───
  async getMatchRuns(limit = 50) {
    return prisma.studentMatchRun.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { matches: { select: { id: true, matchScore: true, studentId: true, jobId: true } } },
    });
  }
}
