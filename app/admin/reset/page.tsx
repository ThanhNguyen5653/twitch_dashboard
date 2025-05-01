"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { resetDatabase } from "@/lib/reset-database";

export default function ResetPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    error?: any;
  } | null>(null);

  const handleReset = async () => {
    if (
      confirm(
        "Are you sure you want to reset the database? This will delete all existing data and re-seed it."
      )
    ) {
      setLoading(true);
      const result = await resetDatabase();
      setResult(result);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#18181b] p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Database Admin</h1>
        <p className="mb-6">
          Reset the database and re-seed it with sample data.
        </p>
        <Button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? "Resetting..." : "Reset Database"}
        </Button>

        {result && (
          <div
            className={`mt-4 p-3 rounded ${
              result.success
                ? "bg-green-900/50 text-green-300"
                : "bg-red-900/50 text-red-300"
            }`}
          >
            {result.success
              ? "Database reset successfully!"
              : `Error: ${JSON.stringify(result.error)}`}
          </div>
        )}
      </div>
    </div>
  );
}
