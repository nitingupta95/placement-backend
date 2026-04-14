import prisma from "../../db/prismaClient";

export class CompanyRepository {
  async findById(id: number) {
    return prisma.company.findUnique({ where: { id } });
  }

  async updateCompany(id: number, data: any) {
    return prisma.company.update({ where: { id }, data });
  }

  async updateLogoUrl(companyId: number, logoUrl: string) {
    return prisma.company.update({
      where: { id: companyId },
      data: { logoUrl },
    });
  }

  async getDashboardStats(companyId: number) {
    const [totalJobs, totalApplications, interviewsScheduled, hired] = await Promise.all([
      prisma.jobPosting.count({ where: { companyId } }),
      prisma.jobApplication.count({
        where: { jobPosting: { companyId } },
      }),
      prisma.jobApplication.count({
        where: { jobPosting: { companyId }, status: "interview" },
      }),
      prisma.jobApplication.count({
        where: { jobPosting: { companyId }, status: "offered" },
      }),
    ]);
    return { totalJobs, totalApplications, interviewsScheduled, hired };
  }

  async getCompanyJobs(companyId: number) {
    return prisma.jobPosting.findMany({
      where: { companyId },
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { postedOn: "desc" },
    });
  }

  async getAnalytics(companyId: number) {
    const jobs = await prisma.jobPosting.findMany({
      where: { companyId },
      select: { id: true, title: true },
    });

    const jobIds = jobs.map((j) => j.id);

    const [pending, shortlisted, interview, offered, rejected] = await Promise.all([
      prisma.jobApplication.count({ where: { jobId: { in: jobIds }, status: "pending" } }),
      prisma.jobApplication.count({ where: { jobId: { in: jobIds }, status: "shortlisted" } }),
      prisma.jobApplication.count({ where: { jobId: { in: jobIds }, status: "interview" } }),
      prisma.jobApplication.count({ where: { jobId: { in: jobIds }, status: "offered" } }),
      prisma.jobApplication.count({ where: { jobId: { in: jobIds }, status: "rejected" } }),
    ]);

    return {
      funnel: { pending, shortlisted, interview, offered, rejected },
      totalJobs: jobs.length,
    };
  }
}
