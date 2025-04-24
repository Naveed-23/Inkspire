import { Request, Response } from "express";
import { SignupSchema } from "@repo/common-folder/types";
import { prismaClient } from "@repo/db/index";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import bcrypt from "bcrypt";

export const SignupController = async (req: Request, res: Response) => {
    const { success } = SignupSchema.safeParse(req.body);
    if(!success){
        res.json({
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
            res.json({
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
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.json({
                msg: "User successfully Created",
                token
            });
            return;
        }
        res.json({
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