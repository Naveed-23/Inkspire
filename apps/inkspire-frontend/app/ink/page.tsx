// app/create/page.tsx
import { CreateRoomSection } from "@/components/CreateRoomSection";
import { RoomList } from "@/components/RoomList";
import { Pencil } from "lucide-react";
import Link from "next/link";
// import { RoomList } from "./RoomList";
// import { CreateRoomSection } from "./CreateRoomSection";

export default async function RoomListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
          <Pencil className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Inkspire
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Collaborative Spaces</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join an existing room or create a new one to start drawing together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RoomList />
          <CreateRoomSection />
        </div>
      </main>
    </div>
  );
}