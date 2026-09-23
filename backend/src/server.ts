import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/db.js';

const PORT = env.PORT;

app.listen(PORT, async () => {
  logger.info('Welcome to WildConnect Backend Server');
  logger.info(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
  try {
    const t0 = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    logger.info(`Database connection established and verified in ${Date.now() - t0}ms`);
  } catch (err: any) {
    logger.warn(`Database connection check notice: ${err.message}`);
  }
});
