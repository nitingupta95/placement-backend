import { Request, Response } from "express";
import { CompanyService } from "./company.service";
import { z } from "zod";
import cloudinary, { UploadApiResponse } from "../../config/cloudinary";

const service = new CompanyService();

const updateCompanyDto = z.object({
  companyName: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
});

export const getProfile = async (req: Request, res: Response) => {
  try {
    const companyId = req.user!.id;
    const company = await service.getProfile(companyId);
    res.json({ success: true, company });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const companyId = req.user!.id;
    const data = updateCompanyDto.parse(req.body);
    const company = await service.updateProfile(companyId, data);
    res.json({ success: true, company });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const companyId = req.user!.id;
    const stats = await service.getDashboardStats(companyId);
    res.json({ success: true, ...stats });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getCompanyJobs = async (req: Request, res: Response) => {
  try {
    const companyId = req.user!.id;
    const jobs = await service.getCompanyJobs(companyId);
    res.json({ success: true, jobs });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const companyId = req.user!.id;
    const analytics = await service.getAnalytics(companyId);
    res.json({ success: true, ...analytics });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Logo / Profile File Upload ───
export const uploadLogo = async (req: Request, res: Response) => {
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
            folder: "placement-portal/company-logos",
            resource_type: isPdf ? "raw" : "image",
          },
          (error: Error | undefined, result: UploadApiResponse | undefined) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Upload failed"));
          },
        )
        .end(req.file!.buffer);
    });

    const companyId = req.user!.id;
    await service.updateLogoUrl(companyId, result.secure_url);

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        fileName: req.file.originalname,
        fileUrl: result.secure_url,
        fileSize: req.file.size,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "File upload failed",
      error,
    });
  }
};
