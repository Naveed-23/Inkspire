import { prismaClient } from "@repo/db/index";
import { Request, Response } from "express";


export const GetRoomsController = async (req: Request, res: Response) => {
    console.log("hi there")
    const messages = await prismaClient.room.findMany();

    console.log(messages);

    res.json({
        messages
    })
}