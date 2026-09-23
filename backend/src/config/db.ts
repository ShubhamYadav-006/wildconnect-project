import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { PrismaClient } from '../generated/prisma/index.js';
import { env } from './env.js';
import { logger } from './logger.js';

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon(
  { connectionString: env.DATABASE_URL.trim() },
  {
    onConnectionError: (err: Error) => {
      logger.warn(`Neon database connection notice: ${err.message}`);
    },
    onPoolError: (err: Error) => {
      logger.warn(`Neon database pool notice: ${err.message}`);
    },
  }
);

export const prisma = new PrismaClient({ adapter });

