import { ReactNode, useEffect, useRef, useState } from "react";
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
        <div className="flex gap-2 justify-center">
            {/* Make a Top Bar Component */}
            <TopBar selectedTool={selectedTool} onToolSelect={setSelectedTool} />
        </div>
        <div className="scroll-smooth"
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


function TopBar({ selectedTool, onToolSelect }: {
    selectedTool: Tool,
    onToolSelect: (tool: Tool) => void
}) {
    return (
        <nav className="bg-gray-800 text-white shadow-lg rounded-full pl-6 pr-6 mt-1 py-1">
            <div className="flex items-center space-x-2">
                {/* Circle Tool */}
                <button
                    onClick={() => onToolSelect("circle")}
                    className={`p-2 rounded-md hover:bg-gray-700 ${selectedTool === "circle" ? "bg-gray-600" : ""}`}
                    title="Circle"
                >
                    <Circle className="h-5 w-5" />
                </button>

                {/* Rectangle Tool */}
                <button
                    onClick={() => onToolSelect("rect")}
                    className={`p-2 rounded-md hover:bg-gray-700 ${selectedTool === "rect" ? "bg-gray-600" : ""}`}
                    title="Rectangle"
                >
                    <RectangleHorizontalIcon className="h-5 w-5" />
                </button>

                {/* Pencil Tool */}
                <button
                    onClick={() => onToolSelect("pencil")}
                    className={`p-2 rounded-md hover:bg-gray-700 ${selectedTool === "pencil" ? "bg-gray-600" : ""}`}
                    title="Pencil"
                >
                    <PencilIcon className="h-5 w-5" />
                </button>

                {/* Color picker */}
                <div className="flex items-center ml-auto">
                    <label htmlFor="color-picker" className="sr-only">Color</label>
                    <input 
                        type="color" 
                        id="color-picker" 
                        className="w-8 h-8 rounded-md border border-gray-600 cursor-pointer"
                        defaultValue="#ffffff"
                    />
                </div>

                {/* Stroke width selector */}
                <select 
                    className="bg-gray-700 text-white text-sm rounded-md p-1 border border-gray-600"
                    defaultValue="2"
                >
                    <option value="1">1px</option>
                    <option value="2">2px</option>
                    <option value="3">3px</option>
                    <option value="5">5px</option>
                </select>
            </div>
        </nav>
    );
}
