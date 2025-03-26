import express from "express";
import { protectedRouter, router } from "./router/api.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(cookieParser());


app.use('/auth', router);
app.use('/api', protectedRouter);

app.listen(3001, () => console.log("Server listening on 3001"));