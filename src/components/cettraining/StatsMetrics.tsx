"use client";
import React, { useState, useMemo } from "react";
import useSWR from "swr";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, UserIcon } from "@/icons";
import { Presentation, Clock, Building2, Group, User } from "lucide-react";
import ChartTab from "../common/PaceToggle";
import { usePeriod } from "@/context/PeriodContext";
import PeriodSelector from "../period/PeriodContext";

// Types
interface StatsMetricsProps {
  selectedProgram: "pace" | "non_pace";
  setSelectedProgram: (program: "pace" | "non_pace") => void;
}

// Flip Card Component for Total Workshops
const WorkshopCard: React.FC<{
  workshopData: any[];
  comparisonWorkshopData?: any[];
  programType: "pace" | "non_pace";
  loading: boolean;
  periodRange: { startDate: string; endDate: string };
  comparisonPeriodRange?: { startDate: string; endDate: string };
  hasComparison: boolean;
}> = ({ workshopData, comparisonWorkshopData, programType, loading, periodRange, comparisonPeriodRange, hasComparison }) => {
  const [flipped, setFlipped] = useState(false);

  const filteredWorkshops = useMemo(() => {
    return workshopData.filter(workshop => {
      if (workshop.program_type !== programType) return false;
      
      const startDate = new Date(workshop.program_start_date);
      const endDate = new Date(workshop.program_end_date);
      const rangeStart = new Date(periodRange.startDate);
      const rangeEnd = new Date(periodRange.endDate);
      
      return startDate <= rangeEnd && endDate >= rangeStart;
    });
  }, [workshopData, programType, periodRange]);

  const filteredComparisonWorkshops = useMemo(() => {
    if (!hasComparison || !comparisonWorkshopData || !comparisonPeriodRange) return [];
    
    return comparisonWorkshopData.filter(workshop => {
      if (workshop.program_type !== programType) return false;
      
      const startDate = new Date(workshop.program_start_date);
      const endDate = new Date(workshop.program_end_date);
      const rangeStart = new Date(comparisonPeriodRange.startDate);
      const rangeEnd = new Date(comparisonPeriodRange.endDate);
      
      return startDate <= rangeEnd && endDate >= rangeStart;
    });
  }, [comparisonWorkshopData, programType, comparisonPeriodRange, hasComparison]);

  const totalWorkshops = filteredWorkshops.length;
  const comparisonTotalWorkshops = filteredComparisonWorkshops.length;

  const getPercentageChange = () => {
    if (!hasComparison || comparisonTotalWorkshops === 0) return null;
    const change = ((totalWorkshops - comparisonTotalWorkshops) / comparisonTotalWorkshops) * 100;
    return change;
  };

  const percentageChange = getPercentageChange();

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          <div className="flex flex-col leading-tight space-y-2">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full cursor-pointer [perspective:1000px]" 
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div className={`transition-transform duration-500 [transform-style:preserve-3d] ${
        flipped ? "[transform:rotateY(180deg)]" : ""
      }`}>
        {/* Front */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 [backface-visibility:hidden]">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <Presentation className="text-gray-800 size-6 dark:text-white/90" size={24} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-base font-medium text-gray-700 dark:text-white">
                Total Workshops
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {programType === "pace" ? "PACE" : "NON-PACE"}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between mt-4">
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-bold text-gray-800 dark:text-white/90">
                {totalWorkshops}
              </h4>
              {hasComparison && (
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  vs {comparisonTotalWorkshops}
                </span>
              )}
            </div>
            
            {hasComparison && (
              percentageChange !== null ? (
                <Badge color={percentageChange >= 0 ? "success" : "error"}>
                  {percentageChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  {Math.abs(percentageChange).toFixed(1)}%
                </Badge>
              ) : (
                <Badge color="primary">
                  --
                </Badge>
              )
            )}
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto custom-scrollbar">
          <h4 className="font-semibold mb-3 text-md">Workshop Details</h4>
          {filteredWorkshops.length > 0 ? (
            <div className="space-y-2 text-sm">
              {filteredWorkshops.map((workshop, i) => (
                <div key={workshop.id || i} className="border-b border-gray-100 dark:border-gray-800 pb-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {workshop.course_program_title}
                  </div>
                  {programType === "pace" && workshop.category && (
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Category: {workshop.category}
                    </div>
                  )}
                  {programType === "non_pace" && workshop.csc !== null && (
                    <div className="text-xs text-green-600 dark:text-green-400">
                      CSC: {workshop.csc ? "Yes" : "No"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No {programType === "pace" ? "PACE" : "NON-PACE"} workshops found for this period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Regular Metric Card Component
const RegularMetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: number;
  comparisonValue?: number;
  loading: boolean;
  hasComparison: boolean;
}> = ({ icon, title, subtitle, value, comparisonValue, loading, hasComparison }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          <div className="flex flex-col leading-tight space-y-2">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const getPercentageChange = () => {
    if (!hasComparison || !comparisonValue || comparisonValue === 0) return null;
    const change = ((value - comparisonValue) / comparisonValue) * 100;
    return change;
  };

  const percentageChange = getPercentageChange();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {icon}
        </div>
        <div>
          <span className="text-base font-medium text-gray-700 dark:text-white">
            {title}
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between mt-4">
        <div className="flex items-baseline gap-2">
          <h4 className="text-3xl font-bold text-gray-800 dark:text-white/90">
            {value}
          </h4>
          {hasComparison && comparisonValue !== undefined && (
            <span className="text-sm text-blue-600 dark:text-blue-400">
              vs {comparisonValue}
            </span>
          )}
        </div>
        
        {hasComparison && (
          percentageChange !== null ? (
            <Badge color={percentageChange >= 0 ? "success" : "error"}>
              {percentageChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {Math.abs(percentageChange).toFixed(1)}%
            </Badge>
          ) : (
            <Badge color="primary">
              --
            </Badge>
          )
        )}
      </div>
    </div>
  );
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const StatMetrics: React.FC<StatsMetricsProps> = ({ 
  selectedProgram, 
  setSelectedProgram 
}) => {
  const { getPeriodRange, getPeriodLabel, currentPeriod, comparisonPeriod, isComparisonMode } = usePeriod();

  // Build API URL with date range parameters
  const apiUrl = useMemo(() => {
    const primaryRange = getPeriodRange(currentPeriod);
    const params = new URLSearchParams({
      startDate: primaryRange.startDate,
      endDate: primaryRange.endDate,
      periodType: currentPeriod.type,
      programType: selectedProgram,
    });

    if (isComparisonMode && comparisonPeriod) {
      const comparisonRange = getPeriodRange(comparisonPeriod);
      params.append('isComparison', 'true');
      params.append('comparisonStartDate', comparisonRange.startDate);
      params.append('comparisonEndDate', comparisonRange.endDate);
    }

    return `/api/workshops-dashboard?${params}`;
  }, [currentPeriod, comparisonPeriod, isComparisonMode, selectedProgram, getPeriodRange]);

  // Fetch workshop data
  const { data: workshopData, error, isLoading } = useSWR(apiUrl, fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
  });

  const workshops = workshopData?.workshops || [];
  const comparisonWorkshops = workshopData?.comparisonWorkshops || [];
  const hasComparison = workshopData?.isComparison && comparisonWorkshops.length > 0;

  // Get current period range for filtering
  const currentRange = getPeriodRange(currentPeriod);
  const comparisonRange = comparisonPeriod ? getPeriodRange(comparisonPeriod) : null;

  // Calculate metrics based on selected program type and current period
  const metrics = useMemo(() => {
    const filteredWorkshops = workshops.filter((w: any) => {
      if (w.program_type !== selectedProgram) return false;
      
      const startDate = new Date(w.program_start_date);
      const endDate = new Date(w.program_end_date);
      const rangeStart = new Date(currentRange.startDate);
      const rangeEnd = new Date(currentRange.endDate);
      
      return startDate <= rangeEnd && endDate >= rangeStart;
    });
    
    const totalParticipants = filteredWorkshops.reduce((sum: number, w: any) => 
      sum + (w.no_of_participants || 0), 0
    );

    const companySponsoredParticipants = filteredWorkshops.reduce((sum: number, w: any) => 
      sum + (w.company_sponsored_participants || 0), 0
    );

    const individualGroupParticipants = filteredWorkshops.reduce((sum: number, w: any) => 
      sum + (w.individual_group_participants || 0), 0
    );

    return {
      totalParticipants,
      companySponsoredParticipants,
      individualGroupParticipants,
    };
  }, [workshops, selectedProgram, currentRange]);

  // Calculate comparison metrics
  const comparisonMetrics = useMemo(() => {
    if (!hasComparison || !comparisonRange) return {};

    const filteredComparisonWorkshops = comparisonWorkshops.filter((w: any) => {
      if (w.program_type !== selectedProgram) return false;
      
      const startDate = new Date(w.program_start_date);
      const endDate = new Date(w.program_end_date);
      const rangeStart = new Date(comparisonRange.startDate);
      const rangeEnd = new Date(comparisonRange.endDate);
      
      return startDate <= rangeEnd && endDate >= rangeStart;
    });

    const totalParticipants = filteredComparisonWorkshops.reduce((sum: number, w: any) => 
      sum + (w.no_of_participants || 0), 0
    );

    const companySponsoredParticipants = filteredComparisonWorkshops.reduce((sum: number, w: any) => 
      sum + (w.company_sponsored_participants || 0), 0
    );

    const individualGroupParticipants = filteredComparisonWorkshops.reduce((sum: number, w: any) => 
      sum + (w.individual_group_participants || 0), 0
    );

    return {
      totalParticipants,
      companySponsoredParticipants,
      individualGroupParticipants,
    };
  }, [comparisonWorkshops, selectedProgram, comparisonRange, hasComparison]);

  return (
    <div className="space-y-6">
      {/* Dashboard Header Card with Toggle and Period Selector */}
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                CET Metrics Dashboard
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedProgram === "pace" ? "PACE" : "NON-PACE"} Program Overview
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-grow sm:justify-end gap-2">
              <PeriodSelector />
              <ChartTab 
                selected={selectedProgram} 
                onSelect={setSelectedProgram} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load workshop data. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {/* Total Workshops - Flip Card */}
        <WorkshopCard 
          workshopData={workshops}
          comparisonWorkshopData={comparisonWorkshops}
          programType={selectedProgram}
          loading={isLoading}
          periodRange={currentRange}
          comparisonPeriodRange={comparisonRange || undefined}
          hasComparison={hasComparison}
        />

        {/* Total Participants */}
        <RegularMetricCard
          icon={<GroupIcon className="text-gray-800 dark:text-white/90"/>}
          title="Total Participants"
          subtitle="Attended"
          value={metrics.totalParticipants}
          comparisonValue={hasComparison ? comparisonMetrics.totalParticipants : undefined}
          loading={isLoading}
          hasComparison={hasComparison}
        />

        {/* Company Sponsored Participants */}
        <RegularMetricCard
          icon={<Building2 className="text-gray-800 dark:text-white/90" size={24} strokeWidth={1.5}/>}
          title="Company Sponsored"
          subtitle="Participants"
          value={metrics.companySponsoredParticipants}
          comparisonValue={hasComparison ? comparisonMetrics.companySponsoredParticipants : undefined}
          loading={isLoading}
          hasComparison={hasComparison}
        />

        {/* Individual Group Participants */}
        <RegularMetricCard
          icon={<User className="text-gray-800 size-6 dark:text-white/90" size={24} strokeWidth={1.5} />}
          title="Individual/Group"
          subtitle="Participants"
          value={metrics.individualGroupParticipants}
          comparisonValue={hasComparison ? comparisonMetrics.individualGroupParticipants : undefined}
          loading={isLoading}
          hasComparison={hasComparison}
        />
      </div>
    </div>
  );
};