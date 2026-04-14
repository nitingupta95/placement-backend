import prisma from "../../db/prismaClient";

export class AdminRepository {
  // ─── Dashboard Stats ───
  async getDashboardStats() {
    const [totalStudents, totalCompanies, totalJobs, totalApplications, placedStudents, pendingJobs] =
      await Promise.all([
        prisma.student.count(),
        prisma.company.count(),
        prisma.jobPosting.count(),
        prisma.jobApplication.count(),
        prisma.student.count({ where: { isPlaced: true } }),
        prisma.jobPosting.count({ where: { status: "pending" } }),
      ]);
    return { totalStudents, totalCompanies, totalJobs, totalApplications, placedStudents, pendingJobs };
  }

  // ─── Companies ───
  async getCompanies() {
    return prisma.company.findMany({
      select: {
        id: true,
        companyName: true,
        email: true,
        websiteUrl: true,
        logoUrl: true,
        industry: true,
        location: true,
        verificationStatus: true,
        createdAt: true,
        _count: { select: { jobPostings: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async verifyCompany(id: number, status: string) {
    return prisma.company.update({
      where: { id },
      data: { verificationStatus: status },
    });
  }

  // ─── Students ───
  async getStudents(filters: { isActive?: boolean } = {}) {
    const where: any = {};
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    return prisma.student.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        rollNo: true,
        skills: true,
        isPlaced: true,
        isActive: true,
        activeBacklogs: true,
        graduationYear: true,
        resumeUrl: true,
        createdAt: true,
        college: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // ─── Student Analytics ───
  async getStudentAnalytics() {
    const [total, placed, active, withBacklogs] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { isPlaced: true } }),
      prisma.student.count({ where: { isActive: true } }),
      prisma.student.count({ where: { activeBacklogs: true } }),
    ]);
    return { total, placed, active, withBacklogs, placementRate: total ? ((placed / total) * 100).toFixed(1) : "0" };
  }

  // ─── Company Analytics ───
  async getCompanyAnalytics() {
    const [total, verified, pending] = await Promise.all([
      prisma.company.count(),
      prisma.company.count({ where: { verificationStatus: "verified" } }),
      prisma.company.count({ where: { verificationStatus: "pending" } }),
    ]);
    return { total, verified, pending };
  }

  // ─── Jobs ───
  async getPendingJobs() {
    return prisma.jobPosting.findMany({
      where: { status: "pending" },
      include: {
        company: { select: { id: true, companyName: true, logoUrl: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { postedOn: "desc" },
    });
  }

  async getAllJobs() {
    return prisma.jobPosting.findMany({
      include: {
        company: { select: { id: true, companyName: true, logoUrl: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { postedOn: "desc" },
    });
  }

  async updateJobStatus(jobId: number, status: string) {
    return prisma.jobPosting.update({
      where: { id: jobId },
      data: { status },
    });
  }

  async deleteJob(jobId: number) {
    // Delete applications first, then the job
    await prisma.jobApplication.deleteMany({ where: { jobId } });
    await prisma.savedJob.deleteMany({ where: { jobId } });
    return prisma.jobPosting.delete({ where: { id: jobId } });
  }

  // ─── Announcements ───
  async getAnnouncements() {
    return prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
  }

  async createAnnouncement(data: { title: string; content: string; createdBy: number }) {
    return prisma.announcement.create({ data });
  }

  async updateAnnouncement(id: number, data: { title?: string; content?: string }) {
    return prisma.announcement.update({ where: { id }, data });
  }

  async deleteAnnouncement(id: number) {
    return prisma.announcement.delete({ where: { id } });
  }

  // ─── Headlines ───
  async getHeadlines() {
    return prisma.headline.findMany({ orderBy: { date: "desc" } });
  }

  async createHeadline(data: { company: string; headline: string; date?: Date }) {
    return prisma.headline.create({ data });
  }

  async deleteHeadline(id: number) {
    return prisma.headline.delete({ where: { id } });
  }

  // ─── Internal: Students list for orchestrator ───
  async getStudentsForInternal(limit: number, isActive?: boolean) {
    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;

    return prisma.student.findMany({
      where,
      take: Math.min(limit, 2000),
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        isPlaced: true,
        activeBacklogs: true,
        skills: true,
        resumeUrl: true,
        linkedinUrl: true,
        portfolioUrl: true,
      },
    });
  }

  // ─── Internal: Student profile by ID ───
  async getStudentProfileById(studentId: number) {
    return prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        rollNo: true,
        collegeId: true,
        portfolioUrl: true,
        graduationYear: true,
        resumeUrl: true,
        linkedinUrl: true,
        skills: true,
        isPlaced: true,
        activeBacklogs: true,
        isActive: true,
        createdAt: true,
        college: { select: { id: true, name: true } },
        atsRuns: {
          select: { id: true, createdAt: true, overallScore: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  // ─── Internal: Open job postings ───
  async getOpenJobPostings(limit: number) {
    return prisma.jobPosting.findMany({
      where: { status: "open" },
      take: Math.min(limit, 500),
      include: {
        company: {
          select: { id: true, companyName: true, location: true, industry: true, websiteUrl: true, logoUrl: true },
        },
      },
      orderBy: { postedOn: "desc" },
    });
  }
}
