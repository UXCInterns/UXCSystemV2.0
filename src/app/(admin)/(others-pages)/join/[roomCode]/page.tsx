"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";

// Quiz type
interface Quiz {
  id: string;
  room_code: string;
  title: string;
  end_date?: string;
}

const JoinPage: React.FC = () => {
  const { roomCode } = useParams(); // get dynamic route param
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        setQuiz(data); // backend now returns quiz directly
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [roomCode]);

  if (loading) return <p className="text-center mt-10">Loading quiz...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;
  if (!quiz) return <p className="text-center mt-10">Quiz not found</p>;

  const quizUrl = `${window.location.origin}/takeSurvey/${quiz.room_code}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      {/* QR Code */}
      <QRCode
        value={`${window.location.origin}/takeSurvey/${quiz.room_code}`}
        size={200}
      />
      <p className="mt-2 text-gray-500">
        <a href={quizUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
          {quizUrl}
        </a>
      </p>

      <h1 className="text-3xl font-bold mb-4 text-gray-800">Join Quiz</h1>
      <p className="text-xl mb-2">Room Code: {quiz.room_code}</p>
      <p className="text-lg text-gray-600">Quiz Title: {quiz.title}</p>








    </div>
  );
};

export default JoinPage;
