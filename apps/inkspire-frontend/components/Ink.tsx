import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { Circle, PencilIcon, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil"

export default function Ink({ roomId, socket }: {
    roomId: string,
    socket: WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle");

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game])

    useEffect(() => {
        if(canvasRef.current){
            const g = new Game(canvasRef.current, roomId, socket)
            setGame(g);
            

            // Cleanup panzoom on unmount
            return () => {
                g.destroy();
            };
            
        }

    }, [canvasRef]);
    
      
    
    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <div className="flex gap-2">
            {/* Make a Top Bar Component */}
            <IconButton activated={selectedTool === "circle"} onClick={() => {
                setSelectedTool("circle")
            }} icon={<Circle/>}/>
            <IconButton activated={selectedTool === "rect"} onClick={() => {
                setSelectedTool("rect")
            }} icon={<RectangleHorizontalIcon />}/>
            <IconButton activated={selectedTool === "pencil"} onClick={() => {
                setSelectedTool("pencil")
            }} icon={<PencilIcon />}/>
        </div>
        <div
            id="canvas-container"
            style={{
                width: "100%",
                height: "100%",
                position: "relative"
            }}
            >
            <canvas
                id="canvas"
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{
                display: "block",
                }}
            />
            </div>
    </div>
}



