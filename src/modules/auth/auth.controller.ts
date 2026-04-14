import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { studentRegisterDto, companyRegisterDto } from "./dto/register.dto";
import { loginDto } from "./dto/login.dto";

const service = new AuthService();

export const studentRegister = async (req: Request, res: Response) => {
  try {
    const data = studentRegisterDto.parse(req.body);
    const result = await service.studentRegister(data);
    res.status(201).json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
  try {
    const data = loginDto.parse(req.body);
    const result = await service.login(data, "STUDENT");
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const companyRegister = async (req: Request, res: Response) => {
  try {
    const data = companyRegisterDto.parse(req.body);
    const result = await service.companyRegister(data);
    res.status(201).json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const companyLogin = async (req: Request, res: Response) => {
  try {
    const data = loginDto.parse(req.body);
    const result = await service.login(data, "COMPANY");
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const data = loginDto.parse(req.body);
    const result = await service.login(data, "ADMIN");
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const superAdminLogin = async (req: Request, res: Response) => {
  try {
    const data = loginDto.parse(req.body);
    const result = await service.login(data, "SUPERADMIN");
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Test RBAC endpoints
export const testStudent = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "✅ Student endpoint accessed successfully",
    user: req.user,
    accessibleBy: ["STUDENT", "ADMIN", "SUPERADMIN"],
  });
};

export const testCompany = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "✅ Company endpoint accessed successfully",
    user: req.user,
    accessibleBy: ["COMPANY", "ADMIN", "SUPERADMIN"],
  });
};

export const testAdmin = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "✅ Admin endpoint accessed successfully",
    user: req.user,
    accessibleBy: ["ADMIN", "SUPERADMIN"],
  });
};

export const testSuperAdmin = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "✅ SuperAdmin endpoint accessed successfully",
    user: req.user,
    accessibleBy: ["SUPERADMIN"],
  });
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Here you can add token blacklisting logic if needed
    // For now, logout is handled client-side by clearing localStorage
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
