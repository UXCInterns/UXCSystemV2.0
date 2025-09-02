"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index"; // import your existing Modal
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";

interface Visit {
  id: string;
  company_name: string;
  date_of_visit: string;
  total_attended: number;
  total_registered: number;
  uen_number: string;
  start_time: string;
  end_time: string;
  duration: string;
  session_type: string;
  consultancy: boolean;
  training: boolean;
  revenue: number;
  sector: string;
  size: string;
  industry: string;
  notes: string;
  pace: boolean;
  informal: boolean;
  created_at: string;
  updated_at: string;
  conversion_status: string; // computed field
}

interface VisitDetailsModalProps {
  visit: Visit | null;
  isOpen: boolean;
  onClose: () => void;
}

const VisitDetailsModal: React.FC<VisitDetailsModalProps> = ({
  visit,
  isOpen,
  onClose,
}) => {
  if (!visit) return null;

  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: "SGD",
    }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl max-h-[90vh] overflow-y-auto p-2 custom-scrollbar">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {visit.company_name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visit ID: {visit.id}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                Company Information
              </h3>
              <div className="space-y-3">
                <div>
                  <Label>UEN Number</Label>
                  <Input
                    type="text"
                    value={visit.uen_number}
                    disabled={true}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Input
                    type="text"
                    value={visit.industry}
                    disabled={true}
                  />
                </div>
                <div>
                  <Label>Sector</Label>
                  <Input
                    type="text"
                    value={visit.sector}
                    disabled={true}
                  />
                </div>
                <div>
                  <Label>Company Size</Label>
                  <Input
                    type="text"
                    value={visit.size}
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                Session Details
              </h3>
              <div className="space-y-3">
                <div>
                  <Label>Date of Visit</Label>
                  <Input
                    type="date"
                    value={visit.date_of_visit}
                    disabled={true}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={visit.start_time}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={visit.end_time}
                      disabled={true}
                    />
                  </div>
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    type="text"
                    value={visit.duration}
                    disabled={true}
                  />
                </div>
                <div>
                  <Label>Session Type</Label>
                  <Input
                    type="text"
                    value={visit.session_type}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Attendance Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                Attendance Metrics
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                  <Label className="text-blue-700 dark:text-blue-300">Total Registered</Label>
                  <Input
                    type="number"
                    value={visit.total_registered}
                    disabled={true}
                    className="text-2xl font-bold"
                  />
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <Label className="text-green-700 dark:text-green-300">Total Attended</Label>
                  <Input
                    type="number"
                    value={visit.total_attended}
                    disabled={true}
                    className="text-2xl font-bold"
                  />
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                  <Label className="text-purple-700 dark:text-purple-300">Attendance Rate</Label>
                  <Input
                    type="text"
                    value={visit.total_registered > 0 
                      ? `${((visit.total_attended / visit.total_registered) * 100).toFixed(1)}%`
                      : "-"
                    }
                    disabled={true}
                    className="text-2xl font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Conversion Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                Conversion Outcomes
              </h3>
              <div className="flex space-x-6">
                <div className="flex-1 space-y-3 border-r border-gray-300 dark:border-gray-800 h-full">
                  <Label>Consultancy Conversion</Label>
                  <Radio
                    id="consultancy-yes"
                    name="consultancy"
                    value="yes"
                    checked={visit.consultancy}
                    label="Yes"
                    onChange={() => {}}
                    disabled={true}
                    className="mb-2"
                  />
                  <Radio
                    id="consultancy-no"
                    name="consultancy"
                    value="no"
                    checked={!visit.consultancy}
                    label="No"
                    onChange={() => {}}
                    disabled={true}
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <Label>Training Conversion</Label>
                  <Radio
                    id="training-yes"
                    name="training"
                    value="yes"
                    checked={visit.training}
                    label="Yes"
                    onChange={() => {}}
                    disabled={true}
                    className="mb-2"
                  />
                  <Radio
                    id="training-no"
                    name="training"
                    value="no"
                    checked={!visit.training}
                    label="No"
                    onChange={() => {}}
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                Financial Impact
              </h3>
              <div>
                <Label>Revenue Generated</Label>
                <Input
                  type="text"
                  value={visit.revenue > 0 ? formatCurrency(visit.revenue) : "No Revenue Generated"}
                  disabled={true}
                  className="text-2xl font-bold bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
                />
              </div>
            </div>

            {/* Session Characteristics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                Session Characteristics
              </h3>
              <div className="space-y-3">
                <Radio
                  id="pace-program"
                  name="pace"
                  value="pace"
                  checked={visit.pace}
                  label="PACE Program"
                  onChange={() => {}}
                  disabled={true}
                />
                <Radio
                  id="informal-session"
                  name="informal"
                  value="informal"
                  checked={visit.informal}
                  label="Informal Session"
                  onChange={() => {}}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes - Full Width */}
        {visit.notes && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
              Additional Notes
            </h3>
            <div>
              <Label>Visit Notes</Label>
              <TextArea
                value={visit.notes}
                rows={1}
                disabled={true}
              />
            </div>
          </div>
        )}

        {/* Metadata Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-xs">Record Created</Label>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(visit.created_at).toLocaleString("en-GB")}
              </p>
            </div>
            <div>
              <Label className="text-xs">Last Updated</Label>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(visit.updated_at).toLocaleString("en-GB")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VisitDetailsModal;