import { Tool } from "../Ink";

// Helper component for tool buttons
export function ToolButton({
    tool,
    icon,
    selectedTool,
    onToolSelect,
    title
}: {
    tool: Tool,
    icon: React.ReactNode,
    selectedTool: Tool,
    onToolSelect: (tool: Tool) => void,
    title: string
}) {
    return (
        <button
            onClick={() => onToolSelect(tool)}
            className={`p-2 rounded-md transition-all ${selectedTool === tool ? 
                'bg-white/20 text-white shadow-sm' : 
                'text-white/70 hover:text-white hover:bg-white/10'}`}
            title={title}
        >
            {icon}
        </button>
    );
}