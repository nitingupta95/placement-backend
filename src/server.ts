import app from "./app";
import { PORT } from "./config";
import prisma from "./db/prismaClient";
import logger from "./config/logger";

const server = app.listen(PORT, async () => {
  logger.info(`Server listening on port ${PORT}`);
  // test db connection
  try {
    await prisma.$connect();
    logger.info("Connected to DB");
  } catch (err) {
    logger.error("DB connection error", err);
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, closing server...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});

// Handle unhandled exceptions
process.on("uncaughtException", (err) => {
  logger.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
