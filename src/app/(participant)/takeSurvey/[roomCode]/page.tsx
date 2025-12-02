//SURVEY LANDING PAGE FOR PARTICIPANT 

"use client";
import React, { useState, useEffect, } from "react";
import { useRouter, useParams } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();

  const params = useParams();
  const roomCode = params.roomCode

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [participant, setParticipant] = useState(null);


  // Function to call API and create participant
  const createParticipant = async () => {
    if (!roomCode) {
      alert("Missing room code in the URL!");
      return;
    }

    try {
      const res = await fetch("/api/sessions/joinQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join survey");

      setParticipant(data.participant);

      // Save participant info for later use
      localStorage.setItem("participantId", data.participant.id);
      localStorage.setItem("participantNumericId", data.participant.numericId);
    } catch (err) {
      console.error(err);
      alert("Failed to join survey. Please try again.");
    }
  };

  // 🔄 Auto-create participant on page load
  useEffect(() => {
    createParticipant();
  }, []);

  const handleJoin = () => {

    setLoading(true);
    setProgress(0);

    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);
        // Navigate after a short delay (let React finish)
        setTimeout(() => {
          router.push(`/takeSurvey/${roomCode}/questions`); 
        }, 300);
      }
    }, 100);
  };


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Welcome to the Workshop Feedback!
        </h1>
        <p className="mb-6 text-gray-700">
          Thank you for participating. This survey has 3 parts:
        </p>
        <ul className="text-left mb-6 list-disc list-inside text-gray-700">
          <li>Workshop feedback (3 statements)</li>
          <li>Trainer feedback (3 statements per trainer)</li>
          <li>Qualitative feedback (3 open-ended questions)</li>
        </ul>
        <p className="mb-6 text-gray-700">
          It should take approximately <strong>3–5 minutes</strong> to complete.
          Please ensure you have a quiet moment to provide thoughtful responses.
        </p>

        {!loading ? (
          <button
            onClick={handleJoin}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            Join Survey
          </button>
        ) : (
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </main>
  );
}
