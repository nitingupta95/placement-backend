-- CreateTable
CREATE TABLE "JobIntelligenceRun" (
    "id" SERIAL NOT NULL,
    "runType" TEXT NOT NULL DEFAULT 'EXTERNAL_MARKET_SCAN',
    "totalJobs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobIntelligenceRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobIntelligence" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT,
    "jobType" TEXT,
    "source" TEXT NOT NULL,
    "applyLink" TEXT NOT NULL,
    "finalScore" DOUBLE PRECISION NOT NULL,
    "scoreBreakdown" JSONB NOT NULL,
    "description" TEXT,
    "runId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobIntelligence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobIntelligence" ADD CONSTRAINT "JobIntelligence_runId_fkey" FOREIGN KEY ("runId") REFERENCES "JobIntelligenceRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
