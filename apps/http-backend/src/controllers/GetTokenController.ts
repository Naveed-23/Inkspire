import { Request, Response } from "express";

interface TokenResponse {
    token: string | null;
}

export const GetTokenController = (req: Request, res: Response<TokenResponse>): void => {
    try {
        const token = req.cookies?.token;
        console.log(req.cookies,"cookies")
        console.log(token, "token")
        
        if (!token) {
            res.status(401).json({ token: null });
            return; // Just return, don't return the response
        }
        
        res.status(200).json({ token });
        
    } catch (error) {
        console.error('Error in GetTokenController:', error);
        res.status(500).json({ token: null });
    }
}