import prisma from "../../db/prismaClient";

export class ApplicationRepository {
  async findById(id: number) {
    return prisma.jobApplication.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            skills: true,
            resumeUrl: true,
            graduationYear: true,
          },
        },
        jobPosting: {
          select: {
            id: true,
            title: true,
            jobType: true,
            jobLocation: true,
            companyId: true,
            postedOn: true, // <-- Add this line
            company: {
              select: { id: true, companyName: true },
            },
          },
        },
      },
    });
  }

  async updateStatus(id: number, status: string) {
    return prisma.jobApplication.update({
      where: { id },
      data: { status },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        jobPosting: {
          select: {
            id: true,
            title: true,
            company: { select: { id: true, companyName: true } },
          },
        },
      },
    });
  }

  async updateReminder(
    id: number,
    reminderMinutes: number | null,
    reminderEnabled: boolean,
  ) {
    return prisma.jobApplication.update({
      where: { id },
      data: {
        reminderMinutes,
        reminderEnabled,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        jobPosting: {
          select: {
            id: true,
            title: true,
            company: { select: { id: true, companyName: true } },
          },
        },
      },
    });
  }

  async findByStudentId(studentId: number) {
    return prisma.jobApplication.findMany({
      where: { studentId },
      include: {
        jobPosting: {
          select: {
            id: true,
            title: true,
            company: { select: { companyName: true } },
          },
        },
      },
    });
  }
}