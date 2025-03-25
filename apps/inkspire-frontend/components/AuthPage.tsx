"use client";

import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignupSchema } from "@repo/common-folder/types";

type AuthFormData = z.infer<typeof SignupSchema>;

export function AuthPage({ isSignin }: { isSignin: boolean}){
    const { reset, register, handleSubmit, setError, formState: { errors }} = useForm<AuthFormData>();

    function onSubmit(data: AuthFormData) {
        const parsedData = SignupSchema.safeParse(data);

        if(!parsedData.success){
            console.log("parsedData", parsedData);
            parsedData.error.errors.forEach(err => {
                setError(err.path[0] as keyof AuthFormData, { message: err.message})
            });
            return;
        }
        console.log("Form Data", data);
    }    
    
    return (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>{isSignin ? "Login to your Account" : "Create an Account"}</CardTitle>
            <CardDescription>
          {isSignin ? (
            <>
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </>
          )}
        </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                {!isSignin && <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name", { required: !isSignin })} placeholder="John Snow" />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Email</Label>
                  <Input id="email" {...register("email", {required: "Email is required"})} placeholder="johnsnow@gmail.com" />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email?.message}</p>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Password</Label>
                  <Input id="password" {...register("password", {required: "Password is required"})} placeholder="nothing123" type="password" />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
              </div>
          <CardFooter className="flex justify-between mt-4 p-[-4px]">
            <Button className="cursor-pointer" variant="outline" type="button" onClick={() => reset()}>Cancel</Button>
            <Button className="cursor-pointer" type="submit">{isSignin ? "Sign in" : "Sign up"}</Button>
          </CardFooter>
            </form>
          </CardContent>
        </Card>
      )
}