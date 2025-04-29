import { Request, Response } from "express";
import { SignupSchema } from "@repo/common-folder/types";
import { prismaClient } from "@repo/db/index";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import bcrypt from "bcrypt";

const isProduction = process.env.NODE_ENV === "production";

export const SignupController = async (req: Request, res: Response) => {
    const { success } = SignupSchema.safeParse(req.body);
    if(!success){
        res.status(401).json({
            msg: "Invalid Inputs"
        })
        return;
    }
    try{
        const { email, password, name } = req.body;
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email
            }
        });
        if(existingUser){
            res.status(402).json({
                msg: "User already exists"
            })
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await prismaClient.user.create({
            data: {
                email,
                password: hashPassword,
                name
            }
        });
        if(user){
            const userId = user?.id;
            const token = jwt.sign({userId}, JWT_SECRET);
            // res.cookie("token", token, {
            //     httpOnly: true,
            //     secure: false, // ⛔ HTTPS only - must be false for localhost
            //     sameSite: "lax", // ✅ lax works fine in development
            //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            //     path: "/"
            //   });   
            res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                domain: isProduction ? ".naveedhussain.tech" : undefined,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            });                                         
            res.status(200).json({
                msg: "User successfully Created",
                token
            });
            return;
        }
        res.status(401).json({
            msg: "Failed to Create User"
        });
        return;
    }catch(err){
        res.json({
            err
        });
        return;
    }
}