-- CreateTable
CREATE TABLE "ResumeATSRun" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "resumeId" INTEGER,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "summary" TEXT,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "recommendations" TEXT[],
    "keywordMatch" JSONB NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeATSRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResumeATSRun_studentId_idx" ON "ResumeATSRun"("studentId");

-- AddForeignKey
ALTER TABLE "ResumeATSRun" ADD CONSTRAINT "ResumeATSRun_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
