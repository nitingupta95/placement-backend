import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
import { StudentRegisterInput, CompanyRegisterInput } from "./dto/register.dto";
import { LoginInput } from "./dto/login.dto";

const repo = new AuthRepository();

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || "supersecret";

  // ---------- STUDENT REGISTER ----------
  async studentRegister(data: StudentRegisterInput) {
    const existing = await repo.findStudentByEmail(data.email);
    if (existing) throw new Error("Student already exists");

    const hashed = await bcrypt.hash(data.password, 10);
    const student = await repo.createStudent({ ...data, password: hashed });
    const token = this.generateToken({ id: student.id, role: "STUDENT" });

    // Remove password from response
    const { password, ...studentData } = student;
    return { student: studentData, token };
  }

  // ---------- COMPANY REGISTER ----------
  async companyRegister(data: CompanyRegisterInput) {
    const existing = await repo.findCompanyByEmail(data.email);
    if (existing) throw new Error("Company already exists");

    const hashed = await bcrypt.hash(data.password, 10);
    const company = await repo.createCompany({ ...data, password: hashed });
    const token = this.generateToken({ id: company.id, role: "COMPANY" });

    // Remove password from response
    const { password, ...companyData } = company;
    return { company: companyData, token };
  }

  // ---------- LOGIN ----------
  async login(
    data: LoginInput,
    role: "STUDENT" | "COMPANY" | "ADMIN" | "SUPERADMIN",
  ) {
    let user;
    if (role === "STUDENT") user = await repo.findStudentByEmail(data.email);
    else if (role === "COMPANY")
      user = await repo.findCompanyByEmail(data.email);
    else if (role === "ADMIN") user = await repo.findAdminByEmail(data.email);
    else user = await repo.findSuperAdminByEmail(data.email);

    if (!user) throw new Error("User not found");
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = this.generateToken({ id: user.id, role });

    // Remove password from response
    const { password, ...userData } = user;
    return { user: userData, token };
  }

  private generateToken(payload: any) {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: "7d" });
  }
}
