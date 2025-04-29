import express from "express";
import { protectedRouter, router } from "./router/api.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();


const port = process.env.PORT || 3001; 

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://inkspire.naveedhussain.tech"],
    credentials: true,
}));
app.use(cookieParser());


app.use('/auth', router);
app.use('/api', protectedRouter);

app.get('/status',(req, res) => {
    res.status(200).json("Backend is runinng");
})

app.listen(port , () => console.log("Server listening on 3001"));