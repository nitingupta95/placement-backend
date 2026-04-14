import { StudentRepository } from "./student.repository";
import { UpdateProfileInput, WorkExperienceInput, StudentProjectInput } from "./dto/update-profile.dto";
import { matchOnCampusJob, matchOffCampusJob, StudentProfile, OnCampusMatchResult, OffCampusMatchResult } from "./job-match.util";

const repo = new StudentRepository();

export class StudentService {
  async getProfile(studentId: number) {
    const student = await repo.findById(studentId);
    if (!student) throw new Error("Student not found");

    // Remove password from response
    const { password, ...studentData } = student;
    return studentData;
  }

  async updateProfile(studentId: number, data: UpdateProfileInput) {
    // If dob is provided as string, convert to Date
    const updateData: any = { ...data };
    if (data.dob) {
      updateData.dob = new Date(data.dob);
    }

    const student = await repo.updateStudent(studentId, updateData);

    // Remove password from response
    const { password, ...studentData } = student;
    return studentData;
  }

  async getResume(studentId: number) {
    const student = await repo.findById(studentId);
    if (!student) throw new Error("Student not found");

    if (!student.resumeUrl) {
      return null;
    }

    // Extract filename from URL
    const urlParts = student.resumeUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];

    return {
      id: student.id.toString(),
      studentId: student.id.toString(),
      fileName: fileName || "resume.pdf",
      fileUrl: student.resumeUrl,
      fileSize: 0, // We don't store file size, set to 0
      uploadedAt: student.createdAt.toISOString(),
      updatedAt: student.createdAt.toISOString(),
    };
  }

  async deleteResume(studentId: number) {
    await repo.updateStudent(studentId, { resumeUrl: null });
  }

  async updateResumeUrl(studentId: number, resumeUrl: string) {
    return repo.updateResumeUrl(studentId, resumeUrl);
  }

  async getStudentById(studentId: number) {
    return repo.findById(studentId);
  }

  async getStudentDetails(studentId: number) {
    const student = await repo.findStudentDetails(studentId);
    if (!student) throw new Error("Student not found");

    const { password, ...safeStudent } = student;
    return safeStudent;
  }


  async getResumeATSRuns(studentId: number) {
    return repo.getResumeATSRuns(studentId);
  }

  async getDashboardStats(studentId: number) {
    return repo.getDashboardStats(studentId);
  }

  async getApplications(studentId: number) {
    return repo.getApplications(studentId);
  }

  async getSavedJobs(studentId: number) {
    return repo.getSavedJobs(studentId);
  }

  async saveJob(studentId: number, jobId: number) {
    const existing = await repo.findSavedJob(studentId, jobId);
    if (existing) throw new Error("Job already saved");
    return repo.saveJob(studentId, jobId);
  }

  async unsaveJob(studentId: number, jobId: number) {
    const existing = await repo.findSavedJob(studentId, jobId);
    if (!existing) throw new Error("Saved job not found");
    return repo.unsaveJob(studentId, jobId);
  }

  // ─── Work Experience ───
  async getWorkExperiences(studentId: number) {
    return repo.getWorkExperiences(studentId);
  }

  async addWorkExperience(studentId: number, data: WorkExperienceInput) {
    return repo.createWorkExperience(studentId, data);
  }

  async updateWorkExperience(id: number, studentId: number, data: Partial<WorkExperienceInput>) {
    const existing = await repo.findWorkExperience(id, studentId);
    if (!existing) throw new Error("Work experience not found");
    return repo.updateWorkExperience(id, studentId, data);
  }

  async deleteWorkExperience(id: number, studentId: number) {
    const existing = await repo.findWorkExperience(id, studentId);
    if (!existing) throw new Error("Work experience not found");
    return repo.deleteWorkExperience(id, studentId);
  }

  // ─── Projects ───
  async getProjects(studentId: number) {
    return repo.getProjects(studentId);
  }

  async addProject(studentId: number, data: StudentProjectInput) {
    return repo.createProject(studentId, data);
  }

  async updateProject(id: number, studentId: number, data: Partial<StudentProjectInput>) {
    const existing = await repo.findProject(id, studentId);
    if (!existing) throw new Error("Project not found");
    return repo.updateProject(id, studentId, data);
  }

  async deleteProject(id: number, studentId: number) {
    const existing = await repo.findProject(id, studentId);
    if (!existing) throw new Error("Project not found");
    return repo.deleteProject(id, studentId);
  }

  // ─── Job Match Scores ───
  async getJobMatchScores(studentId: number) {
    const [student, jobPostings, scrapedJobs] = await Promise.all([
      repo.getStudentForMatching(studentId),
      repo.getAllJobPostings(),
      repo.getAllScrapedJobs(),
    ]);

    if (!student) throw new Error("Student not found");

    const profile: StudentProfile = {
      skills: student.skills,
      jobRoleInterest: student.jobRoleInterest,
      degree: student.degree,
      branch: student.branch,
      preferredLocations: student.preferredLocations,
      workExperiences: student.workExperiences,
      projects: student.projects,
    };

    const onCampusJobs: OnCampusMatchResult[] = (jobPostings as any[])
      .map((job: any) => matchOnCampusJob(profile, job))
      .sort((a: OnCampusMatchResult, b: OnCampusMatchResult) => b.matchScore - a.matchScore);

    const offCampusJobs: OffCampusMatchResult[] = (scrapedJobs as any[])
      .map((job: any) => matchOffCampusJob(profile, job))
      .sort((a: OffCampusMatchResult, b: OffCampusMatchResult) => b.matchScore - a.matchScore);

    return { onCampusJobs, offCampusJobs };
  }
}


