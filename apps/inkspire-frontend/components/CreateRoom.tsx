"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function CreateRoom() {
    const [room, setRoom] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    async function handleRoom() {
        
        if (!room.trim()) return;
        setIsCreating(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_HTTP_BACKEND}/api/room`, {
                name: room
            }, {
                withCredentials: true,
            });
            if (res?.data?.msg) {
                router.push(`/ink/${res.data.msg}`);
            }
        } catch (error) {
            console.error("Error creating room:", error);
            setIsCreating(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="room-name" className="text-gray-700 dark:text-gray-300">
                    Room Name
                </Label>
                <Input
                    id="room-name"
                    placeholder="e.g. Team Brainstorm"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRoom()}
                    className="py-2 px-4 text-base"
                />
            </div>
            <Button 
                onClick={handleRoom}
                disabled={!room.trim() || isCreating}
                className="w-full py-2 px-4 flex items-center justify-center gap-2 cursor-pointer"
            >
                {isCreating ? "Creating..." : "Create Room"}
                {!isCreating && <ArrowRight className="h-4 w-4" />}
            </Button>
        </div>
    );
}