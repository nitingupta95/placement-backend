import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const service = new AdminService();

// ─── Dashboard ───
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const stats = await service.getDashboardStats();
    res.json({ success: true, ...stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Companies ───
export const getCompanies = async (_req: Request, res: Response) => {
  try {
    const companies = await service.getCompanies();
    res.json({ success: true, companies });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyCompany = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid company ID" });
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "Status is required" });
    const company = await service.verifyCompany(id, status);
    res.json({ success: true, company });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Students ───
export const getStudents = async (req: Request, res: Response) => {
  try {
    const isActive = req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined;
    const students = await service.getStudents({ isActive });
    res.json({ success: true, students });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudentAnalytics = async (_req: Request, res: Response) => {
  try {
    const analytics = await service.getStudentAnalytics();
    res.json({ success: true, ...analytics });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCompanyAnalytics = async (_req: Request, res: Response) => {
  try {
    const analytics = await service.getCompanyAnalytics();
    res.json({ success: true, ...analytics });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Jobs ───
export const getPendingJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await service.getPendingJobs();
    res.json({ success: true, jobs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveJob = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid job ID" });
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "Status is required" });
    const job = await service.approveJob(id, status);
    res.json({ success: true, job });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid job ID" });
    await service.deleteJob(id);
    res.json({ success: true, message: "Job deleted" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Announcements ───
export const getAnnouncements = async (_req: Request, res: Response) => {
  try {
    const announcements = await service.getAnnouncements();
    res.json({ success: true, announcements });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: "Title and content are required" });
    const announcement = await service.createAnnouncement({ title, content, createdBy: req.user!.id });
    res.status(201).json({ success: true, announcement });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid announcement ID" });
    const { title, content } = req.body;
    const announcement = await service.updateAnnouncement(id, { title, content });
    res.json({ success: true, announcement });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid announcement ID" });
    await service.deleteAnnouncement(id);
    res.json({ success: true, message: "Announcement deleted" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Headlines ───
export const getHeadlines = async (_req: Request, res: Response) => {
  try {
    const headlines = await service.getHeadlines();
    res.json({ success: true, headlines });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createHeadline = async (req: Request, res: Response) => {
  try {
    const { company, headline, date } = req.body;
    if (!company || !headline) return res.status(400).json({ success: false, message: "Company and headline are required" });
    const h = await service.createHeadline({ company, headline, date: date ? new Date(date) : undefined });
    res.status(201).json({ success: true, headline: h });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteHeadline = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid headline ID" });
    await service.deleteHeadline(id);
    res.json({ success: true, message: "Headline deleted" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Internal: Students list ───
export const getInternalStudents = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 500;
    const isActive = req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined;
    const students = await service.getStudentsForInternal(limit, isActive);
    res.json({ students, count: students.length });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Internal: Student profile by ID ───
export const getInternalStudentProfile = async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    if (isNaN(studentId)) return res.status(400).json({ success: false, error: "Invalid student ID" });
    const student = await service.getStudentProfileById(studentId);
    res.json(student);
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
};

// ─── Internal: Open job postings ───
export const getOpenJobPostings = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 200;
    const jobs = await service.getOpenJobPostings(limit);
    res.json({ jobs, count: jobs.length });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
