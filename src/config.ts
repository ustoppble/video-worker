import { resolve } from 'node:path'

export const config = {
  port: Number(process.env.PORT || 3200),
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
  dataDir: process.env.DATA_DIR || resolve(process.cwd(), 'data'),
  cleanupAfterHours: Number(process.env.CLEANUP_AFTER_HOURS || 24),
  maxShortsPerLive: Number(process.env.MAX_SHORTS_PER_LIVE || 8),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucket: process.env.R2_BUCKET || 'video-worker',
  },
}
