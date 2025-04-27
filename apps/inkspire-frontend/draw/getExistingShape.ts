import axios from "axios";



export async function getExistingShapes(roomId: string){
    try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_BACKEND}/api/chats/${roomId}`, {
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