import { Request, Response, NextFunction } from "express";
import {  UserRole } from "../types";


/**
 * Role hierarchy map - defines which roles can access what
 * SUPERADMIN > ADMIN > COMPANY/STUDENT
 */
const roleHierarchy: Record<UserRole, UserRole[]> = {
  SUPERADMIN: ["SUPERADMIN", "ADMIN", "COMPANY", "STUDENT"], // Can access everything
  ADMIN: ["ADMIN", "COMPANY", "STUDENT"], // Can access admin, company, and student routes
  COMPANY: ["COMPANY"], // Can only access company routes
  STUDENT: ["STUDENT"], // Can only access student routes
};


// router.get('/admin-only', verifyToken, allowedRoles(['ADMIN']), controller)
// ADMIN and SUPERADMIN can both access this route
 
const allowedRoles = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if user exists (should be set by verifyToken)
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const userRole = req.user.role;
    const accessibleRoles = roleHierarchy[userRole];

    // Check if user's role can access any of the required roles
    const hasAccess = roles.some((role) => accessibleRoles.includes(role));

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Access forbidden. Insufficient permissions.",
        requiredRoles: roles,
        userRole: userRole,
      });
      return;
    }

    // User has required permissions, continue
    next();
  };
};

/**
 * Helper middleware for common role combinations
 * Note: Due to role hierarchy, higher roles automatically have access:
 * - isStudent: STUDENT, ADMIN, SUPERADMIN can access
 * - isCompany: COMPANY, ADMIN, SUPERADMIN can access
 * - isAdmin: ADMIN, SUPERADMIN can access
 * - isSuperAdmin: Only SUPERADMIN can access
 */
export const isStudent = allowedRoles(["STUDENT"]);
export const isCompany = allowedRoles(["COMPANY"]);
export const isAdmin = allowedRoles(["ADMIN"]);
export const isSuperAdmin = allowedRoles(["SUPERADMIN"]);
