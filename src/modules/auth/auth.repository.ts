import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class AuthRepository {
  // ---------- STUDENT ----------
  async createStudent(data: any) {
    return prisma.student.create({ data });
  }

  async findStudentByEmail(email: string) {
    return prisma.student.findUnique({ where: { email } });
  }

  // ---------- COMPANY ----------
  async createCompany(data: any) {
    return prisma.company.create({ data });
  }

  async findCompanyByEmail(email: string) {
    return prisma.company.findUnique({ where: { email } });
  }

  // ---------- COLLEGE ADMIN ----------
  async findAdminByEmail(email: string) {
    return prisma.collegeAdmin.findUnique({ where: { email } });
  }

  // ---------- SUPERADMIN ----------
  async findSuperAdminByEmail(email: string) {
    return prisma.superAdmin.findUnique({ where: { email } });
  }
}
