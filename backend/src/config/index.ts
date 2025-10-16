import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  
  server: {
    host: process.env.API_HOST || 'localhost',
    port: parseInt(process.env.API_PORT || '3001', 10),
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/webapp_3d_ar',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'webapp_3d_ar',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  storage: {
    endpoint: process.env.STORAGE_ENDPOINT || 'http://localhost:9000',
    accessKey: process.env.STORAGE_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.STORAGE_SECRET_KEY || 'minioadmin123',
    bucket: process.env.STORAGE_BUCKET || 'webapp-3d-ar-assets',
    region: process.env.STORAGE_REGION || 'us-east-1',
  },

  cdn: {
    url: process.env.CDN_URL || 'http://localhost:9000',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  antiBot: {
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '',
  },

  analytics: {
    enabled: process.env.ANALYTICS_ENABLED === 'true',
  },
};

