import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { toast } from "sonner";

export default async function getToken(){
    try{
        const res = await axios.get(`${HTTP_BACKEND}/api/get-token`, {
            withCredentials: true
        });
    
        return res.data.token;
    }
    catch(err){
        toast.error("Unauthorised Please Login first")
    }
}