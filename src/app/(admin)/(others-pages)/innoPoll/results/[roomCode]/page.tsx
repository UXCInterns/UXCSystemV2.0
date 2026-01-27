'use client';

import React, { useState, useEffect } from 'react';
import { useRealtimePollResults } from '@/hooks/innopoll/useRealTimeResults';
import { useParams } from 'next/navigation';
import RadialChart from '@/components/innopoll/RadialChart';
import { useSidebar } from '@/context/SidebarContext';


const questionCategoryMap: Record<string, string> = {
  "INNOVATION CULTURE": "CULTURE",
  "INNOVATION PRACTICES": "PRACTICES",
  "INNOVATION LEADERSHIP": "LEADERSHIP",
};


const BASE_QUESTIONS = [
  {
    key: 'culture',
    title: 'CULTURE',
    desc: 'Average score',
    color: '#ea580c',
    gradient: 'from-orange-400 to-yellow-500',
  },
  {
    key: 'capability',
    title: 'PRACTICES',
    desc: 'Average score',
    color: '#2563eb',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    key: 'process',
    title: 'LEADERSHIP',
    desc: 'Average score',
    color: '#059669',
    gradient: 'from-green-400 to-emerald-500',
  },
];


const InnovationPollPreview: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const params = useParams();
  const [isFullpage, setIsFullpage] = useState(false);
  const roomCode = params.roomCode as string;

  const { setHideHeader } = useSidebar();

  useEffect(() => {
    setHideHeader(isFullpage);

    return () => setHideHeader(false);
  }, [isFullpage, setHideHeader]);

  //Escape full page 
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullpage(false); // exit fullscreen
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc); // cleanup
    };
  }, []);

  const {
    pollData,
    isLoading,
    error,
  } = useRealtimePollResults(roomCode, null);



  const liveScores = BASE_QUESTIONS.map(base => {
    const matchingQuestion = Object.values(pollData).find(
      q => questionCategoryMap[q.title.toUpperCase()] === base.title
    );
    return {
      title: base.title,
      desc: base.desc,
      score: matchingQuestion ? Math.round(matchingQuestion.avgScore) : 0,
      color: base.color,
      gradient: base.gradient,
    };
  });


  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl">
        Loading live results…
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div
      className={`
    ${isFullpage ? 'fixed inset-0 z-[9999]' : 'relative'}
    w-full h-full
    ${darkMode ? 'bg-slate-900' : 'bg-white'}
    flex flex-col items-center justify-between
    ${isFullpage ? 'pt-16' : ''}
  `}
    >




      {/* Mode Toggle Button */}

      <div className="absolute top-8 right-8 z-50 flex flex-col gap-4">
        {/* Dark Mode Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300
      ${darkMode
              ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              : 'bg-slate-800/10 text-slate-800 hover:bg-slate-800/20 border border-slate-800/20'
            }`}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullpage(!isFullpage)}
          className="px-6 py-3 rounded-full font-semibold border border-gray-400 bg-white/10 hover:bg-white/20"
        >
          {isFullpage ? 'Exit Fullpage' : 'Go Fullpage'}
        </button>
      </div>




      {/* Animated background elements */}
      <div
        className={`absolute inset-0 overflow-hidden ${darkMode ? 'opacity-10' : 'opacity-20'
          }`}
      >
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div
            className={`inline-block px-6 py-2 ${darkMode
              ? 'bg-gradient-to-r from-orange-500/20 to-green-500/20 border-white/10'
              : 'bg-gradient-to-r from-orange-500/10 to-green-500/10 border-slate-800/10'
              } rounded-full backdrop-blur-sm mb-4 border`}
          >
            <span
              className={`text-sm font-semibold ${darkMode ? 'text-white/80' : 'text-slate-700'
                } tracking-wider`}
            >
              LIVE RESULTS
            </span>
          </div>
          <h1
            className={`text-7xl font-black mb-3 leading-tight ${darkMode
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-600 to-green-600'
              }`}
          >
            INNOVATION READINESS
          </h1>
          <p className={`text-2xl font-light ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
            Real-time team assessment
          </p>
        </div>

        {/* Three Circles Grid */}
        <div className={`
    grid grid-cols-3 gap-6 mb-8
    ${isFullpage ? 'max-w-5xl mx-auto' : 'w-full'}
  `}>
          {liveScores.map((score, index) => (

            <div key={index} className="flex flex-col items-center group">
              {/* Chart */}
              <div className={"w-80 h-80 mb-6 transform group-hover:scale-105 transition-transform duration-300"}>
                <RadialChart score={score.score} color={score.color} />
              </div>

              {/* Label */}
              <div className="text-center">
                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${score.gradient} mb-3`}>
                  <h2 className="text-xl font-bold text-white tracking-wide">{score.title}</h2>
                </div>
                <p className={`text-base font-light ${darkMode ? 'text-white/70' : 'text-slate-600'}`}>
                  {score.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center space-y-3 pb-4">
          <div
            className={`h-px w-32 ${darkMode
              ? 'bg-gradient-to-r from-transparent via-white/30 to-transparent'
              : 'bg-gradient-to-r from-transparent via-slate-300 to-transparent'
              } mx-auto mb-4`}
          ></div>
          <p className={`text-xl font-medium ${darkMode ? 'text-white/90' : 'text-slate-800'}`}>
            📧 uxc@sp.edu.sg
          </p>

        </div>
      </div>
    </div>
  );
};

export default InnovationPollPreview;
