import { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/common-folder/types";
import { prismaClient } from "@repo/db/index";

export const CreateRoomController = async (req: Request, res: Response) => {
    const parsedData= CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            msg: "Invalid Inputs"
        });
        return;
    }
    const userId = req.body.userId;
    console.log("userId", userId);
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
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