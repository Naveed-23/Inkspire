"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateRoom() {
    const [room, setRoom] = useState("");
    const router = useRouter();
    async function handleRoom() {
        const res = await axios.post(`${HTTP_BACKEND}/api/room`, {
            name: room
        },{
            withCredentials: true,
        });
        console.log("RESPONSE",res.data);
        if(res?.data?.msg){
            router.push(`/ink/${res.data.msg}`)
        }
    }
    return <div>
        <Label>Create a Room</Label>
        <Input placeholder="Enter room name" value={room} onChange={(e) => setRoom(e.target.value)} />
        <Button className="cursor-pointer" onClick={handleRoom}>Submit</Button>
    </div>
}