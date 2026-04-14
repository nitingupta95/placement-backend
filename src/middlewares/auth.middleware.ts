import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { JWTPayload, UserRole } from "../types";

/**
 * Middleware to verify if user is logged in by decoding JWT token
 * Attaches user data to req.user if token is valid
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Attach user data to request object
    req.user = decoded;

    // Continue to next middleware
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Token expired.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};
