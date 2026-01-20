"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
interface Quiz {
  id: string;
  room_code: string;
  title: string;
  end_date?: string;
}

const JoinPage: React.FC = () => {
  const { roomCode } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);


  useEffect(() => {
    if (!roomCode) return;

    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/quizzes/${roomCode}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch quiz");
        }

        setQuiz(data);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [roomCode]);

  //countdown 
  useEffect(() => {
    if (!quiz?.end_date) return;

    const endTime = new Date(quiz.end_date).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft(diff);
    };

    updateCountdown(); // run immediately
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [quiz?.end_date]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-gray-600 text-2xl">Loading...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-gray-900 text-2xl">Quiz not found</div>
      </div>
    );
  }

  const quizUrl = `${window.location.origin}/participant/takeSurvey/${quiz.room_code}`;

  const formatTime = (ms: number) => {
    if (ms <= 0) return "0s";

    const totalSeconds = Math.floor(ms / 1000);

    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];

    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);

    parts.push(`${seconds}s`);

    return parts.join(" ");
  };



  return (
    <div className="h-screen overflow-hidden bg-white p-6">
      <div className="w-full h-full rounded-xl border border-gray-200 shadow-md bg-white">
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-3xl font-medium text-gray-900">Session Name: {quiz.title}</h2>

          </div>

          {/* QR Code and Room Code Section */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <QRCode
              value={quizUrl}
              size={400}
              className="mb-8"
            />
            <div className="flex items-center gap-2 text-3xl">
              <span className="text-gray-800">Room Code:</span>
              <span className="bg-purple-100 px-4 py-2 rounded-lg font-bold text-gray-900">
                {quiz.room_code}
              </span>

            </div>
            {timeLeft !== null ? (
              <p className="text-sm text-gray-500 mt-1">
                Session ends in{" "}
                <span className="font-semibold text-gray-400">
                  {formatTime(timeLeft)}
                </span>
              </p>
            ) : (
              <p className="text-sm font-semibold text-gray-4live00 mt-1">
                Session expired
              </p>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;