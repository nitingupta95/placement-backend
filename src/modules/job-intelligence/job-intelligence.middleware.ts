import { Request, Response, NextFunction } from "express";

export const authenticateInternalToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("[Auth] Internal token middleware called");
  console.log("[Auth] Request path:", req.path);
  console.log("[Auth] Request URL:", req.url);

  const authHeader = req.headers.authorization;
  const internalToken = process.env.BACKEND_INTERNAL_TOKEN;

  console.log("[Auth] Auth header present:", !!authHeader);
  console.log("[Auth] Internal token configured:", !!internalToken);

  if (!internalToken) {
    console.warn("BACKEND_INTERNAL_TOKEN not configured");
    return next(); // Allow if not configured
  }

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.replace("Bearer ", "");

  if (token !== internalToken) {
    return res.status(403).json({ error: "Invalid internal token" });
  }

  next();
};
