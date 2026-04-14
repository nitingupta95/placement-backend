import { Request, Response } from "express";
import prisma from "../../db/prismaClient";

// ─── Helper: get job expiry preferences from SuperAdmin ───
async function getJobExpiryPreferences() {
  const admin = await prisma.superAdmin.findFirst({
    select: { jobActiveDays: true, jobInactiveDays: true },
  });
  return {
    activeDays: admin?.jobActiveDays ?? 3,
    inactiveDays: admin?.jobInactiveDays ?? 4,
  };
}

// Python sends snake_case fields
interface PythonJobInput {
  job_id?: string | null;
  company: string;
  title: string;
  description?: string | null;
  skills?: string[];
  experience_range?: string | null;
  job_type?: string | null;
  location?: string | null;
  min_salary?: number | null;
  max_salary?: number | null;
  currency?: string | null;
  company_rating?: number | null;
  reviews_count?: number | null;
  apply_link: string;
  source: string;
  final_score: number;
  score_breakdown: any;
  why_selected?: string;
}

interface BulkCreateJobsRequest {
  jobs: PythonJobInput[];
}

export const bulkCreateJobs = async (req: Request, res: Response) => {
  try {
    console.log("[JobIntelligence] Received request");
    console.log("[JobIntelligence] Headers:", req.headers);
    console.log("[JobIntelligence] Body keys:", Object.keys(req.body));
    console.log("[JobIntelligence] Body:", JSON.stringify(req.body, null, 2));

    const { jobs } = req.body as BulkCreateJobsRequest;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      console.log("[JobIntelligence] Invalid jobs array - jobs:", jobs);
      return res.status(400).json({ error: "Invalid or empty jobs array" });
    }

    // Create a new JobIntelligenceRun
    const run = await prisma.jobIntelligenceRun.create({
      data: {
        runType: "EXTERNAL_MARKET_SCAN",
        totalJobs: jobs.length,
      },
    });

    // Prepare job intelligence records - map snake_case to camelCase
    const jobRecords = jobs.map((job) => ({
      title: job.title,
      companyName: job.company,
      location: job.location || null,
      jobType: job.job_type || null,
      source: job.source,
      applyLink: job.apply_link,
      finalScore: job.final_score,
      scoreBreakdown: job.score_breakdown,
      description: job.description || null,
      runId: run.id,
    }));

    console.log(
      `[JobIntelligence] Preparing to insert ${jobRecords.length} jobs`,
    );

    // Bulk create all jobs
    const result = await prisma.jobIntelligence.createMany({
      data: jobRecords,
      skipDuplicates: false,
    });

    console.log(
      `[JobIntelligence] Saved ${result.count} jobs for run_id=${run.id}`,
    );

    return res.status(200).json({
      saved: result.count,
      run_id: run.id,
    });
  } catch (error) {
    console.error("[JobIntelligence] Error:", error);
    return res.status(500).json({
      error: "Failed to persist jobs",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ─── Get latest job intelligence run ───
export const getLatestRun = async (_req: Request, res: Response) => {
  try {
    const run = await prisma.jobIntelligenceRun.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        jobs: { orderBy: { finalScore: "desc" } },
      },
    });
    if (!run) return res.status(404).json({ error: "No runs found" });
    return res.json({ run });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch latest run",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ─── Get a specific run by ID ───
export const getRunById = async (req: Request, res: Response) => {
  try {
    const runId = parseInt(req.params.runId);
    if (isNaN(runId)) return res.status(400).json({ error: "Invalid run ID" });
    const run = await prisma.jobIntelligenceRun.findUnique({
      where: { id: runId },
      include: {
        jobs: { orderBy: { finalScore: "desc" } },
      },
    });
    if (!run) return res.status(404).json({ error: "Run not found" });
    return res.json({ run });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch run",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ─── Student-facing: browse latest job intelligence results ───
export const getStudentJobIntelligence = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const run = await prisma.jobIntelligenceRun.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!run) return res.json({ jobs: [], total: 0, page, limit });

    const [jobs, total] = await Promise.all([
      prisma.jobIntelligence.findMany({
        where: { runId: run.id },
        orderBy: { finalScore: "desc" },
        skip,
        take: limit,
      }),
      prisma.jobIntelligence.count({ where: { runId: run.id } }),
    ]);

    return res.json({ jobs, total, page, limit, runId: run.id, runDate: run.createdAt });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch job intelligence",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ─── Get all scraped jobs from ScrapedJob table with active/inactive zones ───
export const getScrapedJobs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || "";
    const statusFilter = (req.query.status as string) || ""; // "active", "inactive", or "" for all

    const { activeDays, inactiveDays } = await getJobExpiryPreferences();

    const now = new Date();
    const activeThreshold = new Date(now.getTime() - activeDays * 24 * 60 * 60 * 1000);
    const expiredThreshold = new Date(now.getTime() - (activeDays + inactiveDays) * 24 * 60 * 60 * 1000);

    // Delete fully expired jobs (older than activeDays + inactiveDays)
    await prisma.scrapedJob.deleteMany({
      where: { scraped_at: { lt: expiredThreshold } },
    });

    const searchFilter = search
      ? {
          OR: [
            { job_title: { contains: search, mode: "insensitive" as const } },
            { company: { contains: search, mode: "insensitive" as const } },
            { location: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Build zone filter
    let zoneFilter = {};
    if (statusFilter === "active") {
      zoneFilter = { scraped_at: { gte: activeThreshold } };
    } else if (statusFilter === "inactive") {
      zoneFilter = { scraped_at: { lt: activeThreshold, gte: expiredThreshold } };
    }

    const where = { ...searchFilter, ...zoneFilter };

    const [jobs, total] = await Promise.all([
      prisma.scrapedJob.findMany({
        where,
        orderBy: { scraped_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.scrapedJob.count({ where }),
    ]);

    // Annotate each job with its zone
    const annotatedJobs = jobs.map((job: any) => ({
      ...job,
      zone: job.scraped_at >= activeThreshold ? "active" : "inactive",
    }));

    return res.json({
      jobs: annotatedJobs,
      total,
      page,
      limit,
      preferences: { activeDays, inactiveDays },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch scraped jobs",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ─── Get / Update job expiry preferences ───
export const getJobExpiryPrefs = async (_req: Request, res: Response) => {
  try {
    const prefs = await getJobExpiryPreferences();
    return res.json(prefs);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch preferences",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateJobExpiryPrefs = async (req: Request, res: Response) => {
  try {
    const { activeDays, inactiveDays } = req.body;

    if (
      (activeDays !== undefined && (!Number.isInteger(activeDays) || activeDays < 1)) ||
      (inactiveDays !== undefined && (!Number.isInteger(inactiveDays) || inactiveDays < 1))
    ) {
      return res.status(400).json({ error: "activeDays and inactiveDays must be positive integers" });
    }

    // Update the first SuperAdmin's preferences
    const admin = await prisma.superAdmin.findFirst();
    if (!admin) {
      return res.status(404).json({ error: "No admin found to update preferences" });
    }

    const updated = await prisma.superAdmin.update({
      where: { id: admin.id },
      data: {
        ...(activeDays !== undefined && { jobActiveDays: activeDays }),
        ...(inactiveDays !== undefined && { jobInactiveDays: inactiveDays }),
      },
      select: { jobActiveDays: true, jobInactiveDays: true },
    });

    return res.json({
      activeDays: updated.jobActiveDays,
      inactiveDays: updated.jobInactiveDays,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update preferences",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
