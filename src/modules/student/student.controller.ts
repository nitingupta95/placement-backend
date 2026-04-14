import { NextFunction, Request, Response } from "express";
import { StudentService } from "./student.service";
import { updateProfileDto, workExperienceDto, studentProjectDto } from "./dto/update-profile.dto";
import cloudinary, { UploadApiResponse } from "../../config/cloudinary";

const service = new StudentService();

export const getJobMatchScores = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const data = await service.getJobMatchScores(studentId);
    res.json({ success: true, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const student = await service.getProfile(studentId);
    res.json({ success: true, student });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const data = updateProfileDto.parse(req.body);
    const student = await service.updateProfile(studentId, data);
    res.json({ success: true, student });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getResume = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const resume = await service.getResume(studentId);
    res.json({ success: true, resume });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await service.deleteResume(studentId);
    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const getStudentDetails = async (req:Request, res:Response) => {
  const studentId = req.user?.id;
   if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  const data = await service.getStudentDetails(studentId);
  res.json(data);
};


export const getResumeATSRuns = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.user!.id; // from verifyToken middleware

    const runs = await service.getResumeATSRuns(studentId);

    res.json({
      success: true,
      data: runs,
    });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const stats = await service.getDashboardStats(studentId);
    res.json({ success: true, ...stats });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const applications = await service.getApplications(studentId);
    res.json({ success: true, applications });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getSavedJobs = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const savedJobs = await service.getSavedJobs(studentId);
    res.json({ success: true, savedJobs });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const saveJob = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const jobId = parseInt(req.params.jobId);
    if (isNaN(jobId)) return res.status(400).json({ success: false, message: "Invalid job ID" });
    const saved = await service.saveJob(studentId, jobId);
    res.status(201).json({ success: true, saved });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const unsaveJob = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const jobId = parseInt(req.params.jobId);
    if (isNaN(jobId)) return res.status(400).json({ success: false, message: "Invalid job ID" });
    await service.unsaveJob(studentId, jobId);
    res.json({ success: true, message: "Job removed from saved list" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Resume Upload ───
export const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const isPdf = req.file.mimetype === "application/pdf";

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "placement-portal/resumes",
            resource_type: isPdf ? "raw" : "image",
            timeout: 120000, // 2 minutes timeout for large files
          },
          (error: Error | undefined, result: UploadApiResponse | undefined) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Upload failed"));
          },
        )
        .end(req.file!.buffer);
    });

    // Update student's resume URL in database
    const studentId = req.user?.id;
    if (studentId) {
      await service.updateResumeUrl(studentId, result.secure_url);
    }

    // Get student details for LangGraph processing
    const student = studentId ? await service.getStudentById(studentId) : null;

    console.log("👤 Student data fetched:", student);
    console.log("📧 Student email:", student?.email);
    console.log("👤 Student name:", student?.firstName, student?.lastName);

    const resumeData = {
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      fileSize: req.file.size,
      uploadedAt: new Date().toISOString(),
    };

    // Send response first
    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: resumeData,
    });

    // Trigger resume processing after response is sent
    setImmediate(() => {
      if (!student?.email) {
        console.log("⚠️ Skipping LangGraph call - no student email found");
        return;
      }

      const langgraphUrl = process.env.LANGGRAPH_URL || "http://localhost:8000";
      const payload = {
        resumeId: studentId,
        studentId: studentId,
        studentEmail: student.email,
        studentName: `${student.firstName} ${student.lastName}`,
        resumeUrl: result.secure_url,
      };

      console.log("🚀 Triggering LangGraph resume processing...");
      console.log("📍 URL:", `${langgraphUrl}/run/resume-processing`);
      console.log("📦 Payload:", JSON.stringify(payload, null, 2));

      fetch(`${langgraphUrl}/run/resume-processing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(120000), // 2 minute timeout
      })
        .then(async (response) => {
          console.log("✅ LangGraph API response status:", response.status);
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            console.log("✅ LangGraph API response data:", data);
          } catch {
            console.log("✅ LangGraph API response (non-JSON):", text.slice(0, 500));
          }
        })
        .catch((error) => {
          console.error("❌ Resume processing trigger failed:", error.message || error);
        });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Resume upload failed",
      error,
    });
  }
};

// ─── Work Experience CRUD ───

export const getWorkExperiences = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const data = await service.getWorkExperiences(studentId);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const addWorkExperience = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const data = workExperienceDto.parse(req.body);
    const experience = await service.addWorkExperience(studentId, data);
    res.status(201).json({ success: true, data: experience });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateWorkExperience = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const data = workExperienceDto.partial().parse(req.body);
    const experience = await service.updateWorkExperience(id, studentId, data);
    res.json({ success: true, data: experience });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteWorkExperience = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    await service.deleteWorkExperience(id, studentId);
    res.json({ success: true, message: "Work experience deleted" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Projects CRUD ───

export const getProjects = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const data = await service.getProjects(studentId);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const addProject = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const data = studentProjectDto.parse(req.body);
    const project = await service.addProject(studentId, data);
    res.status(201).json({ success: true, data: project });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const data = studentProjectDto.partial().parse(req.body);
    const project = await service.updateProject(id, studentId, data);
    res.json({ success: true, data: project });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    await service.deleteProject(id, studentId);
    res.json({ success: true, message: "Project deleted" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};