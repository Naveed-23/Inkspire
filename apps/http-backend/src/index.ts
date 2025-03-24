import express from "express";
import { protectedRouter, router } from "./router/api.js";

const app = express();

app.use(express.json());

app.use('/auth', router);
app.use('/api', protectedRouter);

app.listen(3001, () => console.log("Server listening on 3001"));