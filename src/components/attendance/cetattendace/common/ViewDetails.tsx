"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Badge from "@/components/ui/badge/Badge";

interface Workshop {
  id: string;
  course_program_title: string;
  program_start_date: string;
  program_end_date: string;
  no_of_participants: number;
  trainee_hours: number;
  program_type: string;
  school_dept: string;
  course_hours: number;
  company_sponsored_participants: number;
  run_number?: string;
  individual_group_participants?: number;
  course_type?: string;
  subsidy_description?: string;
  bia_level?: string;
  learning_outcome?: string;
  category?: string; // for PACE workshops
  csc?: boolean; // for non-PACE workshops
  created_at: string;
  updated_at: string;
}

interface WorkshopDetailsModalProps {
  workshop: Workshop | null;
  isOpen: boolean;
  onClose: () => void;
}

const WorkshopDetailsModal: React.FC<WorkshopDetailsModalProps> = ({
  workshop,
  isOpen,
  onClose,
}) => {
  if (!workshop) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const calculateDuration = () => {
    const startDate = new Date(workshop.program_start_date);
    const endDate = new Date(workshop.program_end_date);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "1 day" : `${diffDays + 1} days`;
  };

  // Calculate workshop status based on dates
  const getWorkshopStatus = () => {
    const today = new Date();
    const startDate = new Date(workshop.program_start_date);
    const endDate = new Date(workshop.program_end_date);
    
    if (today < startDate) return { status: "Upcoming", color: "blue" };
    if (today > endDate) return { status: "Completed", color: "gray" };
    return { status: "In Progress", color: "green" };
  };

  const workshopStatus = getWorkshopStatus();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-4">
                {workshop.course_program_title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Workshop ID: {workshop.id}
              </p>
              <div className="mt-2 flex gap-2">
                <Badge
                  variant="light"
                  color={workshop.program_type === "pace" ? "info" : "primary"}
                  size="sm"
                >
                  {workshop.program_type === "pace" ? "PACE Program" : "NON-PACE Program"}
                </Badge>
                {workshop.program_type === 'pace' && workshop.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    {workshop.category}
                  </span>
                )}
                {workshop.program_type === 'non_pace' && workshop.csc && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                    CSC Eligible
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Program Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Program Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label>School/Department</Label>
                    <Input
                      type="text"
                      value={workshop.school_dept}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <Label>Course Type</Label>
                    <Input
                      type="text"
                      value={workshop.course_type || "Not specified"}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <Label>Run Number</Label>
                    <Input
                      type="text"
                      value={workshop.run_number || "Not specified"}
                      disabled={true}
                    />
                  </div>
                  {workshop.program_type === 'pace' && (
                    <div>
                      <Label>PACE Category</Label>
                      <Input
                        type="text"
                        value={workshop.category || "Not specified"}
                        disabled={true}
                        className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      />
                    </div>
                  )}
                  {workshop.program_type === 'non_pace' && (
                    <div>
                      <Label>CSC Eligible</Label>
                      <div className="flex space-x-6 mt-2">
                        <Radio
                          id="csc-yes-view"
                          name="csc-view"
                          value="yes"
                          checked={workshop.csc === true}
                          label="Yes"
                          onChange={() => {}}
                          disabled={true}
                        />
                        <Radio
                          id="csc-no-view"
                          name="csc-view"
                          value="no"
                          checked={workshop.csc === false}
                          label="No"
                          onChange={() => {}}
                          disabled={true}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Schedule Details
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="text"
                        value={formatDate(workshop.program_start_date)}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="text"
                        value={formatDate(workshop.program_end_date)}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      type="text"
                      value={calculateDuration()}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <Label>Course Hours</Label>
                    <Input
                      type="text"
                      value={`${workshop.course_hours} hours`}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Participant Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Participant Metrics
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                    <Label className="text-blue-700 dark:text-blue-300">Total Participants</Label>
                    <Input
                      type="text"
                      value={workshop.no_of_participants.toString()}
                      disabled={true}
                      className="text-2xl font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                      <Label className="text-green-700 dark:text-green-300">Company Sponsored</Label>
                      <Input
                        type="text"
                        value={workshop.company_sponsored_participants.toString()}
                        disabled={true}
                        className="text-2xl font-bold"
                      />
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                      <Label className="text-purple-700 dark:text-purple-300">Individual/Group</Label>
                      <Input
                        type="text"
                        value={(workshop.individual_group_participants || (workshop.no_of_participants - workshop.company_sponsored_participants)).toString()}
                        disabled={true}
                        className="text-2xl font-bold"
                      />
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                    <Label className="text-amber-700 dark:text-amber-300">Total Trainee Hours</Label>
                    <Input
                      type="text"
                      value={`${workshop.trainee_hours} hours`}
                      disabled={true}
                      className="text-2xl font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Course Administration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Course Administration
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>BIA Level</Label>
                    <div className="flex space-x-4 mt-2">
                      <Radio
                        id="bia-basic-view"
                        name="bia-level-view"
                        value="basic"
                        checked={workshop.bia_level?.toLowerCase() === "basic"}
                        label="Basic"
                        onChange={() => {}}
                        disabled={true}
                      />
                      <Radio
                        id="bia-intermediate-view"
                        name="bia-level-view"
                        value="intermediate"
                        checked={workshop.bia_level?.toLowerCase() === "intermediate"}
                        label="Intermediate"
                        onChange={() => {}}
                        disabled={true}
                      />
                      <Radio
                        id="bia-advanced-view"
                        name="bia-level-view"
                        value="advanced"
                        checked={workshop.bia_level?.toLowerCase() === "advanced"}
                        label="Advanced"
                        onChange={() => {}}
                        disabled={true}
                      />
                      <Radio
                        id="bia-none-view"
                        name="bia-level-view"
                        value="none"
                        checked={!workshop.bia_level || workshop.bia_level === "Not specified"}
                        label="Not specified"
                        onChange={() => {}}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Subsidy Description</Label>
                    <Input
                      type="text"
                      value={workshop.subsidy_description || "No subsidy information"}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Outcomes - Full Width */}
          {workshop.learning_outcome && (
            <div className="space-y-4 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 pt-6">
                Learning Outcomes
              </h3>
              <div>
                <Label>Course Objectives & Learning Outcomes</Label>
                <TextArea
                  value={workshop.learning_outcome}
                  rows={4}
                  disabled={true}
                  className="min-h-[100px]"
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
                  {new Date(workshop.created_at).toLocaleString("en-GB")}
                </p>
              </div>
              <div>
                <Label className="text-xs">Last Updated</Label>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(workshop.updated_at).toLocaleString("en-GB")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WorkshopDetailsModal;