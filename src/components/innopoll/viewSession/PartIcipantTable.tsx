"use client";

import { useEffect, useState } from "react";

interface Participant {
  id: string;
  name: string;
  created_at: string;
  responses:
    | [
        {
          completed: boolean;
          answers: number[];
        }
      ]
    | [];
}

// Score indicator component with color coding
const ScoreIndicator = ({
  score,
  isCompleted,
}: {
  score: number | null;
  isCompleted: boolean;
}) => {
  if (!isCompleted || score === null) {
    return (
      <div className="flex items-center justify-center">
        <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
      </div>
    );
  }

  // Color coding based on score
  const getScoreColor = (score: number) => {
    if (score >= 80)
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10";
    if (score >= 60)
      return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10";
    if (score >= 40)
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10";
  };

  return (
    <div className="flex items-center justify-center">
      <span
        className={`rounded-lg px-2.5 py-1 text-sm font-semibold ${getScoreColor(score)}`}
      >
        {score}%
      </span>
    </div>
  );
};

// Average score with progress ring
const AverageScore = ({
  score,
  isCompleted,
}: {
  score: number;
  isCompleted: boolean;
}) => {
  if (!isCompleted) {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Not completed
        </span>
      </div>
    );
  }

  const getColor = (score: number) => {
    if (score >= 80)
      return {
        text: "text-green-600 dark:text-green-400",
        ring: "stroke-green-500",
      };
    if (score >= 60)
      return {
        text: "text-blue-600 dark:text-blue-400",
        ring: "stroke-blue-500",
      };
    if (score >= 40)
      return {
        text: "text-yellow-600 dark:text-yellow-400",
        ring: "stroke-yellow-500",
      };
    return {
      text: "text-red-600 dark:text-red-400",
      ring: "stroke-red-500",
    };
  };

  const colors = getColor(score);
  const circumference = 2 * Math.PI * 16;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center justify-center gap-3">
      <div className="relative h-12 w-12">
        <svg className="h-12 w-12 -rotate-90 transform">
          <circle
            cx="24"
            cy="24"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="24"
            cy="24"
            r="16"
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={colors.ring}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${colors.text}`}>{score}</span>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr] items-center gap-4 rounded-xl bg-gray-100 px-6 py-4 dark:bg-white/[0.06]"
      >
        <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-700"></div>
        <div className="mx-auto h-10 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="mx-auto h-6 w-12 rounded bg-gray-300 dark:bg-gray-700"></div>
        <div className="mx-auto h-6 w-12 rounded bg-gray-300 dark:bg-gray-700"></div>
        <div className="mx-auto h-6 w-12 rounded bg-gray-300 dark:bg-gray-700"></div>
      </div>
    ))}
  </div>
);

// Empty state
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
      <svg
        className="h-8 w-8 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    </div>
    <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-gray-100">
      No participants yet
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Participants will appear here once they join the session
    </p>
  </div>
);

export default function ParticipantsTable({
  roomCode,
}: {
  roomCode: string;
}) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch(`/api/admin/${roomCode}`);
        const data = await res.json();
        setParticipants(data.participants);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [roomCode]);

  const calculateAverageScore = (scores: number[] | null) => {
    if (!scores || scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  // Calculate completion stats
  const completedCount = participants.filter(
    (p) => p.responses?.[0]?.completed
  ).length;
  const totalCount = participants.length;
  const completionRate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-md transition-colors dark:bg-white/[0.06]">
        <div className="mb-6">
          <div className="mb-2 h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition-colors dark:bg-white/[0.06]">
      {/* Header with stats */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Participants
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {totalCount} {totalCount === 1 ? "participant" : "participants"} ·{" "}
            {completedCount} completed ({completionRate}%)
          </p>
        </div>
      </div>

      {participants.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Column Headers */}
          <div className="mb-3 grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr] items-center gap-4 px-6 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <div className="text-left">Name</div>
            <div className="text-center">Average</div>
            <div className="text-center">Q1</div>
            <div className="text-center">Q2</div>
            <div className="text-center">Q3</div>
          </div>

          {/* Participant Rows */}
          <div className="space-y-2">
            {participants.map((p, index) => {
              const response = p.responses?.[0];
              const completed = response?.completed || false;
              const answers = response?.answers;
              const average = calculateAverageScore(
                completed ? answers ?? null : null
              );

              return (
                <div
                  key={p.id}
                  className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr] items-center gap-4 rounded-xl bg-gray-50 px-6 py-4 transition-all duration-200 hover:bg-gray-100 hover:shadow-sm dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Participant name with avatar */}
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {p.name}
                    </span>
                    {completed && (
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Average with progress ring */}
                  <AverageScore score={average} isCompleted={completed} />

                  {/* Q1 */}
                  <ScoreIndicator
                    score={answers?.[0] ?? null}
                    isCompleted={completed}
                  />

                  {/* Q2 */}
                  <ScoreIndicator
                    score={answers?.[1] ?? null}
                    isCompleted={completed}
                  />

                  {/* Q3 */}
                  <ScoreIndicator
                    score={answers?.[2] ?? null}
                    isCompleted={completed}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}