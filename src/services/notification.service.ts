import * as OneSignal from "onesignal-node";

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID!;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY!;

if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
  console.warn(
    "OneSignal environment variables (ONESIGNAL_APP_ID, ONESIGNAL_API_KEY) are not set. Push notifications will be disabled.",
  );
}

const client = new OneSignal.Client(ONESIGNAL_APP_ID, ONESIGNAL_API_KEY);

interface JobReminderPayload {
  studentExternalIds: string[];
  jobTitle: string;
  company: string;
  reminderMinutes: number;
  sendAfter: string;
}

/**
 * Schedules a push notification to remind a student about a job application deadline.
 */
export async function scheduleJobReminderNotification(
  payload: JobReminderPayload,
) {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
    console.log(
      "[Notification] Skipping job reminder notification because OneSignal is not configured.",
    );
    return;
  }

  const { studentExternalIds, jobTitle, company, reminderMinutes, sendAfter } =
    payload;

  try {
    const response = await client.createNotification({
      contents: {
        en: `Reminder: The application deadline for ${jobTitle} at ${company} is in ${reminderMinutes} minutes.`,
      },
      headings: {
        en: "Job Application Reminder",
      },
      include_external_user_ids: studentExternalIds,
      send_after: sendAfter,
    });

    console.log(
      `[Notification] Successfully scheduled job reminder for students: ${studentExternalIds.join(
        ", ",
      )}`,
      response.body,
    );
    return response;
  } catch (e) {
    console.error(
      "[Notification] Failed to schedule job reminder notification:",
      e,
    );
    // Do not re-throw, as this is a non-critical background task.
  }
}
