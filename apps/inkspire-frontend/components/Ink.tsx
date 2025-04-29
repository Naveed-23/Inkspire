import { useEffect, useRef, useState } from "react";
import { Game } from "@/draw/Game";
import { TopBar } from "./TopBar";

export type Tool = "circle" | "rect" | "pencil" | "rhombus" | "arrow" | "mouse"


export default function Ink({ roomId, socket }: {
    roomId: string,
    socket: WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle");
    const [color, setColor] = useState("#ffffff");
    const [lineWidth, setLineWidth] = useState(2);

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game])

    useEffect(() => {
        game?.setColor(color);
    }, [color, game])

    useEffect(() => {
        game?.setLineWidth(lineWidth);
    }, [lineWidth, game])

    useEffect(() => {
        if(canvasRef.current){
            const g = new Game(canvasRef.current, roomId, socket)
            setGame(g);
        
            return () => {
                g.destroy();
            };
        }
    }, [canvasRef, roomId, socket]);
    
    return (
        <div style={{ height: "100vh", overflow: "hidden" }} className="bg-black">
            <div className="flex gap-2 justify-center">
                <TopBar 
                    selectedTool={selectedTool} 
                    onToolSelect={setSelectedTool}
                    color={color}
                    onColorChange={setColor}
                    lineWidth={lineWidth}
                    onLineWidthChange={setLineWidth}
                />
            </div>
            <div className="scroll-smooth" id="canvas-container" style={{
                width: "100%",
                height: "100%",
                position: "relative"
            }}>
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    style={{ display: "block" }}
                />
            </div>
        </div>
    )
}



