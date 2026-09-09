import Redis from "ioredis"
const redis = new Redis()
const rateLimitter = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        const key = `rate_Limitter:${ip}`;
        const requests = await redis.incr(key);

        if (requests === 1) {
            await redis.expire(key, 60);
        }

        if (requests > 5) {
            return res.status(429).json({
                success: false,
                message: "too many requests"
            });
        }

        next();
    } catch (error) {
        console.error("Rate limiter error:", error);
        next(); // fallback to continue request if Redis has an issue
    }
};

export default rateLimitter;