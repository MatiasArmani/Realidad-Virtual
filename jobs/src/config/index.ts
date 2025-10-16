import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  storage: {
    endpoint: process.env.STORAGE_ENDPOINT || 'http://localhost:9000',
    accessKey: process.env.STORAGE_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.STORAGE_SECRET_KEY || 'minioadmin123',
    bucket: process.env.STORAGE_BUCKET || 'webapp-3d-ar-assets',
    region: process.env.STORAGE_REGION || 'us-east-1',
  },

  processing: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxPolygons: 1000000,
    thumbnailSize: 512,
  },
};



