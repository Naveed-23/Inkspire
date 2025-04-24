import axios from "axios";
import { HTTP_BACKEND } from "@/config";

interface Room {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
}

export const getRooms = async () => {
  try {
    console.log("enter")
    const response = await axios.get(`${HTTP_BACKEND}/auth/rooms`);
    console.log(response)
    return { messages: response.data.messages as Room[], error: null };
  } catch (err) {
    console.error("Error fetching rooms:", err);
    return { 
      messages: [], 
      error: "Please sign in to view rooms" // More user-friendly message
    };
  }
}