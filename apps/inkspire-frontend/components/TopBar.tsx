import { Tool } from "./Ink";
import { ArrowRight, Circle, Diamond, Mouse, PencilIcon, RectangleHorizontalIcon } from "lucide-react";
import { ToolButton } from "./ui/tool-button";

export function TopBar({ 
    selectedTool, 
    onToolSelect,
    color,
    onColorChange,
    lineWidth,
    onLineWidthChange
}: {
    selectedTool: Tool,
    onToolSelect: (tool: Tool) => void,
    color: string,
    onColorChange: (color: string) => void,
    lineWidth: number,
    onLineWidthChange: (width: number) => void
}) {
    return (
        <nav className="bg-white/10 backdrop-blur-md border border-white/10 shadow-xl rounded-xl px-4 py-1 mt-2">
            <div className="flex items-center gap-4">
                {/* Tools Group */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
                    <ToolButton 
                        tool="mouse" 
                        icon={<Mouse className="h-5 w-5" />}
                        selectedTool={selectedTool}
                        onToolSelect={onToolSelect}
                        title="Pointer"
                    />
                    <ToolButton 
                        tool="pencil" 
                        icon={<PencilIcon className="h-5 w-5" />}
                        selectedTool={selectedTool}
                        onToolSelect={onToolSelect}
                        title="Pencil"
                    />
                    <div className="h-6 w-px bg-white/20 mx-1"></div>
                    <ToolButton 
                        tool="rect" 
                        icon={<RectangleHorizontalIcon className="h-5 w-5" />}
                        selectedTool={selectedTool}
                        onToolSelect={onToolSelect}
                        title="Rectangle"
                    />
                    <ToolButton 
                        tool="circle" 
                        icon={<Circle className="h-5 w-5" />}
                        selectedTool={selectedTool}
                        onToolSelect={onToolSelect}
                        title="Circle"
                    />
                    <ToolButton 
                        tool="rhombus" 
                        icon={<Diamond className="h-5 w-5" />}
                        selectedTool={selectedTool}
                        onToolSelect={onToolSelect}
                        title="Rhombus"
                    />
                    <ToolButton 
                        tool="arrow" 
                        icon={<ArrowRight className="h-5 w-5" />}
                        selectedTool={selectedTool}
                        onToolSelect={onToolSelect}
                        title="Arrow"
                    />
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-white/20"></div>

                {/* Color Picker */}
                <div className="flex items-center gap-2">
                    <label htmlFor="color-picker" className="text-xs font-medium text-white/80">Color</label>
                    <div className="relative">
                        <input 
                            type="color" 
                            id="color-picker" 
                            className="w-8 h-8 rounded-lg border-2 border-white/20 cursor-pointer appearance-none bg-transparent"
                            value={color}
                            onChange={(e) => onColorChange(e.target.value)}
                        />
                        <div 
                            className="absolute inset-0 rounded-lg border border-black/20 pointer-events-none"
                            style={{ backgroundColor: color }}
                        ></div>
                    </div>
                </div>

                {/* Stroke Width */}
                <div className="flex items-center gap-2">
                    <label htmlFor="stroke-width" className="text-xs font-medium text-white/80">Stroke</label>
                    <select 
                        id="stroke-width"
                        className="bg-white/5 text-white text-sm rounded-lg px-3 py-1 border border-white/20 focus:ring-2 focus:ring-white/30 focus:outline-none"
                        value={lineWidth}
                        onChange={(e) => onLineWidthChange(Number(e.target.value))}
                    >
                        <option value="1">1px</option>
                        <option value="2">2px</option>
                        <option value="3">3px</option>
                        <option value="5">5px</option>
                        <option value="8">8px</option>
                        <option value="10">10px</option>
                    </select>
                </div>
            </div>
        </nav>
    );
}