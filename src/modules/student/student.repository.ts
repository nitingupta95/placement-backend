import prisma from "../../db/prismaClient";

export class StudentRepository {
  async findById(id: number) {
    return prisma.student.findUnique({ where: { id } });
  }

  async updateStudent(id: number, data: any) {
    return prisma.student.update({
      where: { id },
      data,
    });
  }

  async updateResumeUrl(studentId: number, resumeUrl: string) {
    return prisma.student.update({
      where: { id: studentId },
      data: { resumeUrl },
    });
  }

  findStudentDetails(id: number) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        college: {
          select: {
            id: true,
            name: true,
          },
        },
        atsRuns: {
          select: {
            id: true, 
            createdAt: true,
            overallScore: true,
          },
          orderBy: { createdAt: "desc" },
        },
        workExperiences: {
          orderBy: { createdAt: "desc" },
        },
        projects: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async getResumeATSRuns(studentId: number) {
    return prisma.resumeATSRun.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        resumeUrl: true,
        resumeId: true,
        overallScore: true,
        summary: true,
        strengths: true,
        weaknesses: true,
        recommendations: true,
        keywordMatch: true,
        modelUsed: true,
        success: true,
        error: true,
        createdAt: true,
      },
    });
  }

  // ─── Dashboard Stats ───
  async getDashboardStats(studentId: number) {
    const [applied, shortlisted, interviews, offers] = await Promise.all([
      prisma.jobApplication.count({ where: { studentId } }),
      prisma.jobApplication.count({ where: { studentId, status: "shortlisted" } }),
      prisma.jobApplication.count({ where: { studentId, status: "interview" } }),
      prisma.jobApplication.count({ where: { studentId, status: "offered" } }),
    ]);
    return { applied, shortlisted, interviews, offers };
  }

  // ─── Applications ───
  async getApplications(studentId: number) {
    return prisma.jobApplication.findMany({
      where: { studentId },
      include: {
        jobPosting: {
          include: {
            company: {
              select: { id: true, companyName: true, logoUrl: true, location: true },
            },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  // ─── Saved Jobs ───
  async getSavedJobs(studentId: number) {
    return prisma.savedJob.findMany({
      where: { studentId },
      include: {
        jobPosting: {
          include: {
            company: {
              select: { id: true, companyName: true, logoUrl: true, location: true },
            },
          },
        },
      },
      orderBy: { savedAt: "desc" },
    });
  }

  async saveJob(studentId: number, jobId: number) {
    return prisma.savedJob.create({
      data: { studentId, jobId },
    });
  }

  async unsaveJob(studentId: number, jobId: number) {
    return prisma.savedJob.delete({
      where: { studentId_jobId: { studentId, jobId } },
    });
  }

  async findSavedJob(studentId: number, jobId: number) {
    return prisma.savedJob.findUnique({
      where: { studentId_jobId: { studentId, jobId } },
    });
  }

  // ─── Work Experience ───
  async getWorkExperiences(studentId: number) {
    return prisma.workExperience.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });
  }

  async createWorkExperience(studentId: number, data: { company: string; role: string; duration?: string; description?: string }) {
    return prisma.workExperience.create({
      data: { studentId, ...data },
    });
  }

  async updateWorkExperience(id: number, studentId: number, data: { company?: string; role?: string; duration?: string; description?: string }) {
    return prisma.workExperience.update({
      where: { id },
      data,
    });
  }

  async deleteWorkExperience(id: number, studentId: number) {
    return prisma.workExperience.delete({
      where: { id },
    });
  }

  async findWorkExperience(id: number, studentId: number) {
    return prisma.workExperience.findFirst({
      where: { id, studentId },
    });
  }

  // ─── Projects ───
  async getProjects(studentId: number) {
    return prisma.studentProject.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });
  }

  async createProject(studentId: number, data: { title: string; description?: string; techStack?: string[]; link?: string }) {
    return prisma.studentProject.create({
      data: { studentId, ...data },
    });
  }

  async updateProject(id: number, studentId: number, data: { title?: string; description?: string; techStack?: string[]; link?: string }) {
    return prisma.studentProject.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: number, studentId: number) {
    return prisma.studentProject.delete({
      where: { id },
    });
  }

  async findProject(id: number, studentId: number) {
    return prisma.studentProject.findFirst({
      where: { id, studentId },
    });
  }

  // ─── Matching ───
  async getStudentForMatching(studentId: number) {
    return prisma.student.findUnique({
      where: { id: studentId },
      select: {
        skills: true,
        jobRoleInterest: true,
        degree: true,
        branch: true,
        preferredLocations: true,
        workExperiences: { select: { role: true, description: true } },
        projects: { select: { title: true, techStack: true } },
      },
    });
  }

  async getAllJobPostings() {
    return prisma.jobPosting.findMany({
      where: { status: "open" },
      include: {
        company: { select: { id: true, companyName: true, logoUrl: true, location: true } },
      },
    });
  }

  async getAllScrapedJobs() {
    return prisma.scrapedJob.findMany({ orderBy: { scraped_at: "desc" } });
  }
}
