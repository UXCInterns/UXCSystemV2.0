"use client";

import { PlusIcon } from "@/icons";
import { useState } from "react";

const QuestionInput = () => {
  const [questions, setQuestions] = useState(["", "", ""]); // start with 3 empty questions

  const handleChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const deleteQuestion = (index: number) => {
    if (questions.length === 1) return; // Optional: prevent deleting all questions
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <div className="flex flex-col p-2 max-w-full mx-auto">
      <form className="flex flex-col gap-6">
        {questions.map((answer, idx) => (
          <div key={idx} className="w-full">
            {/* Label + Delete button on same line */}
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor={`question-${idx}`}
                className="text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Question {idx + 1}
              </label>
              <button
                type="button"
                onClick={() => deleteQuestion(idx)}
                aria-label={`Delete question ${idx + 1}`}
                className="text-red-600 hover:text-red-800 focus:outline-none"
                title="Delete question"
              >
                &#x2715; {/* Unicode × */}
              </button>
            </div>
            {/* Input under label */}
            <input
              id={`question-${idx}`}
              type="text"
              value={answer}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder="Enter your question here"
              className="w-full dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
        >
          Add Question <PlusIcon className="ml-1" />
        </button>
      </form>
    </div>
  );
};

export default QuestionInput;
