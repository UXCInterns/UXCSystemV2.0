"use client";

import React, { useState } from "react";

export const ExportButton: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const target = document.getElementById("screenshotTarget");

    if (!target) {
      console.error("Screenshot target not found.");
      return;
    }

    setIsExporting(true);

    try {
      // Add screenshot class
      target.classList.add("screenshot-clean");

      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 200));

      // Method 1: Using html-to-image (recommended - most accurate)
      // Install: npm install html-to-image
      const { toPng } = await import('html-to-image');
      
      const dataUrl = await toPng(target, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: false,
        includeQueryParams: true,
        style: {
          margin: '0',
        }
      });

      // Download
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `dashboard-${timestamp}.png`;
      link.href = dataUrl;
      link.click();

      target.classList.remove("screenshot-clean");

    } catch (error) {
      console.error("Screenshot export failed:", error);
      target.classList.remove("screenshot-clean");
      
      // Fallback: Browser native method
      try {
        // Try browser's native share/download API
        if (navigator.share) {
          alert("Screenshot failed. Please use your browser's screenshot tool:\n\nChrome/Edge: Ctrl+Shift+S\nMac: Cmd+Shift+5\nFirefox: Ctrl+Shift+S");
        } else {
          alert("Screenshot failed. Please try:\n1. Browser screenshot tool (Ctrl+Shift+S or Cmd+Shift+5)\n2. Right-click > 'Capture screenshot'\n3. Browser extension");
        }
      } catch {
        alert("Screenshot failed. Please use your browser's built-in screenshot feature.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      title="Export Dashboard"
    >
      {isExporting ? (
        <svg
          className="animate-spin"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
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
      )}
    </button>
  );
};

export default ExportButton;