"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import Ink from "./Ink";
import { ConnectionLoader } from "./ui/Loader";

export default function InkRoom({ roomId }: {roomId: string}){
    
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiOTg3ZWZlNy1jZWQxLTRlZmMtYmNhMi1kNzhkYzMzZTNjODUiLCJpYXQiOjE3NDUyODY5NzN9.n2AQXyoFGHRrx21m2eNf3FnaPuORdmB19faZ7SKR_uc`);

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }

    },[])
     
    if(!socket){
        return <ConnectionLoader />
    }

    return <Ink socket={socket} roomId={roomId} />
}