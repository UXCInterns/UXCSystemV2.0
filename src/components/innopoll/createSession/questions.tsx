"use client";

import { PlusIcon } from "@/icons";
import { Dispatch, SetStateAction } from "react";

interface Statement {
  text: string;
  title: string;
  desc: string;
}

interface Question {
  question: string;
  statements: Statement[];
}

interface Props {
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
}

const QuestionInput = ({ questions, setQuestions }: Props) => {
  // Update question text
  const handleQuestionChange = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].question = value;
    setQuestions(updated);
  };

  // Update statement text
  const handleStatementChange = (qIndex: number, sIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].statements[sIndex].text = value;
    setQuestions(updated);
  };

  // Add statement
  const addStatement = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].statements.push({ text: "", title: "", desc: "" });
    setQuestions(updated);
  };

  // Add question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", statements: [{ text: "", title: "", desc: "" }] },
    ]);
  };

  // Delete question
  const deleteQuestion = (qIndex: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  return (
    <div className="flex flex-col p-2 max-w-full mx-auto">
      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="border rounded-lg p-4 bg-white shadow-sm dark:bg-dark-900 dark:border-gray-700 mb-4"
        >
          {/* Header: Question label + delete */}
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
              Question {qIndex + 1}
            </label>
            <button
              type="button"
              onClick={() => deleteQuestion(qIndex)}
              className="text-red-600 hover:text-red-800 text-lg"
            >
              ×
            </button>
          </div>

          {/* Question input */}
          <input
            type="text"
            value={q.question}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            placeholder="Enter question"
            className="w-full h-11 rounded-lg border px-4 py-2.5 mb-4 text-sm dark:bg-dark-900 dark:border-gray-700 dark:text-white/90"
          />

          {/* Statements */}
          <p className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
            Statements
          </p>
          <div className="flex flex-col gap-3">
            {q.statements.map((s, sIndex) => (
              <textarea
                key={sIndex}
                value={s.text}
                onChange={(e) =>
                  handleStatementChange(qIndex, sIndex, e.target.value)
                }
                placeholder="Enter statement text"
                className="w-full rounded-lg border px-4 py-2 text-sm min-h-[70px] resize-none overflow-visible dark:bg-dark-900 dark:border-gray-700 dark:text-white/90"
              />
            ))}

            {/* Add Statement */}
            <button
              type="button"
              onClick={() => addStatement(qIndex)}
              className="text-brand-600 dark:text-brand-400 text-sm hover:text-brand-700 flex items-center gap-1 mt-2"
            >
              <PlusIcon className="w-4 h-4" /> Add Statement
            </button>
          </div>
        </div>
      ))}

      {/* Add New Question */}
      <button
        type="button"
        onClick={addQuestion}
        className="w-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white mt-4"
      >
        <PlusIcon className="ml-1" /> Add New Question
      </button>
    </div>
  );
};

export default QuestionInput;
