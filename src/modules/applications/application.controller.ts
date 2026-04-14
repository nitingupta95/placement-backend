import { Request, Response } from "express";
import { ApplicationService } from "./application.service";

const service = new ApplicationService();

export const getApplication = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid application ID" });
    const application = await service.getApplicationById(id);
    res.json({ success: true, application });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid application ID" });
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "Status is required" });

    const application = await service.updateApplicationStatus(
      id,
      status,
      req.user!.id,
      req.user!.role
    );
    res.json({ success: true, application });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const setJobReminder = async (req: Request, res: Response) => {
  try {
    const applicationId = parseInt(req.params.id);
    if (isNaN(applicationId)) {
      return res.status(400).json({ success: false, message: "Invalid application ID" });
    }

    const { reminderMinutes, reminderEnabled } = req.body;

    if (reminderEnabled === undefined) {
      return res.status(400).json({ success: false, message: "reminderEnabled is required" });
    }

    // Only students can set reminders for their own applications
    if (req.user!.role !== "STUDENT") {
      return res.status(403).json({ success: false, message: "Only students can set reminders" });
    }

    const application = await service.setJobReminder(
      applicationId,
      req.user!.id,
      reminderEnabled ? reminderMinutes : null,
      reminderEnabled
    );

    res.json({ success: true, message: "Reminder updated successfully", application });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

