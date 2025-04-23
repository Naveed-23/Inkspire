import { prismaClient } from "@repo/db/index";
import { Request, Response } from "express";


export const GetRoomsController = async (req: Request, res: Response) => {
    const messages = await prismaClient.room.findMany();

    console.log(messages);

    res.json({
        messages
    })
}