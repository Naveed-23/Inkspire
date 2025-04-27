import { Request, Response } from "express";
import { SignupSchema } from "@repo/common-folder/types";
import { prismaClient } from "@repo/db/index";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import bcrypt from "bcrypt";

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
            //     secure: process.env.NODE_ENV === "production",
            //     sameSite: "lax",
            //     maxAge: 7 * 24 * 60 * 60 * 1000
            // })
            res.cookie("token", token, {
                httpOnly: true,
                secure: true, // Always true in production
                sameSite: "none", // Required for cross-site cookies
                maxAge: 7 * 24 * 60 * 1000,
                domain: process.env.NODE_ENV === "production" ? "https://inkspire.naveedhussain.tech" : "http:localhost:3000", // Set your production domain
                path: "/"
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