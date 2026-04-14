import swaggerJsdoc from "swagger-jsdoc";
import { PORT } from "./index";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Placement Portal API",
      version: "1.0.0",
      description:
        "API documentation for the Placement Portal Backend — managing students, companies, job postings, ATS reports, and job intelligence.",
      contact: {
        name: "Hactopians Team",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from login/register",
        },
        InternalToken: {
          type: "apiKey",
          in: "header",
          name: "x-internal-token",
          description:
            "Internal service-to-service authentication token (used by AI orchestrator)",
        },
      },
      schemas: {
        // ─── Error Responses ───
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },

        // ─── Auth DTOs ───
        StudentRegisterInput: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: {
              type: "string",
              minLength: 1,
              example: "John",
            },
            lastName: {
              type: "string",
              minLength: 1,
              example: "Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john.doe@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "securePass123",
            },
            phone: { type: "string", example: "+919876543210" },
            rollNo: { type: "string", example: "21CS001" },
            collegeId: { type: "integer", example: 1 },
            graduationYear: { type: "integer", example: 2026 },
            skills: {
              type: "array",
              items: { type: "string" },
              example: ["JavaScript", "React", "Node.js"],
            },
            portfolioUrl: {
              type: "string",
              format: "uri",
              example: "https://johndoe.dev",
            },
            linkedinUrl: {
              type: "string",
              format: "uri",
              example: "https://linkedin.com/in/johndoe",
            },
            activeBacklogs: { type: "boolean", example: false },
          },
        },

        CompanyRegisterInput: {
          type: "object",
          required: ["companyName", "email", "password"],
          properties: {
            companyName: { type: "string", example: "Acme Corp" },
            email: {
              type: "string",
              format: "email",
              example: "hr@acmecorp.com",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "securePass123",
            },
            websiteUrl: {
              type: "string",
              format: "uri",
              example: "https://acmecorp.com",
            },
          },
        },

        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john.doe@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "securePass123",
            },
          },
        },

        // ─── Student DTOs ───
        UpdateProfileInput: {
          type: "object",
          properties: {
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            phone: { type: "string", example: "+919876543210" },
            rollNo: { type: "string", example: "21CS001" },
            graduationYear: { type: "integer", example: 2026 },
            skills: {
              type: "array",
              items: { type: "string" },
              example: ["TypeScript", "Python"],
            },
            portfolioUrl: {
              type: "string",
              format: "uri",
              example: "https://johndoe.dev",
            },
            linkedinUrl: {
              type: "string",
              format: "uri",
              example: "https://linkedin.com/in/johndoe",
            },
            activeBacklogs: { type: "boolean", example: false },
            gender: { type: "string", example: "Male" },
            dob: { type: "string", format: "date", example: "2003-05-15" },
            city: { type: "string", example: "Delhi" },
            degree: { type: "string", example: "B.Tech" },
            branch: { type: "string", example: "Computer Science" },
            cgpa: { type: "number", format: "float", example: 8.6 },
            jobRoleInterest: { type: "string", example: "Full Stack Developer" },
            preferredJobType: { type: "string", example: "Full-time" },
            workMode: { type: "string", example: "Remote" },
            githubUrl: { type: "string", format: "uri", example: "https://github.com/johndoe" },
            coverLetterTemplate: { type: "string", example: "Dear Hiring Manager..." },
            otherLinks: { type: "array", items: { type: "string" }, example: ["https://portfolio.dev"] },
            expectedStipend: { type: "string", example: "30000-50000" },
            preferredLocations: { type: "array", items: { type: "string" }, example: ["Bangalore", "Remote"] },
            availability: { type: "string", example: "Immediate" },
          },
        },

        WorkExperienceInput: {
          type: "object",
          required: ["company", "role"],
          properties: {
            company: { type: "string", example: "Acme Corp" },
            role: { type: "string", example: "Software Engineer Intern" },
            duration: { type: "string", example: "Jun 2025 - Present" },
            description: { type: "string", example: "Developed REST APIs and React components" },
          },
        },

        StudentProjectInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", example: "Alumni Portal" },
            description: { type: "string", example: "A portal for alumni to connect" },
            techStack: { type: "array", items: { type: "string" }, example: ["React", "Node.js", "PostgreSQL"] },
            link: { type: "string", format: "uri", example: "https://github.com/johndoe/alumni-portal" },
          },
        },

        // ─── Model Responses ───
        Student: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            email: { type: "string", example: "john.doe@example.com" },
            phone: { type: "string", nullable: true, example: "+919876543210" },
            rollNo: { type: "string", nullable: true, example: "21CS001" },
            collegeId: { type: "integer", nullable: true, example: 1 },
            portfolioUrl: {
              type: "string",
              nullable: true,
              example: "https://johndoe.dev",
            },
            graduationYear: { type: "integer", nullable: true, example: 2026 },
            resumeUrl: { type: "string", nullable: true },
            profilePitch: { type: "string", nullable: true },
            linkedinUrl: {
              type: "string",
              nullable: true,
              example: "https://linkedin.com/in/johndoe",
            },
            skills: {
              type: "array",
              items: { type: "string" },
              example: ["JavaScript", "React"],
            },
            isPlaced: { type: "boolean", example: false },
            activeBacklogs: { type: "boolean", example: false },
            isActive: { type: "boolean", example: true },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Company: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            companyName: { type: "string", example: "Acme Corp" },
            email: { type: "string", example: "hr@acmecorp.com" },
            websiteUrl: { type: "string", nullable: true },
            logoUrl: { type: "string", nullable: true },
            description: { type: "string", nullable: true },
            industry: { type: "string", nullable: true },
            location: { type: "string", nullable: true },
            verificationStatus: { type: "string", example: "pending" },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        ResumeData: {
          type: "object",
          properties: {
            id: { type: "string", example: "1" },
            studentId: { type: "string", example: "1" },
            fileName: { type: "string", example: "resume.pdf" },
            fileUrl: { type: "string", example: "https://res.cloudinary.com/..." },
            fileSize: { type: "integer", example: 0 },
            uploadedAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        ResumeATSRun: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            resumeUrl: { type: "string" },
            resumeId: { type: "integer", nullable: true },
            overallScore: { type: "number", format: "float", example: 78.5 },
            summary: { type: "string", nullable: true },
            strengths: {
              type: "array",
              items: { type: "string" },
              example: ["Strong technical skills", "Clean formatting"],
            },
            weaknesses: {
              type: "array",
              items: { type: "string" },
              example: ["Missing quantifiable achievements"],
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              example: ["Add metrics to work experience"],
            },
            keywordMatch: { type: "object" },
            modelUsed: { type: "string", example: "gpt-4" },
            success: { type: "boolean", example: true },
            error: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Job Intelligence ───
        JobIntelligenceBulkInput: {
          type: "object",
          required: ["jobs"],
          properties: {
            jobs: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "title",
                  "company",
                  "source",
                  "apply_link",
                  "final_score",
                  "score_breakdown",
                ],
                properties: {
                  job_id: { type: "string", nullable: true },
                  company: { type: "string", example: "Google" },
                  title: {
                    type: "string",
                    example: "Software Engineer Intern",
                  },
                  description: { type: "string", nullable: true },
                  skills: {
                    type: "array",
                    items: { type: "string" },
                    example: ["Python", "ML"],
                  },
                  experience_range: { type: "string", nullable: true },
                  job_type: {
                    type: "string",
                    nullable: true,
                    example: "Full-Time",
                  },
                  location: {
                    type: "string",
                    nullable: true,
                    example: "Bangalore",
                  },
                  min_salary: { type: "number", nullable: true },
                  max_salary: { type: "number", nullable: true },
                  currency: { type: "string", nullable: true, example: "INR" },
                  company_rating: { type: "number", nullable: true },
                  reviews_count: { type: "integer", nullable: true },
                  apply_link: {
                    type: "string",
                    example: "https://careers.google.com/...",
                  },
                  source: { type: "string", example: "linkedin" },
                  final_score: {
                    type: "number",
                    format: "float",
                    example: 0.92,
                  },
                  score_breakdown: { type: "object" },
                  why_selected: { type: "string", nullable: true },
                },
              },
            },
          },
        },

        // ─── ATS Report Input ───
        ATSReportInput: {
          type: "object",
          required: ["student_id", "resume_url", "ats_report"],
          properties: {
            student_id: { type: "integer", example: 1 },
            resume_id: { type: "integer", nullable: true },
            resume_url: {
              type: "string",
              example: "https://res.cloudinary.com/.../resume.pdf",
            },
            ats_report: {
              type: "object",
              required: ["ats_score"],
              properties: {
                ats_score: { type: "number", example: 78.5 },
                score_breakdown: { type: "object" },
                summary_feedback: { type: "string" },
                strengths: {
                  type: "array",
                  items: { type: "string" },
                },
                improvements: {
                  type: "array",
                  items: { type: "string" },
                },
                recommendations: {
                  type: "array",
                  items: { type: "string" },
                },
                keyword_match: { type: "object" },
                model_used: { type: "string", example: "gpt-4" },
                success: { type: "boolean", example: true },
                error: { type: "string", nullable: true },
              },
            },
          },
        },

        // ─── Job Posting ───
        JobPosting: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            companyId: { type: "integer", example: 1 },
            title: { type: "string", example: "Software Engineer" },
            description: { type: "string", example: "Build scalable backend systems" },
            location: { type: "string", nullable: true, example: "Bangalore" },
            jobType: { type: "string", nullable: true, example: "Full-Time" },
            salary: { type: "string", nullable: true, example: "8-12 LPA" },
            seats: { type: "integer", nullable: true, example: 5 },
            eligibility: { type: "string", nullable: true },
            deadline: { type: "string", format: "date-time", nullable: true },
            status: { type: "string", example: "active" },
            createdAt: { type: "string", format: "date-time" },
            company: { $ref: "#/components/schemas/Company" },
          },
        },
        CreateJobInput: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: { type: "string", example: "Software Engineer" },
            description: { type: "string", example: "Build scalable backend systems" },
            location: { type: "string", example: "Bangalore" },
            jobType: { type: "string", example: "Full-Time" },
            salary: { type: "string", example: "8-12 LPA" },
            seats: { type: "integer", example: 5 },
            eligibility: { type: "string", example: "B.Tech CS/IT, CGPA > 7.0" },
            deadline: { type: "string", format: "date-time" },
          },
        },
        UpdateJobInput: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            location: { type: "string" },
            jobType: { type: "string" },
            salary: { type: "string" },
            seats: { type: "integer" },
            eligibility: { type: "string" },
            deadline: { type: "string", format: "date-time" },
          },
        },

        // ─── Saved Job ───
        SavedJob: {
          type: "object",
          properties: {
            id: { type: "integer" },
            studentId: { type: "integer" },
            jobId: { type: "integer" },
            savedAt: { type: "string", format: "date-time" },
            job: { $ref: "#/components/schemas/JobPosting" },
          },
        },

        // ─── Job Intelligence Job ───
        JobIntelligenceJob: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            companyName: { type: "string" },
            location: { type: "string", nullable: true },
            jobType: { type: "string", nullable: true },
            source: { type: "string" },
            applyLink: { type: "string" },
            description: { type: "string", nullable: true },
            finalScore: { type: "number" },
            scoreBreakdown: { type: "object" },
            runId: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Announcement ───
        Announcement: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string", example: "Placement Drive 2025" },
            content: { type: "string", example: "All eligible students must register..." },
            createdBy: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Headline ───
        Headline: {
          type: "object",
          properties: {
            id: { type: "integer" },
            company: { type: "string", example: "Google" },
            headline: { type: "string", example: "Google hires 20 students from campus" },
            date: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Student Match Result ───
        StudentMatchResult: {
          type: "object",
          properties: {
            id: { type: "integer" },
            runId: { type: "integer" },
            studentId: { type: "integer" },
            jobId: { type: "integer" },
            jobSource: { type: "string", example: "job_intelligence" },
            matchScore: { type: "number", example: 0.87 },
            skillMatchScore: { type: "number", nullable: true },
            atsScore: { type: "number", nullable: true },
            matchedSkills: { type: "array", items: { type: "string" } },
            missingSkills: { type: "array", items: { type: "string" } },
            reasoning: { type: "object", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Student Job Approval ───
        StudentJobApproval: {
          type: "object",
          properties: {
            id: { type: "integer" },
            studentId: { type: "integer" },
            jobSource: { type: "string" },
            jobId: { type: "integer" },
            approvedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description:
          "Authentication & registration endpoints for students, companies, admins, and super admins",
      },
      {
        name: "Student",
        description:
          "Student profile management, resume operations, and ATS report access",
      },
      {
        name: "Jobs",
        description:
          "Job posting management — companies create, students browse & apply",
      },
      {
        name: "Applications",
        description:
          "Job application viewing and status management",
      },
      {
        name: "Company",
        description:
          "Company profile, dashboard stats, job management, and analytics",
      },
      {
        name: "Admin",
        description:
          "Admin dashboard, company verification, student analytics, job approvals, announcements, and headlines",
      },
      {
        name: "Student Matching",
        description:
          "AI-powered student-job matching — eligible students, approvals, batch match runs",
      },
      {
        name: "Job Intelligence",
        description:
          "Job intelligence data ingestion and browsing (internal & student-facing)",
      },
      {
        name: "ATS Reports",
        description:
          "Internal endpoints for creating ATS resume analysis reports (service-to-service)",
      },
      {
        name: "Internal",
        description:
          "Service-to-service endpoints for AI orchestrator (students, job postings)",
      },
    ],
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
