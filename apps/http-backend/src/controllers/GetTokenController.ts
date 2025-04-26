import { Request, Response } from "express";

export const GetTokenController = (req: Request, res: Response) => {
    const token = req.cookies?.token;
  
    if (!token) {
        res.status(401).json({ token: null });
    }
  
    res.status(200).json({ token });
}