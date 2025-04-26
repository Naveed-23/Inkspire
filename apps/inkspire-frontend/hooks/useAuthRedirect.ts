"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import getToken from "@/lib/getToken";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function authCheck() {
        const token = await getToken();
        console.log("tokjen", token);
        if (!token) {
          router.replace("/");
        }
    }
    authCheck();
  }, [router]);
  
}
