"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import TotalTraineeHours from "@/components/cettraining/TotalTraineeHours";
import TraineeHoursByMonth from "@/components/cettraining/TraineeHoursByMonth";
import VisitorsByMonth from "@/components/cettraining/VisitorsByMonth";
import CourseTypeMetrics from "@/components/cettraining/CourseTypeMetrics";

import { PeriodProvider } from "@/context/PeriodContext";
import { StatMetrics } from "@/components/cettraining/StatsMetrics";
import { BIALevelMetrics } from "@/components/cettraining/BIALevelMetrics";
import { DurationMetrics } from "@/components/cettraining/DurationMetrics";

export default function CETTraining() {
  return (
    <>
      <PageBreadcrumb
        pageTitle="CET Training"
        items={[
          { label: "Home", href: "/" },
          { label: "CET Training"},
        ]}
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <PeriodProvider>
          <CETTrainingContent />
        </PeriodProvider>
      </div>
    </>
  );
}

// Separate component to handle the state inside PeriodProvider
function CETTrainingContent() {
  const [selectedProgram, setSelectedProgram] = useState<"pace" | "non_pace">("pace");

  return (
    <>
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <StatMetrics 
          selectedProgram={selectedProgram} 
          setSelectedProgram={setSelectedProgram} 
        />
      </div>
      <div className="col-span-12 xl:col-span-7">
        <VisitorsByMonth programType={selectedProgram} />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <TotalTraineeHours programType={selectedProgram} />
      </div>
      <div className="col-span-12 xl:col-span-4">
        <CourseTypeMetrics programType={selectedProgram} />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <BIALevelMetrics programType={selectedProgram} />
      </div>
      <div className="col-span-12 xl:col-span-3">
        <DurationMetrics programType={selectedProgram} />
      </div>
      <div className="col-span-12">
        <TraineeHoursByMonth programType={selectedProgram} />
      </div>
    </>
  );
}