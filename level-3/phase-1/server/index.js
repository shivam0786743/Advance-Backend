import express from "express";
import dotenv from "dotenv";
import connectDb from "./lib/db.js";
import User from "./model/user.model.js";
import Redis from "ioredis";
import rateLimitter from "./middleware/ratelimit.js";

import emailQueue from "./queue.js";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
app.use(express.json());
// app.use(rateLimitter)
app.get("/", (req, res) => {
    res.send(`hello i am shivam dhiman from port number ${process.env.SERVER_NAME}`);
});

app.post('/create', async (req, res) => {



    const { name, email, password } = req.body;
    await redis.del("user:all")
    if (!name || !email || !password) {
        return res.status(400).json({ message: "all fields are required" });
    }


    const user = await User.create({
        name, email, password
    });

    // Email job ko queue mein add kiya (Background processing ke liye)
    await emailQueue.add("sendWelcomeEmail", {
        userId: user._id,
        name: user.name,
        email: user.email,
    });

    return res.status(201).json({ message: "user created successfully", user });
})

app.get("/get", rateLimitter, async (req, res) => {
    const user = await User.find();
    return res.status(200).json({ user })
})

app.get("/redis-get", async (req, res) => {
    try {
        const cached = await redis.get("user:all");
        if (cached) {
            return res.status(200).json({ user: JSON.parse(cached), source: "redis" });
        }

        const user = await User.find({});
        await redis.set("user:all", JSON.stringify(user));

        return res.status(200).json({ user, source: "database" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    connectDb();
    console.log(`server is started ${port}`);
})

