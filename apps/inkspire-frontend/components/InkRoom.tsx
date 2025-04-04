"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import Ink from "./Ink";

export default function InkRoom({ roomId }: {roomId: string}){
    
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxYjViZjk2ZS1kZWRjLTRhNTktODEwOS0zMTBkZDRhOGE1MWMiLCJpYXQiOjE3NDM3OTA5NzR9.GwPcflUnvccKRC4FI6fNmtYv1ex0AE-lD9rEfmBqhco`);

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }

    },[])
     
    if(!socket){
        return <div>
            Connecting to server...
        </div>
    }

    return <Ink socket={socket} roomId={roomId} />
}