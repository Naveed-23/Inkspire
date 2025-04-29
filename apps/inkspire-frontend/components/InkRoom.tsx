"use client";

import { useEffect, useState } from "react";
import Ink from "./Ink";
import { ConnectionLoader } from "./ui/Loader";
import getToken from "@/lib/getToken";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function InkRoom({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useAuthRedirect();

  useEffect(() => {
    async function connectSocket() {
      try {
        const token = await getToken();  // <-- await here
  
        if (!token) {
          console.error("No token found in cookies");
          return;
        }
  
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`);
  
        ws.onopen = () => {
          setSocket(ws);
          ws.send(
            JSON.stringify({
              type: "join_room",
              roomId,
            })
          );
        };
  
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
  
        // Clean up WebSocket on unmount
        return () => {
          ws.close();
        };
      } catch (err) {
        console.error("Failed to get token:", err);
      }
    }
  
    connectSocket();
  
  }, [roomId, socket]);
  // Added roomId to deps just in case it changes

  if (!socket) {
    return <ConnectionLoader />;
  }

  return <Ink socket={socket} roomId={roomId} />;
}
