import { Request, Response } from "express";
import { SigninSchema } from "@repo/common-folder/types";
import { prismaClient } from "@repo/db/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export const SigninController = async (req: Request, res: Response) => {
    const { success } = SigninSchema.safeParse(req.body);
    if(!success){
        res.status(401).json({
            msg: "Invalid Inputs"
        })
        return;
    }
    try{
        const { email, password } = req.body;
        const user = await prismaClient.user.findUnique({
            where: {
                email
            }
        });
        if(!user){
            res.status(404).json({
                msg: "User not exist"
            });
            return;
        }
        const verifyPass = await bcrypt.compareSync(password, user.password);
        if(verifyPass){
            const userId = user.id;
            const token = jwt.sign({userId}, JWT_SECRET);
            console.log("token", token);
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // ⛔ HTTPS only - must be false for localhost
                sameSite: "lax", // ✅ lax works fine in development
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/"
              });               
            res.status(200).json({
                msg: "User Successfully logged in",
                token
            });
            return;
        }
        res.status(401).json({
            msg: "Invalid Password"
        });
        return;
    }catch(err){
        res.json({
            err
        });
        return;
    }
}