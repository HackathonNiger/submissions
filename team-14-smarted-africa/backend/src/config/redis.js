import Redis from 'ioredis';
const redis = new Redis({ host: process.env.REDIS_HOST || 'redis', port: parseInt(process.env.REDIS_PORT||'6379',10), password: process.env.REDIS_PASSWORD || undefined });
redis.on('connect', ()=>console.log('Redis connected'));
redis.on('error', (e)=>console.error('Redis error', e));
export default redis;
