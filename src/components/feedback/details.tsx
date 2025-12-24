"use client";

import DatePicker from "@/components/form/date-picker";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FIXED_QUESTIONS } from "@/constants/fixedQuestions";

const CreateSurveySidebar = () => {
  const [sessionTitle, setSessionTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();





  // 🔄 Reset all fields
  const handleCancel = () => {
    setSessionTitle("");
    setStartDate("");
    setEndDate("");
  };

  // 🧭 Cancel and go back to feedback page
  const handleCancelSurvey = () => {
    router.push("/feedback"); //returning back to the survey creation page
  };


  const handleCreateSurvey = async () => {


    if (!sessionTitle) {
      alert("Please enter a session title");
      return;
    }

    try {
      //  Create the session
      const sessionResponse = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: sessionTitle }),
      });

      if (!sessionResponse.ok) {
        const errData = await sessionResponse.json();
        throw new Error(errData.error || "Failed to create session");
      }

      const sessionResult = await sessionResponse.json();

      const sessionId = sessionResult?.session?.id;


      const quizData = {
        session_id: sessionId,
        title: `${sessionTitle} Survey`,
        questions: FIXED_QUESTIONS.map((q) => ({
          id: q.id,
          text: q.text.replace("%[Trainer]Q7_1%", "John Doe"), // replace trainer placeholder dynamically
          type: q.type,
          required: true,
          enabled: true,
        })),

        trainers: [],
        scale_type: "5-point Likert",
        custom_scale: null,
        start_date: startDate,
        end_date: endDate,
      };




      //  Send quizData to backend
      const quizResponse = await fetch("/api/sessions/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData), // ✅ send object directly
      });

      console.log(quizData)
      //  If error, log response
      if (!quizResponse.ok) {
        const text = await quizResponse.text();
        console.error("Backend response on quiz creation error:", text);
        throw new Error("Failed to create quiz");
      }

      const quizResult = await quizResponse.json();

      if (quizResponse.ok) {
        const roomCode = quizResult?.room_code || quizResult?.quiz?.room_code;
        console.log("🧭 Redirecting to room:", roomCode);

        // Redirect user to landind page to scan qr code 
        router.push(`/join/${roomCode}`);

      } else {
        console.error(" Quiz creation failed:", quizResult);
        alert("Failed to create quiz");
      }

    } catch (error) {
      console.error("Error creating session/quiz:", error);
      alert("Error creating session or quiz. Please try again.");
    }
  };





  return (
    <div className="flex flex-col p-2 max-w-full mx-auto">
      <form className="flex flex-col gap-6">
        {/* Session Title */}
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Workshop Name
          </label>
          <input
            type="text"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            placeholder="Enter session name"
            className="w-full dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          />
        </div>

        {/* Start Date */}
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Start Date
          </label>
          <div className="relative">
            <DatePicker
              id="start-date-picker"
              placeholder="Select a date"

              onChange={(dates) => {
                if (dates.length > 0) {
                  const localDate = `${dates[0].getFullYear()}-${(dates[0].getMonth() + 1).toString().padStart(2, '0')}-${dates[0].getDate().toString().padStart(2, '0')}`;
                  setStartDate(localDate);

                } else {
                  setEndDate("");
                }
              }}

            />
          </div>
        </div>

        {/* End Date */}
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            End Date
          </label>
          <div className="relative">
            <DatePicker
              id="end-date-picker"
              placeholder="Select a date"
              onChange={(dates) => {
                if (dates.length > 0) {
                  const localDate = `${dates[0].getFullYear()}-${(dates[0].getMonth() + 1).toString().padStart(2, '0')}-${dates[0].getDate().toString().padStart(2, '0')}`;
                  setEndDate(localDate);

                } else {
                  setEndDate("");
                }
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              handleCancel();
              handleCancelSurvey();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreateSurvey}
            className="w-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
          >
            Create Session
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSurveySidebar;
