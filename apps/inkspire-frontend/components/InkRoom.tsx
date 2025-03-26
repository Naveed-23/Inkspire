"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import Ink from "./Ink";

export default function InkRoom({ roomId }: {roomId: string}){
    
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmZTQwN2I1NS1iMDI5LTQ1MTAtODEyYi03OTlkYjI1MjA5MmIiLCJpYXQiOjE3NDI4OTEzNTl9.xtLUZQDKdcl9CZSP1hui0HEtMb_PNl_y6Qab9JEGjm8`);

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