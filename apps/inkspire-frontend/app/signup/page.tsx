import { AuthPage } from "@/components/AuthPage";

export default function Signup() {
    return <div className="w-screen h-screen flex justify-center items-center">
        <AuthPage isSignin={false} />
    </div>
}