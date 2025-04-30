"use client";

import { useEffect, useState, useRef } from "react";
import Ink from "./Ink";
import { ConnectionLoader } from "./ui/Loader";
import getToken from "@/lib/getToken";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function InkRoom({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const hasConnected = useRef(false); // to prevent multiple connections
  useAuthRedirect();

  useEffect(() => {
    let ws: WebSocket | null = null;

    async function connectSocket() {
      if (hasConnected.current) return;

      hasConnected.current = true;

      try {
        const token = await getToken();

        if (!token) {
          console.error("No token found in cookies");
          return;
        }

        ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`);

        ws.onopen = () => {
          console.log("WebSocket connected");
          setSocket(ws);
          ws?.send(
            JSON.stringify({
              type: "join_room",
              roomId,
            })
          );
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
          console.warn("WebSocket closed");
        };
      } catch (err) {
        console.error("Failed to get token or connect:", err);
      }
    }

    connectSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [roomId]);

  if (!socket) {
    return <ConnectionLoader />;
  }

  return <Ink socket={socket} roomId={roomId} />;
}
