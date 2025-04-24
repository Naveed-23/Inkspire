import { Request, Response } from "express";
import { SigninSchema } from "@repo/common-folder/types";
import { prismaClient } from "@repo/db/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export const SigninController = async (req: Request, res: Response) => {
    const { success } = SigninSchema.safeParse(req.body);
    if(!success){
        res.json({
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
            // Set token in HTTP-only cookie
            res.cookie("token", token, {
                httpOnly: true, // Prevent access via JavaScript (XSS protection)
                secure: process.env.NODE_ENV === "production",  // HTTPS in production
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 1000 // 7 days
            })
            res.json({
                msg: "User Successfully logged in",
                token
            });
            return;
        }
        res.json({
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