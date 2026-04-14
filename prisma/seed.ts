import { PrismaClient, Permission } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting comprehensive seed...\n");

  const PASSWORD = "Test@1234";
  const hash = await bcrypt.hash(PASSWORD, 10);

  // ────────────────────────────────────────────────────
  // 1. SUPER ADMIN
  // ────────────────────────────────────────────────────
  const superAdmin = await prisma.superAdmin.upsert({
    where: { email: "superadmin@test.com" },
    update: {},
    create: {
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@test.com",
      password: hash,
      phone: "+911234567890",
      role: "SUPERADMIN",
      permissions: {
        set: [
          Permission.MANAGE_COLLEGE_VERIFICATION,
          Permission.MANAGE_COMPANY_VERIFICATION,
          Permission.MANAGE_ALL_USERS,
          Permission.VIEW_GLOBAL_ANALYTICS,
          Permission.DELETE_JOB_POSTINGS,
          Permission.MANAGE_ADMIN_ACCOUNTS,
        ],
      },
    },
  });
  console.log("✅ SuperAdmin:", superAdmin.email);

  // ────────────────────────────────────────────────────
  // 2. COLLEGE ADMINS
  // ────────────────────────────────────────────────────
  const college1 = await prisma.collegeAdmin.upsert({
    where: { email: "admin@iitdelhi.edu" },
    update: {},
    create: {
      collegeId: "IIT-DEL-001",
      name: "IIT Delhi",
      email: "admin@iitdelhi.edu",
      password: hash,
      university: "Indian Institute of Technology Delhi",
      address: "Hauz Khas, New Delhi, 110016",
      websiteUrl: "https://iitd.ac.in",
      verificationStatus: "VERIFIED",
      startYear: 1961,
      description:
        "Premier engineering institute known for cutting-edge research and innovation.",
      superAdminId: superAdmin.id,
    },
  });

  const college2 = await prisma.collegeAdmin.upsert({
    where: { email: "admin@nitw.edu" },
    update: {},
    create: {
      collegeId: "NIT-WGL-002",
      name: "NIT Warangal",
      email: "admin@nitw.edu",
      password: hash,
      university: "National Institute of Technology Warangal",
      address: "Warangal, Telangana, 506004",
      websiteUrl: "https://nitw.ac.in",
      verificationStatus: "VERIFIED",
      startYear: 1959,
      description:
        "One of the first NITs in India, renowned for engineering education.",
      superAdminId: superAdmin.id,
    },
  });
  console.log("✅ College Admins:", college1.email, "|", college2.email);

  // ────────────────────────────────────────────────────
  // 3. COMPANIES (verified, pending, rejected)
  // ────────────────────────────────────────────────────
  const companyGoogle = await prisma.company.upsert({
    where: { email: "hr@google.com" },
    update: {},
    create: {
      companyName: "Google India",
      email: "hr@google.com",
      password: hash,
      websiteUrl: "https://google.com",
      logoUrl: "https://logo.clearbit.com/google.com",
      description:
        "Multinational technology company specializing in search, cloud computing, and AI.",
      industry: "Technology",
      location: "Bangalore, Karnataka",
      verificationStatus: "verified",
      superAdminId: superAdmin.id,
    },
  });

  const companyTCS = await prisma.company.upsert({
    where: { email: "hr@tcs.com" },
    update: {},
    create: {
      companyName: "Tata Consultancy Services",
      email: "hr@tcs.com",
      password: hash,
      websiteUrl: "https://tcs.com",
      logoUrl: "https://logo.clearbit.com/tcs.com",
      description:
        "Global leader in IT services, consulting and business solutions.",
      industry: "IT Services",
      location: "Mumbai, Maharashtra",
      verificationStatus: "verified",
      superAdminId: superAdmin.id,
    },
  });

  const companyStartup = await prisma.company.upsert({
    where: { email: "hr@novatech.io" },
    update: {},
    create: {
      companyName: "NovaTech Solutions",
      email: "hr@novatech.io",
      password: hash,
      websiteUrl: "https://novatech.io",
      description: "Early-stage AI startup building next-gen recruitment tools.",
      industry: "AI / SaaS",
      location: "Hyderabad, Telangana",
      verificationStatus: "pending",
    },
  });

  const companyRejected = await prisma.company.upsert({
    where: { email: "contact@fakecorp.xyz" },
    update: {},
    create: {
      companyName: "FakeCorp",
      email: "contact@fakecorp.xyz",
      password: hash,
      description: "Flagged company — verification rejected.",
      industry: "Unknown",
      location: "Unknown",
      verificationStatus: "rejected",
    },
  });
  console.log(
    "✅ Companies:",
    [companyGoogle, companyTCS, companyStartup, companyRejected]
      .map((c) => `${c.companyName} (${c.verificationStatus})`)
      .join(" | ")
  );

  // ────────────────────────────────────────────────────
  // 4. STUDENTS (diverse profiles)
  // ────────────────────────────────────────────────────
  const student1 = await prisma.student.upsert({
    where: { email: "rahul@gmail.com" },
    update: {},
    create: {
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul@gmail.com",
      password: hash,
      phone: "+919876543210",
      rollNo: "2022CS101",
      collegeId: college1.id,
      graduationYear: 2026,
      skills: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Python",
        "PostgreSQL",
        "Docker",
      ],
      isPlaced: false,
      activeBacklogs: false,
      isActive: true,
      linkedinUrl: "https://linkedin.com/in/rahulsharma",
      portfolioUrl: "https://rahulsharma.dev",
      resumeUrl:
        "https://res.cloudinary.com/demo/raw/upload/sample_resume_rahul.pdf",
      profilePitch:
        "Full-stack developer with strong fundamentals in DSA and system design.",
      superAdminId: superAdmin.id,
    },
  });

  const student2 = await prisma.student.upsert({
    where: { email: "priya.patel@iitd.ac.in" },
    update: {},
    create: {
      firstName: "Priya",
      lastName: "Patel",
      email: "priya.patel@iitd.ac.in",
      password: hash,
      phone: "+919876543211",
      rollNo: "2022CS102",
      collegeId: college1.id,
      graduationYear: 2026,
      skills: ["Python", "Machine Learning", "TensorFlow", "Data Science", "SQL"],
      isPlaced: true,
      activeBacklogs: false,
      isActive: true,
      linkedinUrl: "https://linkedin.com/in/priyapatel",
      resumeUrl:
        "https://res.cloudinary.com/demo/raw/upload/sample_resume_priya.pdf",
      profilePitch: "ML engineer passionate about NLP and computer vision.",
      superAdminId: superAdmin.id,
    },
  });

  const student3 = await prisma.student.upsert({
    where: { email: "amit.kumar@nitw.ac.in" },
    update: {},
    create: {
      firstName: "Amit",
      lastName: "Kumar",
      email: "amit.kumar@nitw.ac.in",
      password: hash,
      phone: "+919876543212",
      rollNo: "2023ME201",
      collegeId: college2.id,
      graduationYear: 2027,
      skills: ["Java", "Spring Boot", "MySQL", "AWS"],
      isPlaced: false,
      activeBacklogs: true,
      isActive: true,
      linkedinUrl: "https://linkedin.com/in/amitkumar",
      profilePitch:
        "Backend developer with active backlogs, looking for internships.",
      superAdminId: superAdmin.id,
    },
  });

  const student4 = await prisma.student.upsert({
    where: { email: "sneha.reddy@nitw.ac.in" },
    update: {},
    create: {
      firstName: "Sneha",
      lastName: "Reddy",
      email: "sneha.reddy@nitw.ac.in",
      password: hash,
      phone: "+919876543213",
      rollNo: "2022EC103",
      collegeId: college2.id,
      graduationYear: 2026,
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Figma",
        "Node.js",
      ],
      isPlaced: false,
      activeBacklogs: false,
      isActive: true,
      linkedinUrl: "https://linkedin.com/in/snehareddy",
      portfolioUrl: "https://snehareddy.design",
      resumeUrl:
        "https://res.cloudinary.com/demo/raw/upload/sample_resume_sneha.pdf",
      profilePitch: "Frontend developer with a keen eye for UI/UX design.",
      superAdminId: superAdmin.id,
    },
  });

  const student5 = await prisma.student.upsert({
    where: { email: "vikram.singh@iitd.ac.in" },
    update: {},
    create: {
      firstName: "Vikram",
      lastName: "Singh",
      email: "vikram.singh@iitd.ac.in",
      password: hash,
      phone: "+919876543214",
      rollNo: "2021CS050",
      collegeId: college1.id,
      graduationYear: 2025,
      skills: ["Go", "Kubernetes", "Docker", "AWS", "Terraform", "Python"],
      isPlaced: false,
      activeBacklogs: false,
      isActive: false,
      linkedinUrl: "https://linkedin.com/in/vikramsingh",
      profilePitch: "DevOps & cloud engineer. Graduated but still seeking roles.",
    },
  });
  console.log(
    "✅ Students:",
    [student1, student2, student3, student4, student5]
      .map(
        (s) =>
          `${s.firstName} ${s.lastName} (placed=${s.isPlaced}, backlogs=${s.activeBacklogs})`
      )
      .join(" | ")
  );

  // ────────────────────────────────────────────────────
  // 5. JOB POSTINGS (various statuses & types)
  // ────────────────────────────────────────────────────
  const job1 = await prisma.jobPosting.create({
    data: {
      title: "Software Engineer — Full Stack",
      jobDescription:
        "Build and maintain scalable web apps using React, Node.js and PostgreSQL. Must have strong fundamentals in data structures and system design.",
      jobType: "FULL_TIME",
      jobLocation: "Bangalore, Karnataka",
      salaryRange: "₹18L – ₹28L",
      requiredSkills: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "PostgreSQL",
      ],
      status: "open",
      noOfSeats: 5,
      companyId: companyGoogle.id,
    },
  });

  const job2 = await prisma.jobPosting.create({
    data: {
      title: "ML Engineer — NLP Team",
      jobDescription:
        "Work on large language models and NLP pipelines. Experience with Python, TensorFlow/PyTorch required.",
      jobType: "FULL_TIME",
      jobLocation: "Hyderabad, Telangana",
      salaryRange: "₹22L – ₹35L",
      requiredSkills: ["Python", "Machine Learning", "TensorFlow", "NLP"],
      status: "open",
      noOfSeats: 3,
      companyId: companyGoogle.id,
    },
  });

  const job3 = await prisma.jobPosting.create({
    data: {
      title: "Backend Developer",
      jobDescription:
        "Develop microservices using Java and Spring Boot. Deploy on AWS. Experience with Kafka is a plus.",
      jobType: "FULL_TIME",
      jobLocation: "Mumbai, Maharashtra",
      salaryRange: "₹8L – ₹14L",
      requiredSkills: ["Java", "Spring Boot", "MySQL", "AWS"],
      status: "open",
      noOfSeats: 10,
      companyId: companyTCS.id,
    },
  });

  const job4 = await prisma.jobPosting.create({
    data: {
      title: "Frontend Developer Intern",
      jobDescription:
        "6-month internship building UI components with React and Tailwind. Stipend provided.",
      jobType: "INTERNSHIP",
      jobLocation: "Remote",
      salaryRange: "₹25K/month",
      requiredSkills: ["React", "Tailwind CSS", "JavaScript"],
      status: "open",
      noOfSeats: 8,
      companyId: companyTCS.id,
    },
  });

  const job5 = await prisma.jobPosting.create({
    data: {
      title: "DevOps Engineer",
      jobDescription:
        "Manage CI/CD pipelines, container orchestration with Kubernetes, and infra-as-code with Terraform.",
      jobType: "FULL_TIME",
      jobLocation: "Bangalore, Karnataka",
      salaryRange: "₹20L – ₹30L",
      requiredSkills: ["Docker", "Kubernetes", "AWS", "Terraform", "Python"],
      status: "open",
      noOfSeats: 2,
      companyId: companyGoogle.id,
    },
  });

  const job6 = await prisma.jobPosting.create({
    data: {
      title: "AI Research Intern",
      jobDescription:
        "Work on cutting-edge AI research projects. Publish papers at top-tier conferences.",
      jobType: "INTERNSHIP",
      jobLocation: "Hyderabad, Telangana",
      salaryRange: "₹40K/month",
      requiredSkills: ["Python", "Machine Learning", "Data Science"],
      status: "pending",
      noOfSeats: 4,
      companyId: companyStartup.id,
    },
  });

  const job7 = await prisma.jobPosting.create({
    data: {
      title: "Contract Data Analyst",
      jobDescription:
        "6-month contract role analyzing business data and building dashboards.",
      jobType: "CONTRACT",
      jobLocation: "Remote",
      salaryRange: "₹50K/month",
      requiredSkills: ["SQL", "Python", "Tableau", "Data Science"],
      status: "approved",
      noOfSeats: 3,
      companyId: companyTCS.id,
    },
  });

  const job8 = await prisma.jobPosting.create({
    data: {
      title: "Blockchain Developer",
      jobDescription: "Build decentralized applications on Ethereum.",
      jobType: "FULL_TIME",
      jobLocation: "Remote",
      salaryRange: "₹15L – ₹25L",
      requiredSkills: ["Solidity", "Ethereum", "Web3.js"],
      status: "rejected",
      noOfSeats: 2,
      companyId: companyRejected.id,
    },
  });

  const job9 = await prisma.jobPosting.create({
    data: {
      title: "QA Automation Engineer",
      jobDescription:
        "Build and maintain end-to-end test suites using Selenium and Cypress.",
      jobType: "FULL_TIME",
      jobLocation: "Pune, Maharashtra",
      salaryRange: "₹10L – ₹16L",
      requiredSkills: ["Selenium", "Cypress", "JavaScript", "Java"],
      status: "closed",
      noOfSeats: 5,
      companyId: companyTCS.id,
    },
  });

  console.log(
    "✅ Jobs:",
    [job1, job2, job3, job4, job5, job6, job7, job8, job9]
      .map((j) => `${j.title} (${j.status})`)
      .join(" | ")
  );

  // ────────────────────────────────────────────────────
  // 6. JOB APPLICATIONS (various statuses for dashboards)
  // ────────────────────────────────────────────────────
  const applications = await Promise.all([
    // Rahul applies to 4 jobs
    prisma.jobApplication.create({
      data: { studentId: student1.id, jobId: job1.id, status: "shortlisted" },
    }),
    prisma.jobApplication.create({
      data: { studentId: student1.id, jobId: job3.id, status: "pending" },
    }),
    prisma.jobApplication.create({
      data: { studentId: student1.id, jobId: job4.id, status: "interview" },
    }),
    prisma.jobApplication.create({
      data: { studentId: student1.id, jobId: job5.id, status: "offered" },
    }),

    // Priya applies to 2 jobs (she is placed)
    prisma.jobApplication.create({
      data: { studentId: student2.id, jobId: job2.id, status: "offered" },
    }),
    prisma.jobApplication.create({
      data: { studentId: student2.id, jobId: job1.id, status: "rejected" },
    }),

    // Amit applies to 2 jobs
    prisma.jobApplication.create({
      data: { studentId: student3.id, jobId: job3.id, status: "pending" },
    }),
    prisma.jobApplication.create({
      data: { studentId: student3.id, jobId: job4.id, status: "shortlisted" },
    }),

    // Sneha applies to 3 jobs
    prisma.jobApplication.create({
      data: { studentId: student4.id, jobId: job1.id, status: "interview" },
    }),
    prisma.jobApplication.create({
      data: { studentId: student4.id, jobId: job4.id, status: "pending" },
    }),
    prisma.jobApplication.create({
      data: { studentId: student4.id, jobId: job5.id, status: "rejected" },
    }),

    // Vikram applies to 1 job
    prisma.jobApplication.create({
      data: { studentId: student5.id, jobId: job5.id, status: "pending" },
    }),
  ]);
  console.log(`✅ Applications: ${applications.length} created`);

  // ────────────────────────────────────────────────────
  // 7. SAVED JOBS
  // ────────────────────────────────────────────────────
  const savedJobs = await Promise.all([
    prisma.savedJob.create({
      data: { studentId: student1.id, jobId: job2.id },
    }),
    prisma.savedJob.create({
      data: { studentId: student1.id, jobId: job5.id },
    }),
    prisma.savedJob.create({
      data: { studentId: student4.id, jobId: job1.id },
    }),
    prisma.savedJob.create({
      data: { studentId: student4.id, jobId: job2.id },
    }),
    prisma.savedJob.create({
      data: { studentId: student3.id, jobId: job4.id },
    }),
  ]);
  console.log(`✅ Saved Jobs: ${savedJobs.length} created`);

  // ────────────────────────────────────────────────────
  // 8. RESUME ATS RUNS
  // ────────────────────────────────────────────────────
  await Promise.all([
    prisma.resumeATSRun.create({
      data: {
        studentId: student1.id,
        resumeUrl:
          "https://res.cloudinary.com/demo/raw/upload/sample_resume_rahul.pdf",
        overallScore: 82.5,
        summary:
          "Strong full-stack profile with solid project experience. Resume is well-structured with quantifiable achievements.",
        strengths: [
          "Clear project descriptions with impact metrics",
          "Relevant tech stack for web development roles",
          "Good use of action verbs",
          "GitHub and portfolio links included",
        ],
        weaknesses: [
          "Missing certifications section",
          "No mention of system design experience",
          "Could add more quantifiable results",
        ],
        recommendations: [
          "Add AWS or GCP certifications",
          "Include system design project details",
          "Quantify team size in project descriptions",
          "Add a brief professional summary at the top",
        ],
        keywordMatch: {
          matched: [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "PostgreSQL",
            "Git",
            "REST API",
          ],
          missing: ["Docker", "CI/CD", "System Design", "Agile"],
          score: 63.6,
        },
        modelUsed: "gpt-4o-mini",
        success: true,
      },
    }),
    prisma.resumeATSRun.create({
      data: {
        studentId: student1.id,
        resumeUrl:
          "https://res.cloudinary.com/demo/raw/upload/sample_resume_rahul_v2.pdf",
        overallScore: 89.0,
        summary:
          "Improved resume with certifications and system design projects. Strong candidate for SDE roles.",
        strengths: [
          "Excellent keyword coverage",
          "Strong project portfolio",
          "Certifications added",
          "System design experience documented",
        ],
        weaknesses: ["Could add open-source contributions"],
        recommendations: [
          "Contribute to open-source projects",
          "Add leadership/mentoring experience",
        ],
        keywordMatch: {
          matched: [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "PostgreSQL",
            "Docker",
            "CI/CD",
            "System Design",
            "AWS",
          ],
          missing: ["Agile", "Scrum"],
          score: 81.8,
        },
        modelUsed: "gpt-4o-mini",
        success: true,
      },
    }),
    prisma.resumeATSRun.create({
      data: {
        studentId: student2.id,
        resumeUrl:
          "https://res.cloudinary.com/demo/raw/upload/sample_resume_priya.pdf",
        overallScore: 91.0,
        summary:
          "Outstanding ML-focused resume with published research papers and strong internship experience.",
        strengths: [
          "Published research papers at top venues",
          "Strong internship at Google Research",
          "Comprehensive skills section",
          "Kaggle competition achievements",
        ],
        weaknesses: [
          "Resume is slightly long (2.5 pages)",
          "Could consolidate older projects",
        ],
        recommendations: [
          "Trim to 2 pages max",
          "Focus on most impactful 3-4 projects",
        ],
        keywordMatch: {
          matched: [
            "Python",
            "Machine Learning",
            "TensorFlow",
            "NLP",
            "Data Science",
            "PyTorch",
            "SQL",
            "Pandas",
            "Deep Learning",
          ],
          missing: ["MLOps", "Kubernetes"],
          score: 81.8,
        },
        modelUsed: "gpt-4o-mini",
        success: true,
      },
    }),
    prisma.resumeATSRun.create({
      data: {
        studentId: student4.id,
        resumeUrl:
          "https://res.cloudinary.com/demo/raw/upload/sample_resume_sneha.pdf",
        overallScore: 76.0,
        summary:
          "Good frontend-focused resume but needs more project variety and backend experience.",
        strengths: [
          "Beautiful portfolio website",
          "Good UI/UX case studies",
          "Active open-source contributor",
        ],
        weaknesses: [
          "Limited backend experience mentioned",
          "No testing framework experience",
          "Missing deployment/DevOps skills",
        ],
        recommendations: [
          "Add full-stack projects to demonstrate versatility",
          "Learn and mention testing tools like Jest or Cypress",
          "Include deployment experience (Vercel, AWS, etc.)",
        ],
        keywordMatch: {
          matched: [
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "JavaScript",
            "Figma",
          ],
          missing: ["Node.js", "Testing", "CI/CD", "Docker"],
          score: 60.0,
        },
        modelUsed: "gpt-4o-mini",
        success: true,
      },
    }),
  ]);
  console.log("✅ Resume ATS Runs: 4 created");

  // ────────────────────────────────────────────────────
  // 9. JOB INTELLIGENCE RUN + JOBS
  // ────────────────────────────────────────────────────
  const jiRun = await prisma.jobIntelligenceRun.create({
    data: {
      runType: "EXTERNAL_MARKET_SCAN",
      totalJobs: 8,
      jobs: {
        create: [
          {
            title: "Senior React Developer",
            companyName: "Flipkart",
            location: "Bangalore, Karnataka",
            jobType: "FULL_TIME",
            source: "linkedin",
            applyLink: "https://www.flipkartcareers.com/#!/joblist",
            finalScore: 92.5,
            scoreBreakdown: {
              relevance: 95,
              salary: 88,
              growth: 94,
              companyRating: 90,
            },
            description:
              "Build next-generation e-commerce experiences with React and micro-frontends.",
          },
          {
            title: "Python Backend Developer",
            companyName: "Razorpay",
            location: "Bangalore, Karnataka",
            jobType: "FULL_TIME",
            source: "naukri",
            applyLink: "https://razorpay.com/careers/",
            finalScore: 89.0,
            scoreBreakdown: {
              relevance: 90,
              salary: 85,
              growth: 92,
              companyRating: 88,
            },
            description:
              "Design and build payment processing microservices in Python/Django.",
          },
          {
            title: "Data Engineer",
            companyName: "Swiggy",
            location: "Hyderabad, Telangana",
            jobType: "FULL_TIME",
            source: "linkedin",
            applyLink: "https://careers.swiggy.com/",
            finalScore: 86.0,
            scoreBreakdown: {
              relevance: 82,
              salary: 90,
              growth: 88,
              companyRating: 84,
            },
            description:
              "Build and optimize large-scale data pipelines using Spark, Airflow and BigQuery.",
          },
          {
            title: "iOS Developer",
            companyName: "PhonePe",
            location: "Pune, Maharashtra",
            jobType: "FULL_TIME",
            source: "glassdoor",
            applyLink: "https://www.phonepe.com/careers/",
            finalScore: 83.5,
            scoreBreakdown: {
              relevance: 78,
              salary: 88,
              growth: 85,
              companyRating: 82,
            },
            description:
              "Build fintech mobile apps using Swift and SwiftUI for millions of users.",
          },
          {
            title: "DevOps Intern",
            companyName: "Zerodha",
            location: "Remote",
            jobType: "INTERNSHIP",
            source: "linkedin",
            applyLink: "https://zerodha.com/careers/",
            finalScore: 80.0,
            scoreBreakdown: {
              relevance: 75,
              salary: 70,
              growth: 90,
              companyRating: 85,
            },
            description:
              "Assist in managing cloud infrastructure and CI/CD pipelines.",
          },
          {
            title: "Full Stack Developer",
            companyName: "Cred",
            location: "Bangalore, Karnataka",
            jobType: "FULL_TIME",
            source: "naukri",
            applyLink: "https://careers.cred.club/",
            finalScore: 88.5,
            scoreBreakdown: {
              relevance: 92,
              salary: 86,
              growth: 88,
              companyRating: 87,
            },
            description:
              "Build fintech products end-to-end with React, Node.js and PostgreSQL.",
          },
          {
            title: "ML Intern",
            companyName: "Ola",
            location: "Bangalore, Karnataka",
            jobType: "INTERNSHIP",
            source: "indeed",
            applyLink: "https://www.olacabs.com/careers",
            finalScore: 77.0,
            scoreBreakdown: {
              relevance: 80,
              salary: 65,
              growth: 82,
              companyRating: 78,
            },
            description:
              "Work on ride-demand prediction ML models and real-time surge pricing.",
          },
          {
            title: "Cloud Solutions Architect",
            companyName: "Amazon Web Services",
            location: "Gurgaon, Haryana",
            jobType: "FULL_TIME",
            source: "linkedin",
            applyLink: "https://www.amazon.jobs/en/locations/india",
            finalScore: 94.0,
            scoreBreakdown: {
              relevance: 90,
              salary: 96,
              growth: 95,
              companyRating: 94,
            },
            description:
              "Design cloud architectures for enterprise customers across India.",
          },
        ],
      },
    },
  });
  console.log(`✅ Job Intelligence Run: ${jiRun.id} with 8 jobs`);

  // ────────────────────────────────────────────────────
  // 10. STUDENT MATCH RUN + RESULTS
  // ────────────────────────────────────────────────────

  // Fetch the JI job IDs that were just created
  const jiJobs = await prisma.jobIntelligence.findMany({
    where: { runId: jiRun.id },
    orderBy: { finalScore: "desc" },
  });

  const matchRun1 = await prisma.studentMatchRun.create({
    data: {
      studentId: student1.id,
      jobIntelligenceRunId: jiRun.id,
      topK: 5,
      jobsConsidered: 8,
      studentAtsScore: 82.5,
      matches: {
        create: [
          {
            studentId: student1.id,
            jobId: jiJobs[0].id, // Cloud Solutions Architect (94.0)
            jobSource: "job_intelligence",
            matchScore: 72.0,
            skillMatchScore: 65.0,
            atsScore: 82.5,
            matchedSkills: ["Python", "Docker"],
            missingSkills: ["AWS Solutions Architect Cert", "Terraform"],
            reasoning: {
              summary:
                "Partial skill overlap. Strong base but needs cloud certifications.",
            },
          },
          {
            studentId: student1.id,
            jobId: jiJobs.find((j) => j.companyName === "Flipkart")!.id,
            jobSource: "job_intelligence",
            matchScore: 95.0,
            skillMatchScore: 92.0,
            atsScore: 82.5,
            matchedSkills: ["React", "JavaScript", "TypeScript", "Node.js"],
            missingSkills: ["Micro-frontends"],
            reasoning: {
              summary:
                "Excellent match. Candidate has all core skills and strong project portfolio.",
            },
          },
          {
            studentId: student1.id,
            jobId: jiJobs.find((j) => j.companyName === "Cred")!.id,
            jobSource: "job_intelligence",
            matchScore: 91.0,
            skillMatchScore: 88.0,
            atsScore: 82.5,
            matchedSkills: [
              "React",
              "Node.js",
              "PostgreSQL",
              "JavaScript",
              "TypeScript",
            ],
            missingSkills: [],
            reasoning: {
              summary:
                "Near-perfect match. Full-stack profile aligns perfectly with role requirements.",
            },
          },
          {
            studentId: student1.id,
            jobId: jiJobs.find((j) => j.companyName === "Razorpay")!.id,
            jobSource: "job_intelligence",
            matchScore: 68.0,
            skillMatchScore: 55.0,
            atsScore: 82.5,
            matchedSkills: ["Python"],
            missingSkills: ["Django", "Payment Systems"],
            reasoning: {
              summary:
                "Limited Python backend experience. Candidate is more frontend/full-stack oriented.",
            },
          },
          {
            studentId: student1.id,
            jobId: jiJobs.find((j) => j.companyName === "Zerodha")!.id,
            jobSource: "job_intelligence",
            matchScore: 78.0,
            skillMatchScore: 70.0,
            atsScore: 82.5,
            matchedSkills: ["Docker"],
            missingSkills: ["Kubernetes", "Terraform", "CI/CD pipelines"],
            reasoning: {
              summary:
                "Some DevOps exposure but lacks depth in cloud orchestration tools.",
            },
          },
        ],
      },
    },
  });

  const matchRun2 = await prisma.studentMatchRun.create({
    data: {
      studentId: student4.id,
      jobIntelligenceRunId: jiRun.id,
      topK: 3,
      jobsConsidered: 8,
      studentAtsScore: 76.0,
      matches: {
        create: [
          {
            studentId: student4.id,
            jobId: jiJobs.find((j) => j.companyName === "Flipkart")!.id,
            jobSource: "job_intelligence",
            matchScore: 88.0,
            skillMatchScore: 85.0,
            atsScore: 76.0,
            matchedSkills: ["React", "TypeScript", "Next.js"],
            missingSkills: ["Micro-frontends", "Performance Optimization"],
            reasoning: {
              summary:
                "Strong frontend skills aligned with the role. Experience with Next.js is a plus.",
            },
          },
          {
            studentId: student4.id,
            jobId: jiJobs.find((j) => j.companyName === "Cred")!.id,
            jobSource: "job_intelligence",
            matchScore: 75.0,
            skillMatchScore: 68.0,
            atsScore: 76.0,
            matchedSkills: ["React", "Node.js", "TypeScript"],
            missingSkills: ["PostgreSQL", "Backend APIs"],
            reasoning: {
              summary:
                "Good frontend fit but needs more backend experience for full-stack role.",
            },
          },
          {
            studentId: student4.id,
            jobId: jiJobs.find((j) => j.companyName === "Zerodha")!.id,
            jobSource: "job_intelligence",
            matchScore: 45.0,
            skillMatchScore: 30.0,
            atsScore: 76.0,
            matchedSkills: [],
            missingSkills: ["Docker", "Kubernetes", "CI/CD", "Cloud"],
            reasoning: {
              summary:
                "Not a strong match — candidate is frontend-focused, role requires DevOps skills.",
            },
          },
        ],
      },
    },
  });
  console.log(
    `✅ Student Match Runs: ${matchRun1.id} (Rahul, 5 matches) | ${matchRun2.id} (Sneha, 3 matches)`
  );

  // ────────────────────────────────────────────────────
  // 11. STUDENT JOB APPROVALS
  // ────────────────────────────────────────────────────
  await Promise.all([
    prisma.studentJobApproval.create({
      data: {
        studentId: student1.id,
        jobSource: "job_intelligence",
        jobId: jiJobs.find((j) => j.companyName === "Flipkart")!.id,
      },
    }),
    prisma.studentJobApproval.create({
      data: {
        studentId: student1.id,
        jobSource: "job_intelligence",
        jobId: jiJobs.find((j) => j.companyName === "Cred")!.id,
      },
    }),
    prisma.studentJobApproval.create({
      data: {
        studentId: student4.id,
        jobSource: "job_intelligence",
        jobId: jiJobs.find((j) => j.companyName === "Flipkart")!.id,
      },
    }),
  ]);
  console.log("✅ Student Job Approvals: 3 created");

  // ────────────────────────────────────────────────────
  // 12. ANNOUNCEMENTS
  // ────────────────────────────────────────────────────
  await Promise.all([
    prisma.announcement.create({
      data: {
        title: "Placement Drive 2026 — Registration Open",
        content:
          "The placement season for batch 2026 is officially open. All eligible students must upload their updated resumes by March 15, 2026. Companies will begin shortlisting from April 1.",
        createdBy: college1.id,
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Google On-Campus Drive — April 10",
        content:
          "Google India will be conducting an on-campus placement drive on April 10, 2026. Roles: SDE, ML Engineer, DevOps. Eligibility: No active backlogs, CGPA ≥ 7.5. Register via the portal by April 5.",
        createdBy: college1.id,
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Resume Workshop — March 20",
        content:
          "A resume-building workshop will be conducted on March 20, 2026 at 3 PM in the auditorium. Industry experts from TCS and Infosys will guide students on crafting ATS-friendly resumes.",
        createdBy: college2.id,
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Mock Interview Sign-ups Live",
        content:
          "Sign up for mock interviews with our partner companies. Practice technical and HR rounds. Limited slots available — first come, first served. Deadline: March 25, 2026.",
        createdBy: college1.id,
      },
    }),
  ]);
  console.log("✅ Announcements: 4 created");

  // ────────────────────────────────────────────────────
  // 13. HEADLINES
  // ────────────────────────────────────────────────────
  await Promise.all([
    prisma.headline.create({
      data: {
        company: "Google India",
        headline: "Google India offers ₹45 LPA package to IIT Delhi student",
        date: new Date("2026-02-15"),
      },
    }),
    prisma.headline.create({
      data: {
        company: "Microsoft",
        headline:
          "Microsoft hires 12 students from NIT Warangal in pre-placement offers",
        date: new Date("2026-02-10"),
      },
    }),
    prisma.headline.create({
      data: {
        company: "Amazon",
        headline:
          "Amazon doubles campus hiring targets for 2026 placement season",
        date: new Date("2026-02-05"),
      },
    }),
    prisma.headline.create({
      data: {
        company: "Flipkart",
        headline:
          "Flipkart announces new SDE-1 role with ₹28 LPA for fresh graduates",
        date: new Date("2026-01-28"),
      },
    }),
    prisma.headline.create({
      data: {
        company: "TCS",
        headline:
          "TCS NQT 2026 results declared — 5,000+ students qualify for interviews",
        date: new Date("2026-01-20"),
      },
    }),
  ]);
  console.log("✅ Headlines: 5 created");

  // ────────────────────────────────────────────────────
  // SUMMARY
  // ────────────────────────────────────────────────────
  console.log("\n🎉 Seed completed successfully!\n");
  console.log("📊 Seeded Data Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  👑 SuperAdmin ......... 1");
  console.log(
    "  🏫 College Admins ..... 2  (IIT Delhi, NIT Warangal)"
  );
  console.log(
    "  🏢 Companies .......... 4  (2 verified, 1 pending, 1 rejected)"
  );
  console.log(
    "  🎓 Students ........... 5  (1 placed, 1 with backlogs, 1 inactive)"
  );
  console.log(
    "  💼 Job Postings ....... 9  (4 open, 1 pending, 1 approved, 1 rejected, 1 closed)"
  );
  console.log("  📝 Applications ....... 12 (spread across all statuses)");
  console.log("  ⭐ Saved Jobs ......... 5");
  console.log("  📄 ATS Runs ........... 4  (Rahul ×2, Priya ×1, Sneha ×1)");
  console.log("  🔍 JI Run ............. 1  (8 scraped jobs from 5 sources)");
  console.log(
    "  🎯 Match Runs ......... 2  (Rahul: 5 matches, Sneha: 3 matches)"
  );
  console.log("  ✅ Job Approvals ...... 3");
  console.log("  📢 Announcements ...... 4");
  console.log("  📰 Headlines .......... 5");
  console.log(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
  );

  console.log("📝 Test Credentials (all passwords: Test@1234):");
  console.log(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  );
  console.log("  👑 SUPERADMIN:  superadmin@test.com");
  console.log("  🏫 ADMIN 1:    admin@iitdelhi.edu");
  console.log("  🏫 ADMIN 2:    admin@nitw.edu");
  console.log("  🏢 COMPANY 1:  hr@google.com        (verified)");
  console.log("  🏢 COMPANY 2:  hr@tcs.com            (verified)");
  console.log("  🏢 COMPANY 3:  hr@novatech.io        (pending)");
  console.log(
    "  🎓 STUDENT 1:  rahul.sharma@iitd.ac.in  (active, no backlogs)"
  );
  console.log("  🎓 STUDENT 2:  priya.patel@iitd.ac.in   (placed)");
  console.log(
    "  🎓 STUDENT 3:  amit.kumar@nitw.ac.in    (active backlogs)"
  );
  console.log(
    "  🎓 STUDENT 4:  sneha.reddy@nitw.ac.in   (active, no backlogs)"
  );
  console.log(
    "  🎓 STUDENT 5:  vikram.singh@iitd.ac.in  (inactive)"
  );
  console.log(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
  );

  console.log("📈 Dashboard Stats Preview:");
  console.log(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  );
  console.log(
    "  Student (Rahul):     applied=4, shortlisted=1, interviews=1, offers=1"
  );
  console.log(
    "  Company (Google):    totalJobs=3, totalApps=4, interviews=1, hired=1"
  );
  console.log(
    "  Company (TCS):       totalJobs=4, totalApps=5, interviews=0, hired=0"
  );
  console.log(
    "  Admin:               students=5, companies=4, jobs=9, apps=12, placed=1, pendingJobs=1"
  );
  console.log(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
