import express, { Router } from "express";
import { CreateRoomController } from "../controllers/CreateRoomController.js";
import { SigninController } from "../controllers/SigninController.js";
import { SignupController } from "../controllers/SignupController.js";
import { authMiddleware } from "../middleware/index.js";
import { GetChatsController } from "../controllers/GetChatsController.js";
import { GetRoomIdController } from "../controllers/GetRoomIdController.js";
import { GetRoomsController } from "../controllers/GetRoomsController.js";
import { GetTokenController } from "../controllers/GetTokenController.js";

export const router: Router = express.Router();

export const protectedRouter: Router = express.Router();


router.post('/signup', SignupController);
router.post('/signin', SigninController);
router.get('/rooms', GetRoomsController);

protectedRouter.get("/get-token", GetTokenController);

protectedRouter.post('/room', authMiddleware, CreateRoomController);
protectedRouter.get('/chats/:roomId', authMiddleware, GetChatsController);
protectedRouter.get('/room/:slug', authMiddleware, GetRoomIdController);
