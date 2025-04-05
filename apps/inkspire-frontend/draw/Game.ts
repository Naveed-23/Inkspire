import { Tool } from "@/components/Ink";
import { getExistingShapes } from "./getExistingShape";


type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;

} | {
    type: "pencil";
    points: { x: number, y: number }[];
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
    socket: WebSocket;

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
    }

    setTool(tool: Tool){
        this.selectedTool = tool;
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId)
        this.clearCanvas();
    }

    async initHandler(){
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
    
            if(message.type == "chat"){
                const parsedShape = JSON.parse(message.message);
                console.log("parsedShape", parsedShape);
                this.existingShapes.push(parsedShape.shape);
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            if(shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)";
                this.drawShape(shape);
            }else if(shape.type === "circle"){
                this.drawShape(shape);
            }
            else if (shape.type === "pencil"){
                this.drawShape(shape);
            }
        })
    }

    mouseDownHandler = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        this.clicked = true;
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;

        console.log("Mouse Down at", this.startX, this.startY);

        if(this.selectedTool === "pencil"){
            this.currentPencilPoints = [{ x: this.startX, y: this.startY }];
        }
    }

    
    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;
        const rect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const width = endX - this.startX;
        const height = endY - this.startY; 

        const selectedTool = this.selectedTool;

        console.log("Mouse Up at", endX, endY);
        console.log("Width and Height", width, height);
        let shape: Shape | null = null;

        if(selectedTool === "rect"){
            const x = width < 0 ? this.startX + width : this.startX;
            const y = height < 0 ? this.startY + height : this.startY;
            shape = {
                type: "rect",
                x,
                y,
                width: Math.abs(width),
                height: Math.abs(height),
            };
        }else if(selectedTool === "circle"){
            const centerX = this.startX + width / 2;
            const centerY = this.startY + height / 2;
            
            const radius = Math.sqrt(width * width + height * height) / 2;
            shape= {
                type: "circle",
                radius: Math.abs(radius),
                centerX,
                centerY
            };
        }else if(selectedTool === "pencil"){
            if(this.currentPencilPoints.length > 1) {
                shape = {
                    type: "pencil",
                    points: [...this.currentPencilPoints]
                };
            }
            this.currentPencilPoints = [];
        }
        
        if(!shape){
            return;
        }
        console.log("shape", shape)
        this.existingShapes.push(shape);
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))
        
    }

    mouseMoveHandler = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if(this.clicked){
            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255, 255, 255)";

            const width = mouseX - this.startX;
            const height = mouseY - this.startY;
            
            const selectedTool = this.selectedTool
        if(selectedTool === "rect"){
            const x = width < 0 ? this.startX + width : this.startX;
            const y = height < 0 ? this.startY + height : this.startY;
            this.ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));
        }
        else if(selectedTool === "circle"){
            const centerX = this.startX + width / 2;
            const centerY = this.startY + height / 2;
            const radius = Math.sqrt(width * width + height * height) / 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();
        }
        else if(selectedTool === "pencil"){
            this.currentPencilPoints.push({x: mouseX, y: mouseY});

            // Draw Shape
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
            for(let i=1; i<this.currentPencilPoints.length; i++){
                this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y);
            }
            this.ctx.stroke();
            this.ctx.closePath();

        }
        }

    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
    }

    private drawShape(shape: Shape) {
        this.ctx.beginPath();
        if(shape.type === "rect"){
            this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
        else if(shape.type === "circle"){
            this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
            
        }
        else if(shape.type === "pencil"){
            if (shape.points.length < 2) return;
            this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
            for (let i = 1; i < shape.points.length; i++) {
                this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
            }
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }


}