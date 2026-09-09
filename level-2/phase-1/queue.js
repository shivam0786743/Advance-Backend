import { Queue } from "bullmq";

const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
};

// 1. "emailQueue" naam se ek queue banayi
const emailQueue = new Queue("emailQueue", {
    connection: redisConnection,
});

export default emailQueue;
