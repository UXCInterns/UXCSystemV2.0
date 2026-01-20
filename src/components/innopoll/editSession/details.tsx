"use client";

import DatePicker from "@/components/form/date-picker";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Question } from "@/types/question";
import { updateSessionTitle } from "@/hooks/innopoll/updateSessionTitle";

interface EditSessionSidebarProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const EditSessionSidebar: React.FC<EditSessionSidebarProps> = ({ questions, setQuestions }) => {
  const { sessionId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [sessionName, setSessionName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const handleSessionTitleBlur = async () => {
  if (!sessionId || !sessionName.trim()) return;

  try {
    await updateSessionTitle(sessionId as string, sessionName);
  } catch (err) {
    console.error("Failed to auto-save session title:", err);
  }
};


  
  //  Fetch existing session + quiz so we can pre-fill inputs
  
  useEffect(() => {
    if (!sessionId) return;

    const loadSession = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        const data = await res.json();

        if (!data) return;

        // Pre-fill existing values
        setSessionName(data.session.title);
        setStartDate(data.quiz.start_date || "");
        setEndDate(data.quiz.end_date || "");
        setQuestions(data.quiz.questions || []);

      } catch (err) {
        console.error("Error loading session:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId]);

  
  //  Update session
  
  const handleUpdateSession = async () => {
    if (!sessionName) {
      alert("Session name cannot be empty");
      return;
    }

    try {
      const payload = {
        session_id: sessionId,
        title: sessionName,
        start_date: startDate,
        end_date: endDate,
        questions,
        scale_type: "5-point Likert",
        custom_scale: null,
      };

      const res = await fetch(`/api/sessions/upsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Update failed:", err);
        alert("Failed to update session");
        return;
      }

      alert("Session updated successfully!");
      router.push("/innoPoll");

    } catch (error) {
      console.error("Error updating:", error);
      alert("Error updating session");
    }
  };


  // LOADING SCREEN
  
  if (loading) {
    return <p className="p-4">Loading session...</p>;
  }

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
            onBlur={handleSessionTitleBlur} 
            placeholder="Enter session name"
            className="w-full dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          />
        </div>

        {/* Start Date */}
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Start Date
          </label>
          <DatePicker
            id="edit-start-date-picker"
            defaultDate={startDate}
            placeholder="Select a date"
            onChange={(dates) => {
              if (dates.length > 0) {
                setStartDate(dates[0].toISOString().split("T")[0]);
              } else {
                setStartDate("");
              }
            }}
          />
        </div>

        {/* End Date */}
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            End Date
          </label>
          <DatePicker
            id="edit-end-date-picker"
            defaultDate={endDate}
            placeholder="Select a date"
            onChange={(dates) => {
              if (dates.length > 0) {
                setEndDate(dates[0].toISOString().split("T")[0]);
              } else {
                setEndDate("");
              }
            }}
          />
        </div>

       
      

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/innoPoll")}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdateSession}
            className="w-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
          >
            Update Session
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSessionSidebar;
