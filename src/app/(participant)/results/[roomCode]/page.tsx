"use client";
import React from "react";
import { useParams } from "next/navigation";
import { CircleResult } from "@/components/innopoll/CircleResult";
import { useRealtimePollResults } from "@/hooks/innopoll/useRealTimeResults";

export default function ResultsPage() {
  const params = useParams();
  const roomCode = params?.roomCode as string;

  const participantId = typeof window !== "undefined"
    ? localStorage.getItem("participantId")
    : null;

  // Use the realtime hook
  const { pollData, isLoading, error } = useRealtimePollResults(roomCode, participantId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error loading results: {error}</p>
      </div>
    );
  }

  // pollData is keyed by questionId
  const pollDataArray = Object.values(pollData);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Poll Results</h1>

      {pollDataArray.length === 0 ? (
        <p className="text-center text-gray-500">No responses yet.</p>
      ) : (
        pollDataArray.map((q, index) => (
          <div key={q.id || index} className="mb-6">
            <CircleResult
              title={q.title}
              yourScore={q.yourScore}
              avgScore={Math.round(q.avgScore * 100) / 100}   
              unit={q.unit}
            />
          </div>
        ))
      )}
    </div>
  );
}
