import { Request } from "express";

export type UserRole = "STUDENT" | "COMPANY" | "ADMIN" | "SUPERADMIN";

export interface JWTPayload {
  id: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
