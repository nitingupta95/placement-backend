import { z } from "zod";

export const updateProfileDto = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  rollNo: z.string().optional(),
  graduationYear: z.number().optional(),
  skills: z.array(z.string()).optional(),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  activeBacklogs: z.boolean().optional(),

  // ─── New fields ───
  gender: z.string().optional(),
  dob: z.string().optional(), // ISO date string
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

export type UpdateProfileInput = z.infer<typeof updateProfileDto>;

// ─── Work Experience ───
export const workExperienceDto = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  duration: z.string().optional(),
  description: z.string().optional(),
});

export type WorkExperienceInput = z.infer<typeof workExperienceDto>;

// ─── Student Project ───
export const studentProjectDto = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().optional(),
  techStack: z.array(z.string()).optional().default([]),
  link: z.string().url().optional().or(z.literal("")),
});

export type StudentProjectInput = z.infer<typeof studentProjectDto>;
