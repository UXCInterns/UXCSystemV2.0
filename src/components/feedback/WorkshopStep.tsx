import React from "react";
import { Question } from "@/types/question";

interface Props {
  statements: Question[]; // <-- changed from string[]
  answers: { [id: number]: number }; // <-- track answers by question ID
  onChange: (questionId: number, value: number) => void; // <-- use ID for updates
  likertOptions: { label: string; color: string }[];
  preview?: boolean;
}

export const WorkshopStep: React.FC<Props> = ({ statements, answers, onChange, likertOptions }) => {
  return (
    <div className="space-y-6 w-full">
      {statements.map((q) => (
        <div key={q.id} className="bg-gray-50 p-6 rounded-xl shadow-sm flex flex-col w-full">
          <span className="text-left font-medium text-lg mb-4">{q.text}</span>
          <div className="flex gap-4 justify-between w-full">
            {likertOptions.map((opt, oIdx) => (
              <button
                key={oIdx}
                type="button"
                className={`w-10 h-10 rounded-full border-2 transition ${
                  answers[q.id] === oIdx + 1 ? `border-black ${opt.color}` : "border-gray-300"
                }`}
                onClick={() => onChange(q.id, oIdx + 1)} // <-- use question ID
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

