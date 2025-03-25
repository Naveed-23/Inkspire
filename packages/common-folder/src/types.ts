import { z } from "zod";

export const SignupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    name: z.string(),
    photo: z.string().optional()
});

export const SigninSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(5, "Password must be at least 5 characters"),
});

export const CreateRoomSchema = z.object({
    name: z.string(),
});
