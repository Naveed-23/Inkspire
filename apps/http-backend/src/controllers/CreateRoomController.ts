import { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/common-folder/types";
import { prismaClient } from "@repo/db/index";
import { AuthenticatedRequest } from "../middleware/index.js";

export const CreateRoomController = async (req: AuthenticatedRequest, res: Response) => {
    const parsedData= CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            msg: "Invalid Inputs"
        });
        return;
    }
    const user = req.user;
    console.log("userId here", user);
    if(!user){
        res.json({
            msg: "Authentication Failed"
        })
        return;
    }
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: user.userId
            }
        })
        res.json({
            msg: room.id
        });
        return;
    }catch(e){
        res.status(411).json({
            msg: "Room already exists with this name"
        })
    }
    
}