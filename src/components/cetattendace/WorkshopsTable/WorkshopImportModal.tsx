"use client";

import React, { useState } from "react";
import { Upload, AlertCircle, X, CheckCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { parseExcelFile } from "@/utils/WorkshopAttendanceUtils/ImportExcelUtils/excelParsingUtils";
import { transformExcelData, validateExcelData } from "@/utils/WorkshopAttendanceUtils/ImportExcelUtils/excelDataExtraction";
import ChartTab from "../PaceToggle";
import { chunkArray } from "@/utils/WorkshopAttendanceUtils/ImportExcelUtils/chunkArray";


interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File, previewData: ImportPreviewData) => Promise<void>;
}

type ImportStep = "select" | "preview" | "uploading" | "complete";

// Preview data shown to user before import
export interface ImportPreviewData {
  fileName: string;
  rowCount: number;
  columnCount: number;
  headers: string[];
  sampleData: (string | number)[][];
  hasHeaders: boolean;
  extractedData?: any[];
  validationErrors?: string[];
  validationWarnings?: string[];
  programType?: 'pace' | 'non_pace';
}

export default function WorkshopImportModal({ isOpen, onClose, }: ImportModalProps) {
  const [step, setStep] = useState<ImportStep>("select");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportPreviewData | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  //(STATE) toggle between pace and non-pace for import
  const [programType, setProgramType] = useState<"pace" | "non_pace">("pace");



  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Please select a valid Excel file (.xlsx or .xls)");
      return;
    }
    setSelectedFile(file);
    setError(null);
    generatePreview(file, programType);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const generatePreview = async (file: File, programType: 'pace' | 'non_pace'
  ) => {
    try {
      const rawData = await parseExcelFile(file);

      if (rawData.length === 0) {
        throw new Error("No data found in Excel file");
      }

      const validation = validateExcelData(rawData, programType);

      if (validation.errors.length > 0) {
        setError(validation.errors.join("\n"));
      }
      const extractedData = transformExcelData(rawData, programType)

      const headers = Object.keys(rawData[0]);
      const sampleData = rawData.slice(0, 5).map(row =>
        headers.map(header => row[header] ?? "")
      );

      const preview: ImportPreviewData = {
        fileName: file.name,
        rowCount: rawData.length,
        columnCount: headers.length,
        headers,
        sampleData,
        hasHeaders: true,
        extractedData,
        validationErrors: validation.errors,
        validationWarnings: validation.warnings,

        programType,
      };

      setPreviewData(preview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse Excel file");
    }
  };

  const handlePreview = () => {
    if (selectedFile && previewData) {
      setStep("preview");
    }
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) return;

    setStep("uploading");
    setUploadProgress(0);
    setError(null);

    const statusMessages = [
      "Initializing upload...",
      "Reading file...",
      "Validating data...",
      "Processing rows...",
      "Storing in database...",
      "Finalizing...",
    ];

    const uploadDuration = 4000;
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / uploadDuration) * 100, 99);

      setUploadProgress(Math.floor(progress));
      const messageIndex = Math.floor((progress / 100) * statusMessages.length);
      if (messageIndex < statusMessages.length) {
        setUploadStatus(statusMessages[messageIndex]);
      }

      if (progress >= 99) {
        clearInterval(progressInterval);
      }
    }, 100);

    try {

      const rawData = await parseExcelFile(selectedFile);

      const transformedData = transformExcelData(rawData, programType);

      const indexedData = transformedData.map((item,) => ({
        ...item,
        
      }));

      const chunks = chunkArray(indexedData, 10);

      const failedItems: any[] = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        const results = await Promise.allSettled(
          chunk.map(async (item) => {
            const res = await fetch("/api/workshops", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(item),
            });

            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(errorText);
            }

            return res.json();
          })
        );

        // 5. Collect failures
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            failedItems.push(chunk[index]);
          }
        });

        // 6. Real progress (based on chunks)
        setUploadProgress(
          Math.floor(((i + 1) / chunks.length) * 100)
        );
      }

      // 7. Final state
      setUploadProgress(100);
      setUploadStatus("Upload complete!");

      if (failedItems.length > 0) {
        console.warn("Some rows failed:", failedItems);
        setError(
          `${failedItems.length} rows failed to upload. Check console.`
        );
      }

      setTimeout(() => {
        setStep("complete");
      }, 500);

    } catch (err) {

      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Upload failed");
      setStep("select");
      setSelectedFile(null);
      setPreviewData(null);

    }
  };

  const handleAbortUpload = () => {
    setStep("preview");
    setUploadProgress(0);
    setUploadStatus("");
  };

  const handleDone = () => {
    resetModal();
    onClose();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setError(null);
  };

  const resetModal = () => {
    setStep("select");
    setSelectedFile(null);
    setPreviewData(null);
    setUploadProgress(0);
    setUploadStatus("");
    setError(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>


      {/* Desktop Modal */}
      <div className="hidden md:block">
        <Modal
          isOpen={isOpen}
          onClose={handleClose}
          showCloseButton={false}
          className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {step === "select" && "Import Excel File"}
                    {step === "preview" && "Review Import"}
                    {step === "uploading" && "Uploading"}
                    {step === "complete" && "Import Complete"}
                  </h3>
                </div>
                {step !== "uploading" && (
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {/* Step 1: File Selection */}
              {step === "select" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Workshop Type
                    </p>

                    <div className="w-fit scale-90 origin-left ml-auto">
                      <ChartTab
                        selected={programType}
                        onToggle={setProgramType}
                      />
                    </div>
                  </div>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  >
                    <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                    <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Drop Excel file here
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      .xlsx or .xls
                    </p>
                    <input
                      id="fileInput"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </div>

                  {selectedFile && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-700 dark:text-green-300">
                          {selectedFile.name}
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="text-green-600 hover:text-green-700 dark:text-green-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  )}

                  {previewData?.validationWarnings && previewData.validationWarnings.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                        Warnings:
                      </p>
                      {previewData.validationWarnings.map((warning: string, idx: number) => (
                        <p key={idx} className="text-sm text-yellow-700 dark:text-yellow-400">
                          • {warning}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Preview */}
              {step === "preview" && previewData && (
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-4 font-medium">
                      File: {previewData.fileName}
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                          Total rows
                        </p>
                        <p className="text-3xl font-semibold text-blue-900 dark:text-blue-100">
                          {previewData.rowCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                          Columns
                        </p>
                        <p className="text-3xl font-semibold text-blue-900 dark:text-blue-100">
                          {previewData.columnCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                          Program Type
                        </p>
                        <p className="text-3xl font-semibold text-blue-900 dark:text-blue-100">
                          {previewData.programType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Preview (first 5 rows)
                    </p>
                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-800">
                            {previewData.headers.map((header: string, idx: number) => (
                              <th
                                key={idx}
                                className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0 whitespace-nowrap"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.sampleData.map((row: any, rowIdx: number) => (
                            <tr
                              key={rowIdx}
                              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              {row.map((cell: any, cellIdx: number) => (
                                <td
                                  key={cellIdx}
                                  className="px-4 py-3 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Uploading */}
              {step === "uploading" && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {selectedFile?.name}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Processing data</p>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {uploadProgress}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      Status
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{uploadStatus}</p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Do not close this window during upload
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Complete */}
              {step === "complete" && (
                <div className="space-y-6 text-center">

                  <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                      Import Complete
                    </h3>

                    <p className="text-base text-gray-600 dark:text-gray-400">
                      {selectedFile?.name}
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                      Your data has been successfully imported.
                    </p>
                  </div>

                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
              {step === "select" && (
                <>
                  <Button variant="outline" size="md" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handlePreview}
                    disabled={!selectedFile}
                    startIcon={<Upload className="w-4 h-4" />}
                  >
                    Preview
                  </Button>
                </>
              )}

              {step === "preview" && (
                <>
                  <Button variant="outline" size="md" onClick={() => setStep("select")}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleConfirmImport}
                    startIcon={<Upload className="w-4 h-4" />}
                  >
                    Confirm & Import
                  </Button>
                </>
              )}

              {step === "uploading" && (
                <Button variant="outline" size="md" onClick={handleAbortUpload}>
                  Cancel Upload
                </Button>
              )}

              {step === "complete" && (
                <Button variant="primary" size="md" onClick={handleDone}>
                  Done
                </Button>
              )}
            </div>
          </div>
        </Modal>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .dragover {
          @apply border-blue-500 bg-blue-50 dark:bg-blue-900/10;
        }
      `}</style>
    </>
  );
}