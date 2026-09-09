import { Worker } from "bullmq";

const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
};

// Worker emailQueue se job utha ke background me process karega
const emailWorker = new Worker(
    "emailQueue",
    async (job) => {
        console.log(`\n[Worker] 📩 Processing Job #${job.id}: Sending email to -> ${job.data.email}`);

        // Email bhejne ka simulation (3 second delay)
        await new Promise((resolve) => setTimeout(resolve, 3000));

        console.log(`[Worker] ✅ Welcome Email sent successfully to ${job.data.name} (${job.data.email})!\n`);
    },
    {
        connection: redisConnection,
    }
);

emailWorker.on("completed", (job) => {
    console.log(`[Worker] Job #${job.id} completed.`);
});

emailWorker.on("failed", (job, err) => {
    console.error(`[Worker] Job #${job?.id} failed with error:`, err.message);
});

console.log("🚀 Email Worker is running and waiting for jobs...");

export default emailWorker;