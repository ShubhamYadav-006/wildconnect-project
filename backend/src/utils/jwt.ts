import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { Role } from "../generated/prisma/index.js";

export interface JwtPayload {
  id: string; role: Role;
}

export const signToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};