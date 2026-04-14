import { z } from "zod";

export const createJobDto = z.object({
  title: z.string().min(1, "Title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  jobType: z.string().min(1, "Job type is required"),
  jobLocation: z.string().optional(),
  salaryRange: z.string().optional(),
  requiredSkills: z.array(z.string()).default([]),
  noOfSeats: z.number().int().min(1, "At least 1 seat required"),
});

export type CreateJobInput = z.infer<typeof createJobDto>;

export const updateJobDto = z.object({
  title: z.string().optional(),
  jobDescription: z.string().optional(),
  jobType: z.string().optional(),
  jobLocation: z.string().optional(),
  salaryRange: z.string().optional(),
  requiredSkills: z.array(z.string()).optional(),
  noOfSeats: z.number().int().min(1).optional(),
  status: z.string().optional(),
});

export type UpdateJobInput = z.infer<typeof updateJobDto>;
