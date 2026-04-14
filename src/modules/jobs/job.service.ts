import { JobRepository } from "./job.repository";
import { CreateJobInput, UpdateJobInput } from "./dto/job.dto";

const repo = new JobRepository();

export class JobService {
  async listJobs(role: string, userId: number) {
    if (role === "COMPANY") {
      return repo.findAll({ companyId: userId });
    }
    if (role === "STUDENT") {
      return repo.findAll({ status: "open" });
    }
    // ADMIN / SUPERADMIN see everything
    return repo.findAll();
  }

  async getJobById(id: number) {
    const job = await repo.findById(id);
    if (!job) throw new Error("Job not found");
    return job;
  }

  async createJob(companyId: number, data: CreateJobInput) {
    return repo.create({ ...data, companyId });
  }

  async updateJob(jobId: number, companyId: number, role: string, data: UpdateJobInput) {
    const job = await repo.findById(jobId);
    if (!job) throw new Error("Job not found");
    if (role === "COMPANY" && job.companyId !== companyId) {
      throw new Error("You can only update your own job postings");
    }
    return repo.update(jobId, data);
  }

  async deleteJob(jobId: number, userId: number, role: string) {
    const job = await repo.findById(jobId);
    if (!job) throw new Error("Job not found");
    if (role === "COMPANY" && job.companyId !== userId) {
      throw new Error("You can only delete your own job postings");
    }
    return repo.delete(jobId);
  }

  async updateJobStatus(jobId: number, status: string) {
    const job = await repo.findById(jobId);
    if (!job) throw new Error("Job not found");
    return repo.update(jobId, { status });
  }

  async applyToJob(studentId: number, jobId: number) {
    const job = await repo.findById(jobId);
    if (!job) throw new Error("Job not found");
    if (job.status !== "open") throw new Error("Job is no longer accepting applications");

    const existing = await repo.findApplicationByStudentAndJob(studentId, jobId);
    if (existing) throw new Error("You have already applied to this job");

    const applicationCount = await repo.countApplicationsForJob(jobId);
    if (applicationCount >= job.noOfSeats) {
      throw new Error("All seats for this job are filled");
    }

    return repo.createApplication(studentId, jobId);
  }

  async getApplicationsForJob(jobId: number, companyId: number, role: string) {
    const job = await repo.findById(jobId);
    if (!job) throw new Error("Job not found");
    if (role === "COMPANY" && job.companyId !== companyId) {
      throw new Error("You can only view applications for your own jobs");
    }
    return repo.findApplicationsByJob(jobId);
  }
}
