// import { Tool } from "@/components/Ink";
// import { getExistingShapes } from "./getExistingShape";


// type Shape = {
//     type: "rect";
//     x: number;
//     y: number;
//     width: number;
//     height: number;
// } | {
//     type: "circle";
//     centerX: number;
//     centerY: number;
//     radius: number;

// } | {
//     type: "pencil";
//     points: { x: number, y: number }[];
// }

// export class Game {

//     private canvas: HTMLCanvasElement;
//     private ctx: CanvasRenderingContext2D;
//     private existingShapes: Shape[];
//     private roomId: string;
//     private clicked: boolean;
//     private startX = 0;
//     private startY = 0;
//     private selectedTool: Tool = "circle";
//     private currentPencilPoints: { x: number; y: number }[] = [];
//     socket: WebSocket;

//     constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
//         this.canvas = canvas;
//         this.ctx = canvas.getContext("2d")!;
//         this.existingShapes = [];
//         this.roomId = roomId;
//         this.socket = socket;
//         this.clicked = false;
//         this.init();
//         this.initHandler();
//         this.initMouseHandlers();
//     }

//     setTool(tool: Tool){
//         this.selectedTool = tool;
//     }

//     destroy() {
//         this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

//         this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

//         this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
//     }

//     async init() {
//         this.existingShapes = await getExistingShapes(this.roomId)
//         this.clearCanvas();
//     }

//     async initHandler(){
//         this.socket.onmessage = (event) => {
//             const message = JSON.parse(event.data);
    
//             if(message.type == "chat"){
//                 const parsedShape = JSON.parse(message.message);
//                 console.log("parsedShape", parsedShape);
//                 this.existingShapes.push(parsedShape.shape);
//                 this.clearCanvas();
//             }
//         }
//     }

//     clearCanvas() {
//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.ctx.fillStyle = "rgba(0, 0, 0)"
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//         this.existingShapes.map((shape) => {
//             if(shape.type === "rect") {
//                 this.ctx.strokeStyle = "rgba(255, 255, 255)";
//                 this.drawShape(shape);
//             }else if(shape.type === "circle"){
//                 this.drawShape(shape);
//             }
//             else if (shape.type === "pencil"){
//                 this.drawShape(shape);
//             }
//         })
//     }

//     mouseDownHandler = (e: MouseEvent) => {
//         const rect = this.canvas.getBoundingClientRect();
//         this.clicked = true;
//         this.startX = e.clientX - rect.left;
//         this.startY = e.clientY - rect.top;

//         console.log("Mouse Down at", this.startX, this.startY);

//         if(this.selectedTool === "pencil"){
//             this.currentPencilPoints = [{ x: this.startX, y: this.startY }];
//         }
//     }

    
//     mouseUpHandler = (e: MouseEvent) => {
//         this.clicked = false;
//         const rect = this.canvas.getBoundingClientRect();
//         const endX = e.clientX - rect.left;
//         const endY = e.clientY - rect.top;

//         const width = endX - this.startX;
//         const height = endY - this.startY; 

//         const selectedTool = this.selectedTool;

//         console.log("Mouse Up at", endX, endY);
//         console.log("Width and Height", width, height);
//         let shape: Shape | null = null;

//         if(selectedTool === "rect"){
//             const x = width < 0 ? this.startX + width : this.startX;
//             const y = height < 0 ? this.startY + height : this.startY;
//             shape = {
//                 type: "rect",
//                 x,
//                 y,
//                 width: Math.abs(width),
//                 height: Math.abs(height),
//             };
//         }else if(selectedTool === "circle"){
//             const centerX = this.startX + width / 2;
//             const centerY = this.startY + height / 2;
            
//             const radius = Math.sqrt(width * width + height * height) / 2;
//             shape= {
//                 type: "circle",
//                 radius: Math.abs(radius),
//                 centerX,
//                 centerY
//             };
//         }else if(selectedTool === "pencil"){
//             if(this.currentPencilPoints.length > 1) {
//                 shape = {
//                     type: "pencil",
//                     points: [...this.currentPencilPoints]
//                 };
//             }
//             this.currentPencilPoints = [];
//         }
        
