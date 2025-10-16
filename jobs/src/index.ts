import Queue from 'bull';
import { config } from './config';
import { logger } from './utils/logger';
import { processAssetJob } from './jobs/processAsset';

// Configurar colas de Redis
const assetQueue = new Queue('asset processing', config.redis.url);

// Procesar jobs de assets
assetQueue.process('process-asset', processAssetJob);

assetQueue.on('completed', (job) => {
  logger.info(`Job completado: ${job.id}`);
});

assetQueue.on('failed', (job, err) => {
  logger.error(`Job falló: ${job.id}`, err);
});

logger.info('🚀 Jobs worker iniciado');
logger.info(`📊 Entorno: ${config.env}`);
logger.info(`🔗 Redis: ${config.redis.url}`);

export { assetQueue };



