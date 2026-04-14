import prisma from "../../db/prismaClient";

export class JobRepository {
  // All jobs (optionally filtered)
  async findAll(filters: { status?: string; companyId?: number } = {}) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.companyId) where.companyId = filters.companyId;

    return prisma.jobPosting.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            location: true,
            industry: true,
            websiteUrl: true,
            logoUrl: true,
          },
        },
        _count: { select: { applications: true } },
      },
      orderBy: { postedOn: "desc" },
    });
  }

  async findById(id: number) {
    return prisma.jobPosting.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            location: true,
            industry: true,
            websiteUrl: true,
            logoUrl: true,
          },
        },
        _count: { select: { applications: true } },
      },
    });
  }

  async create(data: any) {
    return prisma.jobPosting.create({
      data,
      include: {
        company: {
          select: { id: true, companyName: true },
        },
      },
    });
  }

  async update(id: number, data: any) {
    return prisma.jobPosting.update({
      where: { id },
      data,
      include: {
        company: {
          select: { id: true, companyName: true },
        },
      },
    });
  }

  async delete(id: number) {
    return prisma.jobPosting.delete({ where: { id } });
  }

  async findApplicationByStudentAndJob(studentId: number, jobId: number) {
    return prisma.jobApplication.findUnique({
      where: { studentId_jobId: { studentId, jobId } },
    });
  }

  async createApplication(studentId: number, jobId: number) {
    return prisma.jobApplication.create({
      data: { studentId, jobId },
    });
  }

  async findApplicationsByJob(jobId: number) {
    return prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            skills: true,
            resumeUrl: true,
            isPlaced: true,
            graduationYear: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  async countApplicationsForJob(jobId: number) {
    return prisma.jobApplication.count({ where: { jobId } });
  }
}
