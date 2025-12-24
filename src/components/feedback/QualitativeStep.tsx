import React from "react";
import { Question } from "@/types/question";

interface Props {
  questions: Question[]; // list of qualitative questions
  answers: { [id: number]: string }; // answers tracked by question ID
  onChange: (questionId: number, value: string) => void; // update a single question
  preview?: boolean;
}

export const QualitativeStep: React.FC<Props> = ({ questions, answers, onChange }) => {
  const handleChange = (questionId: number, value: string) => {
    onChange(questionId, value);
  };

  return (
    <div className="space-y-6 w-full">
      {questions.map((q) => (
        <div key={q.id}>
          <label className="block text-lg font-medium mb-2">{q.text}</label>
          <textarea
            value={answers[q.id] || ""}
            onChange={(e) => onChange(q.id, e.target.value)}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      ))}
    </div>
  );
};