//         if(!shape){
//             return;
//         }
//         console.log("shape", shape)
//         this.existingShapes.push(shape);
//         this.socket.send(JSON.stringify({
//             type: "chat",
//             message: JSON.stringify({
//                 shape
//             }),
//             roomId: this.roomId
//         }))
        
//     }

//     mouseMoveHandler = (e: MouseEvent) => {
//         const rect = this.canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         if(this.clicked){
//             this.clearCanvas();
//             this.ctx.strokeStyle = "rgba(255, 255, 255)";

//             const width = mouseX - this.startX;
//             const height = mouseY - this.startY;
            
//             const selectedTool = this.selectedTool
//         if(selectedTool === "rect"){
//             const x = width < 0 ? this.startX + width : this.startX;
//             const y = height < 0 ? this.startY + height : this.startY;
//             this.ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));
//         }
//         else if(selectedTool === "circle"){
//             const centerX = this.startX + width / 2;
//             const centerY = this.startY + height / 2;
//             const radius = Math.sqrt(width * width + height * height) / 2;
//             this.ctx.beginPath();
//             this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
//             this.ctx.stroke();
//             this.ctx.closePath();
//         }
//         else if(selectedTool === "pencil"){
//             this.currentPencilPoints.push({x: mouseX, y: mouseY});

//             // Draw Shape
//             this.ctx.beginPath();
//             this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
//             for(let i=1; i<this.currentPencilPoints.length; i++){
//                 this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y);
//             }
//             this.ctx.stroke();
//             this.ctx.closePath();

//         }
//         }

//     }

//     initMouseHandlers() {
//         this.canvas.addEventListener("mousedown", this.mouseDownHandler)

//         this.canvas.addEventListener("mouseup", this.mouseUpHandler)

//         this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
//     }

//     private drawShape(shape: Shape) {
//         this.ctx.beginPath();
//         if(shape.type === "rect"){
//             this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
//         }
//         else if(shape.type === "circle"){
//             this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
            
//         }
//         else if(shape.type === "pencil"){
//             if (shape.points.length < 2) return;
//             this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
//             for (let i = 1; i < shape.points.length; i++) {
//                 this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
//             }
//         }
//         this.ctx.stroke();
//         this.ctx.closePath();
//     }


// }


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
};

// export class Game {
//     private canvas: HTMLCanvasElement;
//     private ctx: CanvasRenderingContext2D;
//     private existingShapes: Shape[];
//     private roomId: string;
//     private clicked: boolean;
//     private startX = 0;
//     private startY = 0;
//     private selectedTool: Tool = "circle";
//     private currentPencilPoints: { x: number; y: number }[] = [];
//     socket: WebSocket;

//     // PAN & ZOOM
//     private scale = 1;
//     private offsetX = 0;
//     private offsetY = 0;
//     private isPanning = false;
//     private lastPanX = 0;
//     private lastPanY = 0;

//     constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
//         this.canvas = canvas;
//         this.ctx = canvas.getContext("2d")!;
//         this.existingShapes = [];
//         this.roomId = roomId;
//         this.socket = socket;
//         this.clicked = false;

//         this.init();
//         this.initHandler();
//         this.initMouseHandlers();
//     }

//     setTool(tool: Tool) {
//         this.selectedTool = tool;
//     }

//     destroy() {
//         this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
//         this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
//         this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
//         this.canvas.removeEventListener("wheel", this.zoomHandler);
//         this.canvas.removeEventListener("mousedown", this.panStartHandler);
//         this.canvas.removeEventListener("mousemove", this.panMoveHandler);
//         this.canvas.removeEventListener("mouseup", this.panEndHandler);
//         this.canvas.removeEventListener("mouseleave", this.panEndHandler);
//     }

//     async init() {
//         this.existingShapes = await getExistingShapes(this.roomId);
//         this.clearCanvas();
//     }

//     async initHandler() {
//         this.socket.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             if (message.type == "chat") {
//                 const parsedShape = JSON.parse(message.message);
//                 this.existingShapes.push(parsedShape.shape);
//                 this.clearCanvas();
//             }
//         };
//     }

