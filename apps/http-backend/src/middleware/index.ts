import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try{
        const authHeaders = req.headers.authorization;
        const header = req.headers["authorization"];
        console.log("header", header);
        if(!authHeaders?.startsWith("Bearer ")){
            res.json({
                msg: "Incorrrect Headers"
            });
            return;
        }
        const words = authHeaders.split(' ');
        const token = words[1] as string;
        console.log("Token", token);
    
        const verifiedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        console.log("verifiedToken", verifiedToken);
        if(verifiedToken){
            req.body.userId =  verifiedToken?.userId;
            next();
            return;
        }
        res.json({
            msg: "Authentication failed"
        });
    }catch(err){
        res.json({
            err
        });
        return;
    }
}