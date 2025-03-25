import { AuthPage } from "@/components/AuthPage";

export default function Signin() {
    return <div className="w-screen h-screen flex justify-center items-center">
        <AuthPage isSignin={true} />
    </div>
}