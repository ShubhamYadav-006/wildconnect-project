import { PrismaClient } from '../generated/prisma/index.js';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env.js';

let connectionString = env.DATABASE_URL;

// Ensure libpq compatibility for pg-connection-string to silence SSL mode deprecation warnings
if (connectionString && connectionString.includes('sslmode=') && !connectionString.includes('uselibpqcompat=')) {
  const separator = connectionString.includes('?') ? '&' : '?';
  connectionString = `${connectionString}${separator}uselibpqcompat=true`;
}

const pool = new pg.Pool({ 
  connectionString,
  max: 10,                       // Connection pool capacity
  idleTimeoutMillis: 30000,       // Keep idle connections active for 30s before closing
  connectionTimeoutMillis: 15000, // Increased timeout to 15s to handle serverless cold starts & network latency
  keepAlive: true,                // Enable TCP keepalive to prevent silent socket drops
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });



