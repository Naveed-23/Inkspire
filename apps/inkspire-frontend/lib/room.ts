// lib/api/rooms.ts
// import { apiClient } from "./client";

import { apiClient } from "./cleint";

interface Room {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
}

export const getRooms = async () => {
  try {
    const response = await apiClient.get("/api/rooms");
    return { messages: response.data.messages as Room[], error: null };
  } catch (err) {
    console.error("Error fetching rooms:", err);
    return { 
      messages: [], 
      error: "Please sign in to view rooms" // More user-friendly message
    };
  }
}