import { getRooms } from "@/lib/room";
import { DoorOpen, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export async function RoomList() {
  const { messages: rooms, error } = await getRooms();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-gray-700">
          <DoorOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-semibold">Existing Rooms</h2>
      </div>

      {error ? (
        <div className="text-red-500 dark:text-red-400 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
          {error}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No rooms found. Create one to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/ink/${room.id}`}
              className="block group"
            >
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {room.slug}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>
                    Created: {new Date(room.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}