import winston from "winston";
import path from "path";
import fs from "fs";

// Ensure logs directory exists
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    logFormat
  ),
  transports: [
    // Console logs (colorized for dev)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // File logs for errors
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),

    // File logs for all info-level messages
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

// Stream for morgan (HTTP request logger)
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
