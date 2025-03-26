"use client";

import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SigninSchema, SignupSchema } from "@repo/common-folder/types";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";

type SigninFormData = z.infer<typeof SigninSchema>;
type SignupFormData = z.infer<typeof SignupSchema>;


export function AuthPage({ isSignin }: { isSignin: boolean}){
    const { reset, register, handleSubmit, setError, formState: { errors }} = useForm<SignupFormData | (SigninFormData & Partial<SignupFormData>)>();
    const router = useRouter();

    async function onSubmit(data: SigninFormData | SignupFormData) {
        const parsedData = (!isSignin ? SignupSchema.safeParse(data) : SigninSchema.safeParse(data)); 

        if(!parsedData.success){
            console.log("parsedData", parsedData);
            parsedData.error.errors.forEach(err => {
                setError(err.path[0] as keyof (SigninFormData | SignupFormData), { message: err.message})
            });
            return;
        }
        const requestData = isSignin
      ? { email: parsedData.data.email, password: parsedData.data.password }
      : { email: parsedData.data.email, password: parsedData.data.password, name: (parsedData.data as SignupFormData).name };

      const res = await axios.post(`${HTTP_BACKEND}/auth/${isSignin ? 'signin' : 'signup'}`, requestData, { withCredentials: true });
      console.log("res", res);
      if(res){
        router.push('/ink')
      }
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
                  {errors.name?.message && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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