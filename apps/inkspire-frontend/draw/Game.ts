import { Tool } from "@/components/Ink";
import { getExistingShapes } from "./getExistingShape";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    lineWidth: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
    color: string;
    lineWidth: number;
} | {
    type: "pencil";
    points: { x: number, y: number }[];
    color: string;
    lineWidth: number;
} | {
    type: "rhombus";
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    lineWidth: number;
} | {
    type: "arrow";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    lineWidth: number;
}

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle";
    private currentPencilPoints: { x: number; y: number }[] = [];
    private currentColor: string = "#ffffff";
    private currentLineWidth: number = 2;
    socket: WebSocket;
    
    // Panzoom variables
    private scale = 1;
    private panX = 0;
    private panY = 0;
    private isPanning = false;
    private lastPanPosition = { x: 0, y: 0 };

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandler();
        this.initMouseHandlers();
        this.initWheelHandler();
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
    }

    setColor(color: string) {
        this.currentColor = color;
    }

    setLineWidth(width: number) {
        this.currentLineWidth = width;
    }


    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("wheel", this.wheelHandler);
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    async initHandler() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
    
            if(message.type == "chat") {
                const parsedShape = JSON.parse(message.message);
                console.log("parsedShape", parsedShape);
                this.existingShapes.push(parsedShape.shape);
                this.clearCanvas();
            }
        }
    }

    // Convert screen coordinates to canvas coordinates
    private screenToCanvas(x: number, y: number) {
        return {
            x: (x - this.panX) / this.scale,
            y: (y - this.panY) / this.scale
        };
    }

    clearCanvas() {
        // Reset the transformation
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw black background (without transformations)
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply pan and zoom for shapes
        this.ctx.save();
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.scale, this.scale);
    
        // Draw existing shapes
        this.existingShapes.forEach((shape) => {
            this.drawShape(shape);
        });
    
        // Restore the context
        this.ctx.restore();
    }
    

    mouseDownHandler = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            // Middle mouse button or left button with Ctrl for panning
            this.isPanning = true;
            this.lastPanPosition = { x: mouseX, y: mouseY };
            this.canvas.style.cursor = "grabbing";
            return;
        }

        if (e.button !== 0) return; // Only proceed for left click
        
        const canvasPos = this.screenToCanvas(mouseX, mouseY);
        this.clicked = true;
        this.startX = canvasPos.x;
        this.startY = canvasPos.y;

        if(this.selectedTool === "pencil") {
            this.currentPencilPoints = [{ x: this.startX, y: this.startY }];
        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        if (this.isPanning) {
            this.isPanning = false;
            this.canvas.style.cursor = "default";
            return;
        }

        if (!this.clicked) return;
        
        this.clicked = false;
        const rect = this.canvas.getBoundingClientRect();
        const endPos = this.screenToCanvas(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
        const endX = endPos.x;
        const endY = endPos.y;

        const width = endX - this.startX;
        const height = endY - this.startY; 

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;

        if(selectedTool === "rect") {
            const x = width < 0 ? this.startX + width : this.startX;
            const y = height < 0 ? this.startY + height : this.startY;
            shape = {
                type: "rect",
                x,
                y,
                width: Math.abs(width),
                height: Math.abs(height),
                color: this.currentColor,
                lineWidth: this.currentLineWidth
            };
        } else if(selectedTool === "circle") {
            const centerX = this.startX + width / 2;
            const centerY = this.startY + height / 2;
            const radius = Math.sqrt(width * width + height * height) / 2;
            shape = {
                type: "circle",
                radius: Math.abs(radius),
                centerX,
                centerY,
                color: this.currentColor,
                lineWidth: this.currentLineWidth
            };
        } else if(selectedTool === "pencil") {
            if(this.currentPencilPoints.length > 1) {
                shape = {
                    type: "pencil",
                    points: [...this.currentPencilPoints],
                    color: this.currentColor,
                    lineWidth: this.currentLineWidth
                };
            }
            this.currentPencilPoints = [];
        } else if(selectedTool === "rhombus") {
            const x = width < 0 ? this.startX + width : this.startX;
            const y = height < 0 ? this.startY + height : this.startY;
            shape = {
                type: "rhombus",
                x,
                y,
                width: Math.abs(width),
                height: Math.abs(height),
                color: this.currentColor,
                lineWidth: this.currentLineWidth
            };
        } else if(selectedTool === "arrow") {
            shape = {
                type: "arrow",
                startX: this.startX,
                startY: this.startY,
                endX: endX,
                endY: endY,
                color: this.currentColor,
                lineWidth: this.currentLineWidth
            };
        }
        
        if(!shape) return;
        
        this.existingShapes.push(shape);
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId: this.roomId
        }));
    }

    mouseMoveHandler = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
    
        if (this.isPanning) {
            const dx = mouseX - this.lastPanPosition.x;
            const dy = mouseY - this.lastPanPosition.y;
            
            this.panX += dx;
            this.panY += dy;
            
            this.lastPanPosition = { x: mouseX, y: mouseY };
            this.clearCanvas();
            return;
        }
    
        if(this.clicked) {
            const canvasPos = this.screenToCanvas(mouseX, mouseY);
            const currentX = canvasPos.x;
            const currentY = canvasPos.y;
            
            this.clearCanvas();
            
            // Draw the preview shape
            this.ctx.save();
            this.ctx.translate(this.panX, this.panY);
            this.ctx.scale(this.scale, this.scale);
            this.ctx.strokeStyle = this.currentColor;
            this.ctx.lineWidth = this.currentLineWidth / this.scale;

    
            const width = currentX - this.startX;
            const height = currentY - this.startY;
            
            if(this.selectedTool === "rect") {
                const x = width < 0 ? this.startX + width : this.startX;
                const y = height < 0 ? this.startY + height : this.startY;
                this.ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));
            }
            else if(this.selectedTool === "circle") {
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
                const radius = Math.sqrt(width * width + height * height) / 2;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if(this.selectedTool === "pencil") {
                this.currentPencilPoints.push({x: currentX, y: currentY});
    
                this.ctx.beginPath();
                this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
                for(let i = 1; i < this.currentPencilPoints.length; i++) {
                    this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y);
                }
                this.ctx.stroke();
                this.ctx.closePath();
            } else if(this.selectedTool === "rhombus") {
                const x = width < 0 ? this.startX + width : this.startX;
                const y = height < 0 ? this.startY + height : this.startY;
                const w = Math.abs(width);
                const h = Math.abs(height);
                
                this.ctx.beginPath();
                this.ctx.moveTo(x + w/2, y);
                this.ctx.lineTo(x + w, y + h/2);
                this.ctx.lineTo(x + w/2, y + h);
                this.ctx.lineTo(x, y + h/2);
                this.ctx.closePath();
                this.ctx.stroke();
            }
            else if(this.selectedTool === "arrow") {
                this.drawArrow(this.ctx, this.startX, this.startY, currentX, currentY);
            }
            this.ctx.restore();
        }
    }

    wheelHandler = (e: WheelEvent) => {
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Get mouse position before zoom
        const worldMouseX = (mouseX - this.panX) / this.scale;
        const worldMouseY = (mouseY - this.panY) / this.scale;
        
        // Apply zoom
        const delta = -e.deltaY;
        const factor = 0.001;
        const newScale = this.scale * (1 + delta * factor);
        this.scale = Math.min(Math.max(0.1, newScale), 10); // Limit zoom
        
        // Adjust pan so zoom is centered on mouse
        this.panX = mouseX - worldMouseX * this.scale;
        this.panY = mouseY - worldMouseY * this.scale;
        
        this.clearCanvas();
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }

    initWheelHandler() {
        this.canvas.addEventListener("wheel", this.wheelHandler, { passive: false });
    }

    private drawShape(shape: Shape) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = shape.color;
        this.ctx.lineWidth = shape.lineWidth / this.scale;
        
        if(shape.type === "rect") {
            this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
        else if(shape.type === "circle") {
            this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
            this.ctx.stroke(); // Explicit stroke for circle
        }
        else if(shape.type === "pencil") {
            if (shape.points.length < 2) return;
            this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
            for (let i = 1; i < shape.points.length; i++) {
                this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
            }
            this.ctx.stroke(); // Explicit stroke for pencil
        } else if(shape.type === "rhombus") {
            const x = shape.x;
            const y = shape.y;
            const w = shape.width;
            const h = shape.height;
            
            this.ctx.moveTo(x + w/2, y);
            this.ctx.lineTo(x + w, y + h/2);
            this.ctx.lineTo(x + w/2, y + h);
            this.ctx.lineTo(x, y + h/2);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        else if(shape.type === "arrow") {
            this.drawArrow(this.ctx, shape.startX, shape.startY, shape.endX, shape.endY);
        }
        this.ctx.closePath();
    }

    // Helper function to draw an arrow
    private drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
        const headLength = 15 / this.scale;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        // Draw the shaft of the arrow
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        
        // Draw the head of the arrow
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
    }
}