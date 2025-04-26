"use client";

import { Lock, Users } from "lucide-react";
import CreateRoom from "./CreateRoom";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export function CreateRoomSection() {
    useAuthRedirect();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-gray-700">
          <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-semibold">New Room</h2>
      </div>
      
      <CreateRoom />
      
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          <Users className="h-4 w-4" /> Room Features
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">•</span>
            <span>Real-time collaboration</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">•</span>
            <span>Unlimited participants</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">•</span>
            <span>Persistent drawing sessions</span>
          </li>
        </ul>
      </div>
    </div>
  );
}