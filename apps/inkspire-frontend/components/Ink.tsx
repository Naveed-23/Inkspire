import { ctxDraw } from "@/draw";
import { useEffect, useRef } from "react";


export default function Ink({ roomId, socket }: {
    roomId: string,
    socket: WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(canvasRef.current){
            ctxDraw(canvasRef.current, roomId, socket);
        }
    }, [canvasRef]);
    
    return <div>
        <canvas ref={canvasRef} width={2000} height={1000}></canvas>
    </div>
}