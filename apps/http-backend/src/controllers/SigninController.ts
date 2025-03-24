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
            res.json({
                msg: "User not exist"
            });
            return;
        }
        const verifyPass = await bcrypt.compareSync(password, user.password);
        if(verifyPass){
            const userId = user.id;
            const token = jwt.sign({userId}, JWT_SECRET);
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