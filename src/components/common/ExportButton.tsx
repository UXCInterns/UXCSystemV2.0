"use client";

import React from "react";
import domtoimage from "dom-to-image-more";

export const ExportButton: React.FC = () => {
  const handleExport = () => {
    const target = document.getElementById("screenshotTarget");

    if (!target) {
      console.error("Screenshot target not found.");
      return;
    }

    // Scale factor (e.g., 2 for 2x resolution)
    const scale = 2;
    const isDark = document.documentElement.classList.contains("dark");

    const width = target.offsetWidth * scale;
    const height = target.offsetHeight * scale;

    // Temporarily apply the "screenshot-clean" class
    target.classList.add("screenshot-clean");

        domtoimage.toPng(target, {
        bgcolor: isDark ? "#0f172a" : "#f6f6f6",
        width,
        height,
        style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${target.offsetWidth}px`,
            height: `${target.offsetHeight}px`,
        },
        useCORS: true, // <--- try this for cross-origin images
        })
      .then((dataUrl) => {
        target.classList.remove("screenshot-clean");

        const link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        target.classList.remove("screenshot-clean");
        console.error("Screenshot export failed:", error);
      });
  };

  return (
    <button
      onClick={handleExport}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3v12m0 0l-4-4m4 4l4-4m-9 5h10a2 2 0 012 2v2H5v-2a2 2 0 012-2h1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default ExportButton;