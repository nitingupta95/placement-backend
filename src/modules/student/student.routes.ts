import { Router } from "express";
import {
  updateProfile,
  getProfile,
  getResume,
  deleteResume,
  getStudentDetails,
  getResumeATSRuns,
  getDashboardStats,
  getApplications,
  getSavedJobs,
  saveJob,
  unsaveJob,
  uploadResume,
  getWorkExperiences,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getJobMatchScores,
} from "./student.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { isStudent } from "../../middlewares/role.middleware";
import { upload } from "../../middlewares/upload.middleware";

const studentRouter = Router();

// All student routes require authentication
studentRouter.use(verifyToken);
studentRouter.use(isStudent);

// ─── Profile Routes ───

/**
 * @swagger
 * /student/profile:
 *   get:
 *     summary: Get current student's profile
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
studentRouter.get("/profile", getProfile);

/**
 * @swagger
 * /student/profile:
 *   put:
 *     summary: Update current student's profile
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
studentRouter.put("/profile", updateProfile);

// ─── Resume Routes ───

/**
 * @swagger
 * /student/resume:
 *   get:
 *     summary: Get current student's resume details
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resume details retrieved (null if no resume uploaded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 resume:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/ResumeData'
 *                     - type: "null"
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Student not found
 */
studentRouter.get("/resume", getResume);

/**
 * @swagger
 * /student/resume:
 *   delete:
 *     summary: Delete current student's resume
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resume deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Resume deleted successfully"
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Error
 */
studentRouter.delete("/resume", deleteResume);

// ─── Student Details ───

/**
 * @swagger
 * /student/details:
 *   get:
 *     summary: Get detailed student info (includes college & ATS runs)
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Student details with college and ATS run history
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Student'
 *                 - type: object
 *                   properties:
 *                     college:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                     atsRuns:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized
 */
studentRouter.get("/details", getStudentDetails);

// ─── Resume ATS Routes ───

/**
 * @swagger
 * /student/resume/ats-runs:
 *   get:
 *     summary: Get all ATS analysis runs for the student's resume
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of ATS runs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ResumeATSRun'
 *       401:
 *         description: Unauthorized
 */
studentRouter.get("/resume/ats-runs", getResumeATSRuns);

// ─── Dashboard Stats ───

/**
 * @swagger
 * /student/dashboard/stats:
 *   get:
 *     summary: Get student dashboard statistics
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 applied:
 *                   type: integer
 *                 shortlisted:
 *                   type: integer
 *                 interviews:
 *                   type: integer
 *                 offers:
 *                   type: integer
 */
studentRouter.get("/dashboard/stats", getDashboardStats);

// ─── Applications ───

/**
 * @swagger
 * /student/applications:
 *   get:
 *     summary: Get student's job applications
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications with job details
 */
studentRouter.get("/applications", getApplications);

// ─── Saved Jobs ───

/**
 * @swagger
 * /student/saved-jobs:
 *   get:
 *     summary: Get student's saved jobs
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved jobs
 */
studentRouter.get("/saved-jobs", getSavedJobs);

/**
 * @swagger
 * /student/saved-jobs/{jobId}:
 *   post:
 *     summary: Save a job
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Job saved
 *       400:
 *         description: Already saved
 */
studentRouter.post("/saved-jobs/:jobId", saveJob);

/**
 * @swagger
 * /student/saved-jobs/{jobId}:
 *   delete:
 *     summary: Unsave a job
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job removed from saved list
 *       400:
 *         description: Not found in saved
 */
studentRouter.delete("/saved-jobs/:jobId", unsaveJob);

// ─── Resume Upload ───

/**
 * @swagger
 * /student/resume/upload:
 *   post:
 *     summary: Upload student resume
 *     description: Uploads a file to Cloudinary, updates the student's resume URL, and triggers async AI resume processing via LangGraph.
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF or image file (max 5 MB)
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Resume uploaded successfully"
 *                 resume:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                     fileUrl:
 *                       type: string
 *                     fileSize:
 *                       type: integer
 *                     uploadedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Upload failed
 */
studentRouter.post("/resume/upload", upload.single("file"), uploadResume);

// ─── Work Experience ───

/**
 * @swagger
 * /student/work-experiences:
 *   get:
 *     summary: Get student's work experiences
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of work experiences
 */
studentRouter.get("/work-experiences", getWorkExperiences);

/**
 * @swagger
 * /student/work-experiences:
 *   post:
 *     summary: Add a work experience
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkExperienceInput'
 *     responses:
 *       201:
 *         description: Work experience added
 */
studentRouter.post("/work-experiences", addWorkExperience);

/**
 * @swagger
 * /student/work-experiences/{id}:
 *   put:
 *     summary: Update a work experience
 *     tags: [Student]
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
 *             $ref: '#/components/schemas/WorkExperienceInput'
 *     responses:
 *       200:
 *         description: Work experience updated
 */
studentRouter.put("/work-experiences/:id", updateWorkExperience);

/**
 * @swagger
 * /student/work-experiences/{id}:
 *   delete:
 *     summary: Delete a work experience
 *     tags: [Student]
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
 *         description: Work experience deleted
 */
studentRouter.delete("/work-experiences/:id", deleteWorkExperience);

// ─── Projects ───

/**
 * @swagger
 * /student/projects:
 *   get:
 *     summary: Get student's projects
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 */
studentRouter.get("/projects", getProjects);

/**
 * @swagger
 * /student/projects:
 *   post:
 *     summary: Add a project
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentProjectInput'
 *     responses:
 *       201:
 *         description: Project added
 */
studentRouter.post("/projects", addProject);

/**
 * @swagger
 * /student/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Student]
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
 *             $ref: '#/components/schemas/StudentProjectInput'
 *     responses:
 *       200:
 *         description: Project updated
 */
studentRouter.put("/projects/:id", updateProject);

/**
 * @swagger
 * /student/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Student]
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
 *         description: Project deleted
 */
studentRouter.delete("/projects/:id", deleteProject);

// ─── Job Match Scores ───
studentRouter.get("/job-match-scores", getJobMatchScores);

export default studentRouter;
