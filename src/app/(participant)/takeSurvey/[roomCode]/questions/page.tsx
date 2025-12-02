//app/takeSurvey/[roomCode]/questions/page.tsx
// Survey Questions Page
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { WorkshopStep } from "@/components/feedback/WorkshopStep";
import { TrainerStep } from "@/components/feedback/TrainerStep";
import { QualitativeStep } from "@/components/feedback/QualitativeStep";
import { useSurvey } from "@/hooks/feedback/useSurvey";
import { FIXED_QUESTIONS } from "@/constants/fixedQuestions"; // your questions
import { Question } from "@/types/question";

const likertOptions = [
  { label: "Strongly Disagree", color: "bg-rose-100 hover:bg-rose-200 border-rose-300" },
  { label: "Disagree", color: "bg-orange-100 hover:bg-orange-200 border-orange-300" },
  { label: "Neutral", color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300" },
  { label: "Agree", color: "bg-indigo-100 hover:bg-indigo-200 border-indigo-300" },
  { label: "Strongly Agree", color: "bg-emerald-100 hover:bg-emerald-200 border-emerald-300" },
];

const trainers = [{ id: "t1", name: "SUM TING WONG" }];

export default function FeedbackPage() {
  const { roomCode } = useParams();

  // useSurvey with fixed questions
  const {
    currentStep,
    trainerIndex,
    workshopAnswers,
    trainerAnswers,
    qualitative,
    next,
    back,
    handleNextClick,
    handleWorkshopCircleClick,
    handleTrainerCircleClick,
    setQualitative,
    setTrainerAnswers,
    workshopQuestions,
    trainerQuestions,
    qualitativeQuestions,
    consolidateAnswers
  } = useSurvey(trainers, FIXED_QUESTIONS);

  const validateStep = () => {
    if (currentStep === "workshop") {
      const incomplete = workshopQuestions.some(q => q.required && (workshopAnswers[q.id] === 0));
      if (incomplete) {
        alert("Please answer all workshop questions before proceeding.");
        return false;
      }
    } else if (currentStep === "trainer") {
      const currentTrainer = trainers[trainerIndex];
      const answers = trainerAnswers[currentTrainer.id] || {};
      const incomplete = trainerQuestions.some(q => q.required && (!answers[q.id] || answers[q.id] === 0));
      if (incomplete) {
        alert(`Please answer all questions for ${currentTrainer.name} before proceeding.`);
        return false;
      }
    } else if (currentStep === "qualitative") {
      const incomplete = qualitativeQuestions.some(q => q.required && !qualitative[q.id]?.trim());
      if (incomplete) {
        alert("Please fill in all qualitative feedback questions before submitting.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    console.log("Workshop Answers:", workshopAnswers);
    console.log("Trainer Answers:", trainerAnswers);
    console.log("Qualitative Feedback:", qualitative);

     const allAnswers = consolidateAnswers();

     const participantID = localStorage.getItem("participantId")

     //creating the submission object here!
      const submission = {
    participant_id: participantID,      
    answers: allAnswers,            // all answers combined
    room_code: roomCode,            // from useParams()
    time_taken: 300,                // e.g., calculate survey duration dynamically
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

    alert("Thank you for your feedback!");
  } catch (err) {
    console.error(err);
    alert("Failed to submit survey. Please try again.");
  }
  };

  const handleNextClickWithValidation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateStep()) next();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {["Workshop", "Trainers", "Feedback"].map((label, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i <= (currentStep === "workshop" ? 0 : currentStep === "trainer" ? 1 : 2)
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 ${
                    i < (currentStep === "workshop" ? 0 : currentStep === "trainer" ? 1 : 2)
                      ? "bg-emerald-600"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Survey Card */}
      <div className="w-full max-w-lg sm:max-w-3xl bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Evaluation Survey
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Your feedback helps us improve our workshops
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 w-full">
          <div key={currentStep} className="animate-fadeIn">
            {currentStep === "workshop" && (
              <WorkshopStep
                statements={workshopQuestions}
                answers={workshopAnswers}
                onChange={handleWorkshopCircleClick}
                likertOptions={likertOptions}
              />
            )}
            {currentStep === "trainer" && (
              <TrainerStep
                trainer={trainers[trainerIndex]}
                statements={trainerQuestions}
                answers={trainerAnswers[trainers[trainerIndex].id] || {}}
                onChange={(qId, val) =>
                  handleTrainerCircleClick(trainers[trainerIndex].id, qId, val)
                }
                likertOptions={likertOptions}
              />
            )}
            {currentStep === "qualitative" && (
              <QualitativeStep
                questions={qualitativeQuestions}
                answers={qualitative}
                onChange={(id, value) =>
                  setQualitative(prev => ({ ...prev, [id]: value }))
                }
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2">
            {currentStep !== "workshop" && (
              <button
                type="button"
                onClick={back}
                className="px-6 py-2.5 bg-white border-2 border-emerald-300 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-all w-full sm:w-auto"
              >
                Back
              </button>
            )}
            {currentStep !== "qualitative" ? (
              <button
                type="button"
                onClick={handleNextClickWithValidation}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-medium hover:shadow-lg transition-all w-full sm:w-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all w-full sm:w-auto"
              >
                Submit Feedback
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
