import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.get("/", (req, res) => {
    res.send("Hello Docker from phase 2!");
});
app.listen(port, () => {
    console.log(`server is started ${port}`);
})

