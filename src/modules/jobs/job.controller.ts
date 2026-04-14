import { Request, Response } from "express";
import { JobService } from "./job.service";
import { createJobDto, updateJobDto } from "./dto/job.dto";

const service = new JobService();

export const listJobs = async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    const userId = req.user!.id;
    const jobs = await service.listJobs(role, userId);
    res.json({ success: true, jobs });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid job ID" });
    const job = await service.getJobById(id);
    res.json({ success: true, job });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const data = createJobDto.parse(req.body);
    const companyId = req.user!.id;
    const job = await service.createJob(companyId, data);
    res.status(201).json({ success: true, job });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid job ID" });
    const data = updateJobDto.parse(req.body);
    const job = await service.updateJob(id, req.user!.id, req.user!.role, data);
    res.json({ success: true, job });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid job ID" });
    await service.deleteJob(id, req.user!.id, req.user!.role);
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateJobStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid job ID" });
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "Status is required" });
    const job = await service.updateJobStatus(id, status);
    res.json({ success: true, job });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const applyToJob = async (req: Request, res: Response) => {
  try {
    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) return res.status(400).json({ success: false, message: "Invalid job ID" });
    const studentId = req.user!.id;
    const application = await service.applyToJob(studentId, jobId);
    res.status(201).json({ success: true, application });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) return res.status(400).json({ success: false, message: "Invalid job ID" });
    const applications = await service.getApplicationsForJob(jobId, req.user!.id, req.user!.role);
    res.json({ success: true, applications });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
