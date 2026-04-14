import { z } from "zod";

export const studentRegisterDto = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  rollNo: z.string().optional(),
  collegeId: z.number().optional(),
  graduationYear: z.number().optional(),
  skills: z.array(z.string()).optional(),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  activeBacklogs: z.boolean().optional(),

  // ─── New fields ───
  gender: z.string().optional(),
  dob: z.string().optional(),
  city: z.string().optional(),
  degree: z.string().optional(),
  branch: z.string().optional(),
  cgpa: z.number().optional(),
  jobRoleInterest: z.string().optional(),
  preferredJobType: z.string().optional(),
  workMode: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  coverLetterTemplate: z.string().optional(),
  otherLinks: z.array(z.string()).optional(),
  expectedStipend: z.string().optional(),
  preferredLocations: z.array(z.string()).optional(),
  availability: z.string().optional(),
});

export const companyRegisterDto = z.object({
  companyName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  websiteUrl: z.string().optional(),
});

export type StudentRegisterInput = z.infer<typeof studentRegisterDto>;
export type CompanyRegisterInput = z.infer<typeof companyRegisterDto>;
