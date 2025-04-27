import axios from "axios";
import { toast } from "sonner";

export default async function getToken(){
    try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_BACKEND}/api/get-token`, {
            withCredentials: true
        });
    
        return res.data.token;
    }
    catch(err){
        console.log(err)
        toast.error("Unauthorised Please Login first")
    }
}