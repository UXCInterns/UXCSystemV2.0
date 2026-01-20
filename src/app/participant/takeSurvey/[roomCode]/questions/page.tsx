"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Question } from "@/types/question";


const likertOptions = [
  { label: "Strongly Disagree", color: "bg-rose-100 hover:bg-rose-200 border-rose-300" },
  { label: "Disagree", color: "bg-orange-100 hover:bg-orange-200 border-orange-300" },
  { label: "Neutral", color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300" },
  { label: "Agree", color: "bg-indigo-100 hover:bg-indigo-200 border-indigo-300" },
  { label: "Strongly Agree", color: "bg-emerald-100 hover:bg-emerald-200 border-emerald-300" },
];

export default function FeedbackPage() {
  const router = useRouter()
  const { roomCode } = useParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showStatements, setShowStatements] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);


  const [isReading, setIsReading] = useState(true);
  const [canTap, setCanTap] = useState(false);
  const [progress, setProgress] = useState(0); // For progress bar

  const [showThankYou, setShowThankYou] = useState(false);





  // Fetch questions and initialize answers
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/feedback/${roomCode}`);
        if (!res.ok) throw new Error("Failed to fetch survey data");

        const data = await res.json();
        if (data?.quiz?.questions) {
          setQuestions(data.quiz.questions);
          setAnswers(new Array(data.quiz.questions.length).fill(undefined)); // pre-initialize
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load survey. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (roomCode) fetchQuestions();
  }, [roomCode]);

  //the timer will then start
  useEffect(() => {
    if (!startTime && questions.length > 0) {
      setStartTime(new Date());
    }
  }, [questions, startTime]);


  // Reading phase with progress bar (5 seconds)
  useEffect(() => {
    if (!isReading) return;

    setCanTap(false);
    setProgress(0);

    const duration = 5000; // 5 seconds
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        setCanTap(true);
      }
    };

    const animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [isReading]);




  const handleLikertChange = (questionIndex: number, value: number) => {
    const percentValue = (value - 1) * 25;
    setAnswers(prev => {
      const newArr = [...prev];
      newArr[questionIndex] = percentValue;
      return newArr;
    });
  };

  const goNext = () => {
    if (answers[currentStep] === undefined) {
      alert("Please answer the question before continuing.");
      return;
    }
    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
      setIsReading(true);
      setProgress(0);
    }
  };

  const handleSubmit = async () => {
    if (answers[currentStep] === undefined) {
      alert("Please answer the question before submitting.");
      return;
    }

    const participantID = localStorage.getItem("participantId");

    const endTime = new Date();
    const timeTaken = startTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) // in seconds
      : 0;

    const submission = {
      participant_id: participantID,
      room_code: roomCode,
      answers,
      time_taken: timeTaken,
      completed: true,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/sessions/SubmitQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Error submitting survey: ${data.error}`);
        return;
      }

      setShowThankYou(true);

    } catch (err) {
      console.error(err);
      alert("Failed to submit survey. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading Questions...</p>
      </main>
    );
  }

  if (!questions.length) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>No questions found for this Innopoll.</p>
      </main>
    );
  }

  if (showThankYou) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-emerald-600 mb-4">
            Thank You!
          </h1>

          <p className="text-gray-600 mb-8">
            Response submitted successfully.
          </p>

          <button
            onClick={() => router.push(`/participant/results/${roomCode}`)}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
          >
            View Results
          </button>
        </div>
      </main>
    );
  }


  const currentQuestion = questions[currentStep];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-lg sm:max-w-3xl bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          INNOPOLL
        </h1>

        <div className="mt-10 sm:mt-14"></div>



        {isReading ? (
          <div
            onClick={() => canTap && setIsReading(false)}
            className="flex flex-col min-h-[60vh] sm:h-96 cursor-pointer select-none px-4"
          >
            {/* this is the one that should be the statement.text */}
            {/* <p className="text-2xl font-semibold text-gray-800 mb-4">{currentQuestion.question}</p>  */}

            {currentQuestion.statements?.map((s, i) => (
              <p key={i} className="text-lg font-semibold text-gray-800 mb-6">
                {s.text}
              </p>
            ))}

            {/* Loading Bar */}
            <div className="w-full h-2 bg-gray-300 rounded-full mt-6 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            {canTap && (
              <>
                {/* Mobile */}
                <button
                  onClick={() => setIsReading(false)}
                  className="mt-8 px-6 py-3 bg-emerald-600 text-white rounded-xl sm:hidden"
                >
                  Continue
                </button>

                {/* Desktop */}
                <div className="mt-10 text-gray-400 text-sm hidden sm:block">
                  Tap anywhere to continue
                </div>
              </>
            )}

          </div>
        ) : (
          <>
            {/* Show question again in answer phase */}
            <div className="text-center mb-6">
              <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">

                {currentQuestion.question}
              </p>

              {currentQuestion.statements?.length > 0 && (
                <div className="w-full mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent tap-anywhere trigger
                      setShowStatements(prev => !prev);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 border rounded-lg text-sm text-gray-700 bg-gray-50"
                  >
                    <span>View Definition</span>
                    <span className="text-lg">{showStatements ? "−" : "+"}</span>
                  </button>

                  {showStatements && (
                    <div className="mt-2 p-4 border rounded-lg bg-gray-50 text-left">
                      {currentQuestion.statements.map((s, i) => (
                        <p key={i} className="text-gray-600 text-sm mb-4">
                          {s.text}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

            <div className="flex flex-row gap-4 mt-6 overflow-x-auto">

              {likertOptions.map((opt, optIdx) => {
                const selected = answers[currentStep] === optIdx * 25;
                return (
                  <label
                    key={optIdx}
                    onClick={() => handleLikertChange(currentStep, optIdx + 1)}
                    className="flex items-center sm:flex-col gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div
                      className={`
    w-14 h-14 min-w-[3.5rem] min-h-[3.5rem] shrink-0
    rounded-full border flex items-center justify-center
    transition-all duration-200
    ${selected ? opt.color : "bg-white"}
  `}
                    />

                    <span className="text-sm text-center">{opt.label}</span>
                  </label>

                );
              })}
            </div>

            <div className="mt-8 flex justify-end">

              {currentStep + 1 < questions.length ? (
                <button
                  onClick={goNext}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white rounded-xl"
                >
                  Submit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
