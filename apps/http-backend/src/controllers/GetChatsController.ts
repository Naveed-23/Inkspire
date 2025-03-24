import { prismaClient } from "@repo/db/index";
import { Request, Response } from "express";


export const GetChatsController = async (req: Request, res: Response) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: 'desc'
        },
        take: 50
    });

    res.json({
        messages
    })
}