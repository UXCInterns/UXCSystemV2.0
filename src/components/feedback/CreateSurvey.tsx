"use client";

import React, { useState } from "react";
import { WorkshopStep } from "@/components/feedback/WorkshopStep";
import { TrainerStep } from "@/components/feedback/TrainerStep";
import { QualitativeStep } from "@/components/feedback/QualitativeStep";
import { useSurvey } from "@/hooks/feedback/useSurvey";

import { FIXED_QUESTIONS } from "@/constants/fixedQuestions";


// ---------- Main Component ----------
export default function CreateSurvey() {
  const workshopStatements = FIXED_QUESTIONS
    .filter(q => q.type === "rating" && q.id < 7)
    .map(q => q);

  const trainerStatements = FIXED_QUESTIONS
    .filter(q => q.text.includes("%[TrainerName]"))
    .map(q => q);

  const qualitativeQuestions = FIXED_QUESTIONS
    .filter(q => q.type === "text")
    .map(q => q);


  const trainers = [{ id: "t1", name: "Trainer A" }];

  const likertOptions = [
    { label: "Strongly Disagree", color: "bg-rose-100 hover:bg-rose-200 border-rose-300" },
    { label: "Disagree", color: "bg-orange-100 hover:bg-orange-200 border-orange-300" },
    { label: "Neutral", color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300" },
    { label: "Agree", color: "bg-indigo-100 hover:bg-indigo-200 border-indigo-300" },
    { label: "Strongly Agree", color: "bg-emerald-100 hover:bg-emerald-200 border-emerald-300" },
  ];

  const allQuestions = [
  ...workshopStatements,
  ...trainerStatements,
  ...qualitativeQuestions
];

  const {
    trainerIndex,
    workshopAnswers,
    trainerAnswers,
    qualitative,
    
    //handle
    handleWorkshopCircleClick,
    handleTrainerCircleClick,
    handleQualitativeChange,
    consolidateAnswers
  } = useSurvey(trainers, allQuestions);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-dark-900 rounded-2xl shadow-theme-xs p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Survey Preview
        </h1>

        {/* Workshop Section */}
        {workshopStatements.length > 0 && (
          <WorkshopStep
            statements={workshopStatements}
            answers={workshopAnswers}
            onChange={handleWorkshopCircleClick}
            likertOptions={likertOptions}
            preview={true}
          />
        )}

        {/* Trainer Section */}
        {trainerStatements.length > 0 && (
          <TrainerStep
            trainer={trainers[trainerIndex]}
            statements={trainerStatements}
            answers={
              trainerAnswers[trainers[trainerIndex].id] ||
              Array(trainerStatements.length).fill(0)
            }
            onChange={(questionId, value) =>
              handleTrainerCircleClick(trainers[trainerIndex].id, questionId, value)
            }
            likertOptions={likertOptions}
            preview={true}
          />
        )}

        {/* Qualitative Section */}
        {qualitativeQuestions.length > 0 && (
          <QualitativeStep
            answers={qualitative}
            onChange={handleQualitativeChange}
            questions={qualitativeQuestions}
            preview={true}
          />
        )}
      </div>
    </div>
  );
}
