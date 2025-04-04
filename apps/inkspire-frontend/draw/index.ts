import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { CanvasHTMLAttributes } from "react";

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
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}


export async function ctxDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket){

    const ctx = canvas.getContext("2d");
    let existingShapes: Shape[] = await getExistingShapes(roomId);
    setTimeout(() => {
        console.log(existingShapes);
    }, 2000);

    if(!ctx){
        return;
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if(message.type == "chat"){
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape.shape);
            clearCanvas(existingShapes, canvas, ctx);
        }
    }


    clearCanvas(existingShapes, canvas, ctx);
    let startX = 0;
    let startY = 0;
    let clicked = false;

    // circle(canvas, ctx);

    canvas.addEventListener("mousedown", (e) => {
        clicked=true;
        startX = e.clientX;
        startY = e.clientY;

    })

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY; 
        // @ts-ignore
        const selectedTool = window.selectedTool;
        let shape: Shape | null = null;
        if(selectedTool === "rect"){
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                width,
                height
            };
            existingShapes.push(shape);
        }else if(selectedTool === "circle"){
            const radius = Math.max(width, height) / 2;
            shape= {
                type: "circle",
                centerX: startX + radius,
                centerY: startY + radius,
                radius
            };
            existingShapes.push(shape);
        }

        if(!shape){
            return;
        }
        
        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId
        }))
    })

    canvas.addEventListener("mousemove", (e) => {
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255, 255, 255)";
            // @ts-ignore
            const selectedTool = window.selectedTool
            if(selectedTool === "rect"){
                ctx.strokeRect(startX, startY, width, height);
            }
            else if(selectedTool === "circle"){
                const radius = Math.max(width, height) / 2;
                const centerX = startX + radius;
                const centerY = startY + radius;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
            }
        }

    })
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if(shape.type === "rect") {
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }else if(shape.type === "circle"){
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }
    })

}

async function getExistingShapes(roomId: string){
    try{
        const res = await axios.get(`${HTTP_BACKEND}/api/chats/${roomId}`, {
            withCredentials: true
          });
          const messages = res.data.messages;
          console.log("res.data.messages", messages);
          
          const shapes = messages.map((x: {message: string}) => {
              const messageData = JSON.parse(x.message)
              return messageData.shape;
          })
      
          return shapes;
    }catch(e){
        console.error(e);
    }
      
}

function circle(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    let startX = 0;
    let startY = 0;
    let clicked = false;
    canvas.addEventListener("mousedown", (e) => {
        clicked=true;
        startX = e.clientX;
        startY = e.clientY
    });

    canvas.addEventListener("mouseup", (e) => {
        // if(clicked){
        //     const radius = e.clientX / 2;
        //     const x = e.clientX - startX;
        //     const y = e.clientY - startY
        //     ctx.beginPath();
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
        //     ctx.fillStyle = "rgba(0, 0, 0)"
        //     ctx.fillRect(0, 0, canvas.width, canvas.height);
        //     ctx.arc(x, y, radius, 0*Math.PI, 1.5 * Math.PI);
        //     ctx.stroke();
        // }
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY - startY
            const centerX = startX + width / 2;
            const centerY = startY + height / 2;
            const radius = Math.max(width, height) / 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }
    })
}