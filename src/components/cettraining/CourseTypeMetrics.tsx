"use client";

import React, { useMemo } from 'react';
import { BookOpen, Monitor, Presentation, Target, UserCheck, Award } from 'lucide-react';
import useSWR from 'swr';
import { usePeriod } from '@/context/PeriodContext';

interface CourseTypeMetricsProps {
  programType?: "pace" | "non_pace";
}

interface CourseTypeData {
  courseType: string;
  count: number;
}

interface DashboardData {
  courseTypes: CourseTypeData[];
  comparisonCourseTypes: CourseTypeData[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Define all possible course types
const ALL_COURSE_TYPES = [
  { name: 'Short Course', icon: BookOpen, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
  { name: 'E-Learning', icon: Monitor, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' },
  { name: 'Seminar', icon: Presentation, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
  { name: 'Workshop', icon: Target, color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' },
  { name: 'Coaching', icon: UserCheck, color: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20' },
  { name: 'Uncategorized', icon: Award, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' }
];

const CourseTypeMetrics: React.FC<CourseTypeMetricsProps> = ({ programType }) => {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
  } = usePeriod();

  const { startDate, endDate } = getPeriodRange();
  const comparisonRange = comparisonPeriod ? getPeriodRange(comparisonPeriod) : null;

  const params = useMemo(() => {
    const p = new URLSearchParams({
      startDate,
      endDate,
      periodType: currentPeriod.type,
    });

    if (programType) {
      p.set('programType', programType);
    }

    if (isComparisonMode && comparisonPeriod && comparisonRange) {
      p.append('isComparison', 'true');
      p.append('comparisonStartDate', comparisonRange.startDate);
      p.append('comparisonEndDate', comparisonRange.endDate);
    }

    return p.toString();
  }, [startDate, endDate, currentPeriod.type, programType, isComparisonMode, comparisonPeriod, comparisonRange]);

  const { data, error, isLoading } = useSWR<DashboardData>(`/api/workshops-dashboard?${params}`, fetcher, {
    refreshInterval: 30000,
  });

  // Merge API data with all course types for both periods
  const courseTypesWithDefaults = useMemo(() => {
    const apiCourseTypes = data?.courseTypes || [];
    const comparisonCourseTypes = data?.comparisonCourseTypes || [];
    
    const totalWorkshops = apiCourseTypes.reduce((sum: number, ct: CourseTypeData) => sum + ct.count, 0);
    const totalComparisonWorkshops = comparisonCourseTypes.reduce((sum: number, ct: CourseTypeData) => sum + ct.count, 0);
    
    return ALL_COURSE_TYPES.map((type) => {
      // Primary period data
      const apiData = apiCourseTypes.find((ct: CourseTypeData) => 
        ct.courseType.toLowerCase() === type.name.toLowerCase()
      );
      const count = apiData?.count || 0;
      const percentage = totalWorkshops > 0 ? Math.round((count / totalWorkshops) * 100) : 0;
      
      // Comparison period data
      const comparisonData = comparisonCourseTypes.find((ct: CourseTypeData) => 
        ct.courseType.toLowerCase() === type.name.toLowerCase()
      );
      const comparisonCount = comparisonData?.count || 0;
      const comparisonPercentage = totalComparisonWorkshops > 0 
        ? Math.round((comparisonCount / totalComparisonWorkshops) * 100) 
        : 0;
      
      return {
        name: type.name,
        icon: type.icon,
        color: type.color,
        count: count,
        percentage: percentage,
        comparisonCount: comparisonCount,
        comparisonPercentage: comparisonPercentage
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 md:p-6">
        <p className="text-red-600 dark:text-red-400">Failed to load course types: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Course Types</h3>
      </div>

      <div className="space-y-1 max-h-[235px] overflow-y-auto custom-scrollbar">
        {courseTypesWithDefaults.map((courseType, index) => {
          const IconComponent = courseType.icon;
          
          return (
            <div 
              key={index}
              className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors px-2 rounded-md mr-2"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${courseType.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {courseType.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isComparisonMode ? (
                      <>
                        {courseType.count} vs {courseType.comparisonCount} workshop{(courseType.count !== 1 || courseType.comparisonCount !== 1) ? 's' : ''}
                      </>
                    ) : (
                      <>
                        {courseType.count} workshop{courseType.count !== 1 ? 's' : ''}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex w-full max-w-[120px] items-center gap-3">
                <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                  {/* Primary period progress bar (blue) */}
                  <div 
                    className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-blue-500 text-xs font-medium text-white transition-all duration-300"
                    style={{ width: `${courseType.percentage}%` }}
                  ></div>
                  {/* Comparison period progress bar (red) - overlaid */}
                  {isComparisonMode && (
                    <div 
                      className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-red-500 text-xs font-medium text-white transition-all duration-300 opacity-60"
                      style={{ width: `${courseType.comparisonPercentage}%` }}
                    ></div>
                  )}
                </div>
                <div className="w-10 text-right">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {courseType.percentage}%
                  </p>
                  {isComparisonMode && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">
                      {courseType.comparisonPercentage}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseTypeMetrics;