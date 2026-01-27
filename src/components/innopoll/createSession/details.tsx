"use client";

import DatePicker from "@/components/form/date-picker";
import { useRouter } from "next/navigation";
import { useState, Dispatch, SetStateAction } from "react";
import { useUser } from "@/hooks/useUser";
import { Question } from "@/types/question";

interface Props {
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
}


const CreateSessionSidebar = ({ questions }: Props) => {
  const router = useRouter();
  const { id } = useUser()




  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // YYYY-MM-DD format
  };

  // Default dates
  const today = new Date();
  const sevenDaysLater = new Date(today.getTime());
  sevenDaysLater.setDate(today.getDate() + 7);

  const [sessionName, setSessionName] = useState("");
  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(sevenDaysLater));



  const handleCancel = () => {
    setSessionName("");
    setStartDate("");
    setEndDate("");
  };

  const handleCreateSession = async () => {
     

    if (!sessionName) {
      alert("please enter a session title")
      return
    }
    try {
      //  Create the session
      const sessionResponse = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: sessionName }),
      });

      if (!sessionResponse.ok) {
        const errData = await sessionResponse.json();
        throw new Error(errData.error || "Failed to create session");
      }

      const sessionResult = await sessionResponse.json();
      console.log("Session creation result:", sessionResult);

      const sessionId = sessionResult?.session?.id;


      const quizData = {
        session_id: sessionId,
        title: `${sessionName} `,
        questions,
        scale_type: "5-point Likert",
        custom_scale: null,
        start_date: startDate,
        end_date: endDate,
        created_by: id
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



  const handleCancelSession = () => {
    router.push("/innoPoll"); // ✅ navigate to create-session page
  };



  return (
    <div className="flex flex-col p-2 max-w-full mx-auto">
      <form className="flex flex-col gap-6">
        {/* Session Name */}
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Session Name
          </label>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
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
              defaultDate={new Date(startDate)}
              onChange={(dates: Date[]) => setStartDate(formatDate(dates[0]))}
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
              defaultDate={new Date(endDate)} // ✅ string, not Date
              onChange={(dates: Date[]) => setEndDate(formatDate(dates[0]))}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              handleCancel();
              handleCancelSession();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateSession}
            className="w-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
          >
            Create Session
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSessionSidebar;
