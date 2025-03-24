import { prismaClient } from "@repo/db/index";
import { Request, Response } from "express";


export const GetRoomIdController = async (req: Request, res: Response) => {
    const slug = req.params.slug;

    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    });
}