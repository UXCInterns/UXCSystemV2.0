import React from "react";
import { Question } from "@/types/question";

interface Props {
  trainer: { id: string; name: string };
  statements: Question[];
  answers: { [id: number]: number };
  likertOptions: { label: string; color: string }[];
  onChange: (questionId: number, value: number) => void; // must match
  preview?: boolean;
}


export const TrainerStep: React.FC<Props> = ({ trainer, statements, answers, onChange, likertOptions }) => {
  const handleClick = (questionId: number, value: number) => {
    onChange(questionId, value); // directly update via callback
  };

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Trainer: {trainer.name}</h2>
      {statements.map((q) => (
        <div key={q.id} className="bg-gray-50 p-6 rounded-xl shadow-sm flex flex-col w-full">
          <span className="text-left font-medium text-lg mb-4">{q.text}</span>
          <div className="flex gap-4 justify-between w-full">
            {likertOptions.map((opt, oIdx) => (
              <button
                key={oIdx}
                type="button"
                className={`w-10 h-10 rounded-full border-2 transition focus:outline-none ${answers[q.id] === oIdx + 1 ? `border-black ${opt.color}` : "border-gray-300"}`}
                onClick={() => handleClick(q.id, oIdx + 1)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
