import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";


dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
// app.use(rateLimitter)
app.get("/", (req, res) => {
    res.send({ message: `Hello from ${process.env.SERVER_NAME || 'backend gateway'}` });
});

app.use("/auth", proxy("http://auth-service:8001"));
app.use("/order", proxy("http://order-service:8003"));
app.use("/product", proxy("http://product-service:8002"));



app.post('/create', async (req, res) => {



    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "all fields are required" });
    }


    const user = await User.create({
        name, email, password
    });



    return res.status(201).json({ message: "user created successfully", user });
})

app.get("/get", async (req, res) => {
    const user = await User.find();
    return res.status(200).json({ user })
})




app.listen(port, () => {
    console.log(`server is started ${port}`);
})

