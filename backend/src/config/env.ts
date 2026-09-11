import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

interface EnvConfig {
  DATABASE_URL: string;
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: SignOptions["expiresIn"];
}

function validateEnv(): EnvConfig {
  const {
    DATABASE_URL,
    PORT,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRES_IN,
  } = process.env;

  if (!DATABASE_URL) {
    throw new Error("❌ Missing required environment variable: DATABASE_URL");
  }

  if (!JWT_SECRET) {
    throw new Error("❌ Missing required environment variable: JWT_SECRET");
  }

  return {
    DATABASE_URL,
    PORT: PORT ? Number(PORT) : 5000,
    NODE_ENV: NODE_ENV ?? "development",
    JWT_SECRET,
    JWT_EXPIRES_IN:
      (JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  };
}

export const env = validateEnv();