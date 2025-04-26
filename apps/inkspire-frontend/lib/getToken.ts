import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export default async function getToken(){
    const res = await axios.get(`${HTTP_BACKEND}/api/get-token`, {
        withCredentials: true
    });

    return res.data.token;
}