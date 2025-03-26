import { Request, Response } from "express";

export const LogOutController = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ msg: "Logged out Successfully"})
}