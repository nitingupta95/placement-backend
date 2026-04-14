import { ApplicationRepository } from "./application.repository";
import { scheduleJobReminderNotification } from "../../services/notification.service";
import prisma from "../../db/prismaClient";
import { StudentRepository } from "../student/student.repository";

const repo = new ApplicationRepository();
const studentRepo = new StudentRepository();

export class ApplicationService {
  async getApplicationById(id: number) {
    const app = await repo.findById(id);
    if (!app) throw new Error("Application not found");
    return app;
  }

  async updateApplicationStatus(
    applicationId: number,
    status: string,
    companyId: number,
    role: string
  ) {
    const validStatuses = ["pending", "shortlisted", "interview", "offered", "rejected"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const app = await repo.findById(applicationId);
    if (!app) throw new Error("Application not found");

    // Companies can only update their own job applications
    if (role === "COMPANY" && app.jobPosting.companyId !== companyId) {
      throw new Error("You can only update applications for your own jobs");
    }

    return repo.updateStatus(applicationId, status);
  }

  async setJobReminder(
    applicationId: number,
    studentId: number,
    reminderMinutes: number | null,
    reminderEnabled: boolean
  ) {
    const app = await repo.findById(applicationId);
    if (!app) throw new Error("Application not found");

    // Verify the application belongs to the student
    if (app.studentId !== studentId) {
      throw new Error("Unauthorized: This application does not belong to you");
    }

    // When enabling, minutes must be provided and be one of {5, 15}
    if (reminderEnabled) {
      if (reminderMinutes == null) {
        throw new Error("reminderMinutes is required when enabling a reminder");
      }
      if (![5, 15].includes(reminderMinutes)) {
        throw new Error("Reminder must be set to 5 or 15 minutes");
      }
    }

    // Persist the reminder settings
    const updated = await repo.updateReminder(
      applicationId,
      reminderEnabled ? reminderMinutes : null,
      reminderEnabled
    );

    // ── Schedule (or skip) the OneSignal notification ──────────────────────
    if (reminderEnabled && reminderMinutes != null) {
      try {
        // Get student to access their external ID (email)
        const student = await studentRepo.findById(studentId);
        if (!student) {
          // This should ideally not happen if the application exists
          throw new Error("Student not found for this application");
        }

        // Get SuperAdmin's jobActiveDays (how long a job stays active)
        const admin = await prisma.superAdmin.findFirst({
          select: { jobActiveDays: true },
        });
        const activeDays = admin?.jobActiveDays ?? 3;

        // Calculate when the job goes inactive
        const postedOn = new Date(app.jobPosting.postedOn);
        const inactiveAt = new Date(
          postedOn.getTime() + activeDays * 24 * 60 * 60 * 1000,
        );

        // Reminder fires `reminderMinutes` before inactive
        const reminderAt = new Date(
          inactiveAt.getTime() - reminderMinutes * 60 * 1000,
        );

        // Only schedule if the reminder time is in the future
        if (reminderAt.getTime() > Date.now()) {
          await scheduleJobReminderNotification({
            studentExternalIds: [student.email], // Use email as the external ID
            jobTitle: app.jobPosting.title,
            company: app.jobPosting.company.companyName,
            reminderMinutes,
            sendAfter: reminderAt.toISOString(),
          });
          console.log(
            `[Reminder] Scheduled notification for app ${applicationId} ` +
            `at ${reminderAt.toISOString()} (${reminderMinutes}m before inactive)`,
          );
        } else {
          console.warn(
            `[Reminder] reminderAt ${reminderAt.toISOString()} is in the past — skipping notification`,
          );
        }
      } catch (err) {
        // Log but do NOT fail the request — the reminder setting is saved,
        // even if OneSignal had a transient issue.
        console.error('[Reminder] Failed to schedule OneSignal notification:', err);
      }
    }

    return updated;
  }

  async getStudentApplications(studentId: number) {
    return repo.findByStudentId(studentId);
  }
}