//     clearCanvas() {
//         this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.ctx.fillStyle = "rgba(0, 0, 0)";
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//         this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);

//         this.existingShapes.forEach((shape) => {
//             this.ctx.strokeStyle = "rgba(255, 255, 255)";
//             this.drawShape(shape);
//         });
//     }

//     zoomHandler = (e: WheelEvent) => {
//         e.preventDefault();
//         const zoomSpeed = 0.001;
//         const delta = -e.deltaY * zoomSpeed;
//         const newScale = Math.min(Math.max(this.scale + delta, 0.1), 5);

//         const rect = this.canvas.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         const dx = mouseX - this.offsetX;
//         const dy = mouseY - this.offsetY;

//         this.offsetX -= dx * (newScale / this.scale - 1);
//         this.offsetY -= dy * (newScale / this.scale - 1);

//         this.scale = newScale;
//         this.clearCanvas();
//     };

//     panStartHandler = (e: MouseEvent) => {
//         if (e.button === 1 || e.button === 2 || e.shiftKey) {
//             this.isPanning = true;
//             this.lastPanX = e.clientX;
//             this.lastPanY = e.clientY;
//         }
//     };

//     panMoveHandler = (e: MouseEvent) => {
//         if (this.isPanning) {
//             const dx = e.clientX - this.lastPanX;
//             const dy = e.clientY - this.lastPanY;
//             this.offsetX += dx;
//             this.offsetY += dy;
//             this.lastPanX = e.clientX;
//             this.lastPanY = e.clientY;
//             this.clearCanvas();
//         }
//     };

//     panEndHandler = (_e: MouseEvent) => {
//         this.isPanning = false;
//     };

//     mouseDownHandler = (e: MouseEvent) => {
//         if (e.button !== 0) return;
//         const rect = this.canvas.getBoundingClientRect();
//         this.clicked = true;
//         this.startX = (e.clientX - rect.left - this.offsetX) / this.scale;
//         this.startY = (e.clientY - rect.top - this.offsetY) / this.scale;

//         if (this.selectedTool === "pencil") {
//             this.currentPencilPoints = [{ x: this.startX, y: this.startY }];
//         }
//     };

//     mouseUpHandler = (e: MouseEvent) => {
//         if (!this.clicked) return;
//         this.clicked = false;

//         const rect = this.canvas.getBoundingClientRect();
//         const endX = (e.clientX - rect.left - this.offsetX) / this.scale;
//         const endY = (e.clientY - rect.top - this.offsetY) / this.scale;

//         const width = endX - this.startX;
//         const height = endY - this.startY;

//         let shape: Shape | null = null;

//         if (this.selectedTool === "rect") {
//             shape = {
//                 type: "rect",
//                 x: width < 0 ? this.startX + width : this.startX,
//                 y: height < 0 ? this.startY + height : this.startY,
//                 width: Math.abs(width),
//                 height: Math.abs(height),
//             };
//         } else if (this.selectedTool === "circle") {
//             const centerX = this.startX + width / 2;
//             const centerY = this.startY + height / 2;
//             const radius = Math.sqrt(width * width + height * height) / 2;
//             shape = {
//                 type: "circle",
//                 radius: Math.abs(radius),
//                 centerX,
//                 centerY,
//             };
//         } else if (this.selectedTool === "pencil") {
//             if (this.currentPencilPoints.length > 1) {
//                 shape = {
//                     type: "pencil",
//                     points: [...this.currentPencilPoints],
//                 };
//             }
//             this.currentPencilPoints = [];
//         }

//         if (!shape) return;

//         this.existingShapes.push(shape);
//         this.socket.send(JSON.stringify({
//             type: "chat",
//             message: JSON.stringify({ shape }),
//             roomId: this.roomId
//         }));
//         this.clearCanvas();
//     };

//     mouseMoveHandler = (e: MouseEvent) => {
//         if (!this.clicked) return;

//         const rect = this.canvas.getBoundingClientRect();
//         const mouseX = (e.clientX - rect.left - this.offsetX) / this.scale;
//         const mouseY = (e.clientY - rect.top - this.offsetY) / this.scale;

//         this.clearCanvas();
//         this.ctx.strokeStyle = "rgba(255, 255, 255)";

//         const width = mouseX - this.startX;
//         const height = mouseY - this.startY;

//         if (this.selectedTool === "rect") {
//             const x = width < 0 ? this.startX + width : this.startX;
//             const y = height < 0 ? this.startY + height : this.startY;
//             this.ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));
//         } else if (this.selectedTool === "circle") {
//             const centerX = this.startX + width / 2;
//             const centerY = this.startY + height / 2;
//             const radius = Math.sqrt(width * width + height * height) / 2;
//             this.ctx.beginPath();
//             this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
//             this.ctx.stroke();
//         } else if (this.selectedTool === "pencil") {
//             this.currentPencilPoints.push({ x: mouseX, y: mouseY });
//             this.ctx.beginPath();
//             this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
//             for (let i = 1; i < this.currentPencilPoints.length; i++) {
//                 this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y);
//             }
//             this.ctx.stroke();
//         }
//     };

//     initMouseHandlers() {
//         this.canvas.addEventListener("mousedown", this.mouseDownHandler);
//         this.canvas.addEventListener("mouseup", this.mouseUpHandler);
//         this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
//         this.canvas.addEventListener("wheel", this.zoomHandler, { passive: false });

//         // Pan listeners
//         this.canvas.addEventListener("mousedown", this.panStartHandler);
//         this.canvas.addEventListener("mousemove", this.panMoveHandler);
//         this.canvas.addEventListener("mouseup", this.panEndHandler);
//         this.canvas.addEventListener("mouseleave", this.panEndHandler);
//     }

//     private drawShape(shape: Shape) {
//         this.ctx.beginPath();
//         if(shape.type === "rect"){
//             this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
//         }
//         else if(shape.type === "circle"){
//             this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
            
//         }
//         else if(shape.type === "pencil"){
//             if (shape.points.length < 2) return;
//             this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
//             for (let i = 1; i < shape.points.length; i++) {
//                 this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
//             }
//         }
//         this.ctx.stroke();
//         this.ctx.closePath();
//     }
// }


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

    // PAN & ZOOM
    private scale = 1;
    private offsetX = 0;
    private offsetY = 0;
    private isPanning = false;
    private lastPanX = 0;
    private lastPanY = 0;

    private animationFrameId: number | null = null;
    private needsRedraw = false;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;

        this.init();
        this.initHandler();
        this.initMouseHandlers();
        this.renderLoop(); // start animation frame loop
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
    }

    destroy() {
        cancelAnimationFrame(this.animationFrameId!);
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("wheel", this.zoomHandler);
        this.canvas.removeEventListener("mousedown", this.panStartHandler);
        this.canvas.removeEventListener("mousemove", this.panMoveHandler);
        this.canvas.removeEventListener("mouseup", this.panEndHandler);
        this.canvas.removeEventListener("mouseleave", this.panEndHandler);
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.requestRedraw();
    }

    async initHandler() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message);
                this.existingShapes.push(parsedShape.shape);
                this.requestRedraw();
            }
        };
    }

    private requestRedraw() {
        this.needsRedraw = true;
    }

    private renderLoop = () => {
        if (this.needsRedraw) {
            this.clearCanvas();
            this.needsRedraw = false;
        }
        this.animationFrameId = requestAnimationFrame(this.renderLoop);
    };

    clearCanvas() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.existingShapes.forEach(shape => this.drawShape(shape));
    }

    zoomHandler = (e: WheelEvent) => {
        e.preventDefault();
        const zoomSpeed = 0.0005;
        const delta = -e.deltaY * zoomSpeed;
        const newScale = Math.min(Math.max(this.scale + delta, 0.1), 5);

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const dx = mouseX - this.offsetX;
        const dy = mouseY - this.offsetY;

        this.offsetX -= dx * (newScale / this.scale - 1);
        this.offsetY -= dy * (newScale / this.scale - 1);

        this.scale = newScale;
        this.requestRedraw();
    };

    panStartHandler = (e: MouseEvent) => {
        if (e.button === 1 || e.button === 2 || e.shiftKey) {
            this.isPanning = true;
            this.lastPanX = e.clientX;
            this.lastPanY = e.clientY;
        }
    };

    panMoveHandler = (e: MouseEvent) => {
        if (this.isPanning) {
            const dx = e.clientX - this.lastPanX;
            const dy = e.clientY - this.lastPanY;
            this.offsetX += dx;
            this.offsetY += dy;
            this.lastPanX = e.clientX;
            this.lastPanY = e.clientY;
            this.requestRedraw();
        }
    };

    panEndHandler = () => {
        this.isPanning = false;
    };

    mouseDownHandler = (e: MouseEvent) => {
        if (e.button !== 0) return;
        const rect = this.canvas.getBoundingClientRect();
        this.clicked = true;
        this.startX = (e.clientX - rect.left - this.offsetX) / this.scale;
        this.startY = (e.clientY - rect.top - this.offsetY) / this.scale;

        if (this.selectedTool === "pencil") {
            this.currentPencilPoints = [{ x: this.startX, y: this.startY }];
        }
    };

    mouseUpHandler = (e: MouseEvent) => {
        if (!this.clicked) return;
        this.clicked = false;

        const rect = this.canvas.getBoundingClientRect();
        const endX = (e.clientX - rect.left - this.offsetX) / this.scale;
        const endY = (e.clientY - rect.top - this.offsetY) / this.scale;

        const width = endX - this.startX;
        const height = endY - this.startY;

        let shape: Shape | null = null;

        if (this.selectedTool === "rect") {
            shape = {
                type: "rect",
                x: width < 0 ? this.startX + width : this.startX,
                y: height < 0 ? this.startY + height : this.startY,
                width: Math.abs(width),
                height: Math.abs(height),
            };
        } else if (this.selectedTool === "circle") {
            const centerX = this.startX + width / 2;
            const centerY = this.startY + height / 2;
            const radius = Math.sqrt(width * width + height * height) / 2;
            shape = {
                type: "circle",
                centerX,
                centerY,
                radius: Math.abs(radius),
            };
        } else if (this.selectedTool === "pencil" && this.currentPencilPoints.length > 1) {
            shape = {
                type: "pencil",
                points: [...this.currentPencilPoints],
            };
        }

        if (!shape) return;

        this.existingShapes.push(shape);
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId: this.roomId
        }));
        this.currentPencilPoints = [];
        this.requestRedraw();
    };

    mouseMoveHandler = (e: MouseEvent) => {
        if (!this.clicked) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - this.offsetX) / this.scale;
        const mouseY = (e.clientY - rect.top - this.offsetY) / this.scale;

        this.requestRedraw();
        this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
        this.ctx.strokeStyle = "rgba(255, 255, 255)";

        const width = mouseX - this.startX;
        const height = mouseY - this.startY;

        if (this.selectedTool === "rect") {
            const x = width < 0 ? this.startX + width : this.startX;
            const y = height < 0 ? this.startY + height : this.startY;
            this.ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));
        } else if (this.selectedTool === "circle") {
            const centerX = this.startX + width / 2;
            const centerY = this.startY + height / 2;
            const radius = Math.sqrt(width * width + height * height) / 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
            this.ctx.stroke();
        } else if (this.selectedTool === "pencil") {
            this.currentPencilPoints.push({ x: mouseX, y: mouseY });
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
            for (let i = 1; i < this.currentPencilPoints.length; i++) {
                this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y);
            }
            this.ctx.stroke();
        }
    };

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("wheel", this.zoomHandler, { passive: false });
        this.canvas.addEventListener("mousedown", this.panStartHandler);
        this.canvas.addEventListener("mousemove", this.panMoveHandler);
        this.canvas.addEventListener("mouseup", this.panEndHandler);
        this.canvas.addEventListener("mouseleave", this.panEndHandler);
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


