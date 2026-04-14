import { AdminRepository } from "./admin.repository";

const repo = new AdminRepository();

export class AdminService {
  async getDashboardStats() {
    return repo.getDashboardStats();
  }

  async getCompanies() {
    return repo.getCompanies();
  }

  async verifyCompany(id: number, status: string) {
    const validStatuses = ["verified", "rejected", "pending"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }
    return repo.verifyCompany(id, status);
  }

  async getStudents(filters: { isActive?: boolean } = {}) {
    return repo.getStudents(filters);
  }

  async getStudentAnalytics() {
    return repo.getStudentAnalytics();
  }

  async getCompanyAnalytics() {
    return repo.getCompanyAnalytics();
  }

  async getPendingJobs() {
    return repo.getPendingJobs();
  }

  async approveJob(jobId: number, status: string) {
    const validStatuses = ["open", "approved", "rejected", "closed"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }
    return repo.updateJobStatus(jobId, status);
  }

  async deleteJob(jobId: number) {
    return repo.deleteJob(jobId);
  }

  // ─── Announcements ───
  async getAnnouncements() {
    return repo.getAnnouncements();
  }

  async createAnnouncement(data: { title: string; content: string; createdBy: number }) {
    return repo.createAnnouncement(data);
  }

  async updateAnnouncement(id: number, data: { title?: string; content?: string }) {
    return repo.updateAnnouncement(id, data);
  }

  async deleteAnnouncement(id: number) {
    return repo.deleteAnnouncement(id);
  }

  // ─── Headlines ───
  async getHeadlines() {
    return repo.getHeadlines();
  }

  async createHeadline(data: { company: string; headline: string; date?: Date }) {
    return repo.createHeadline(data);
  }

  async deleteHeadline(id: number) {
    return repo.deleteHeadline(id);
  }

  // ─── Internal ───
  async getStudentsForInternal(limit: number, isActive?: boolean) {
    return repo.getStudentsForInternal(limit, isActive);
  }

  async getStudentProfileById(studentId: number) {
    const student = await repo.getStudentProfileById(studentId);
    if (!student) throw new Error("Student not found");
    return student;
  }

  async getOpenJobPostings(limit: number) {
    return repo.getOpenJobPostings(limit);
  }
}
