import { Loader2 } from "lucide-react";

export function ConnectionLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Connecting to server...
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          This should only take a moment
        </p>
      </div>
    </div>
  );
}