import { WebSocket, WebSocketServer } from 'ws';
import http from 'http';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/index";

require('dotenv').config();

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// Create basic HTTP server to respond to pings
const server = http.createServer((req, res) => {
  if (req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pong');
  } else {
    res.writeHead(404);
    res.end('not found');
  }
});

// Attach WebSocket server to HTTP server
const wss = new WebSocketServer({ server });

interface User {
  userId: string;
  rooms: string[];
  ws: WebSocket;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string' || !decoded || !decoded.userId) return null;
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') as string;
  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws
  });

  ws.on('message', async function message(data) {
    let parsedData;
    try {
      parsedData = typeof data !== "string" ? JSON.parse(data.toString()) : JSON.parse(data);
    } catch (err) {
      console.error("Invalid JSON message received:", data);
      return;
    }

    console.log("message received:", parsedData);

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === 'leave_room') {
      const user = users.find(x => x.ws === ws);
      if (!user) return;
      user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
    }

    if (parsedData.type === 'chat') {
      const { roomId, message } = parsedData;

      await prismaClient.chat.create({
        data: {
          roomId: Number(roomId),
          message,
          userId
        }
      });

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: 'chat',
            message,
            roomId
          }));
        }
      });
    }
  });
});

// Start HTTP server (and attached WS server)
server.listen(port, () => {
  console.log(`WS+HTTP server listening on port ${port}`);
});
