import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';

export interface AuthenticatedRequest extends Request {
    user?: { userId: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Get the token from cookies instead of headers
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ msg: "Unauthorized: No token provided" });
            return;
        }

        // Verify token
        const verifiedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        console.log("verifiedToken", verifiedToken);
        
        // Attach user info to request object
        req.user = { userId: verifiedToken.userId };

        next(); // Proceed to next middleware/route
    } catch (err) {
        res.status(401).json({ msg: "Unauthorized: Invalid token" });
        return;
    }
}