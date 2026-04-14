import { Router } from "express";
import { getApplication, updateApplicationStatus, setJobReminder } from "./application.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { isCompany } from "../../middlewares/role.middleware";

const applicationRouter = Router();

applicationRouter.use(verifyToken);

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get application details by ID
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application details
 *       404:
 *         description: Not found
 */
applicationRouter.get("/:id", getApplication);

/**
 * @swagger
 * /applications/{id}/status:
 *   patch:
 *     summary: Update application status (Company or Admin)
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, shortlisted, interview, offered, rejected]
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Invalid status or permission denied
 */
applicationRouter.patch("/:id/status", isCompany, updateApplicationStatus);

/**
 * @swagger
 * /applications/{id}/reminder:
 *   patch:
 *     summary: Set job reminder (5 or 15 minutes before job becomes inactive)
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reminderEnabled]
 *             properties:
 *               reminderEnabled:
 *                 type: boolean
 *                 description: Enable or disable reminder
 *               reminderMinutes:
 *                 type: integer
 *                 enum: [5, 15]
 *                 description: Reminder time in minutes before job becomes inactive
 *     responses:
 *       200:
 *         description: Reminder updated
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Unauthorized
 */
applicationRouter.patch("/:id/reminder", setJobReminder);

export default applicationRouter;
