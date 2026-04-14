import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";
export const NODE_ENV = process.env.NODE_ENV || "development";

// ─── OneSignal Push Notifications ───
export const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || "a7b6dd37-40cc-4d19-891d-388d8a6c3aba";
export const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY || "";
