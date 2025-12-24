import { TimelineEntry, ProcessedTimelineData } from "@/types/LearningJourneyDashboardTypes/visitorsTimeline";

interface ProcessedEntries {
  entries: TimelineEntry[];
  total: number;
}

const processTimelineEntries = (timelineData: TimelineEntry[]): ProcessedEntries => {
  if (timelineData.length === 0) return { entries: [], total: 0 };

  const sorted = timelineData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const total = sorted.reduce((sum, entry) => sum + entry.total, 0);

  return { entries: sorted, total };
};

const createUnifiedTimeline = (
  primaryEntries: TimelineEntry[],
  comparisonEntries: TimelineEntry[]
) => {
  const allEntries = [
    ...primaryEntries.map((entry, index) => ({ 
      ...entry, 
      source: 'primary' as const, 
      originalIndex: index 
    })),
    ...comparisonEntries.map((entry, index) => ({ 
      ...entry, 
      source: 'comparison' as const, 
      originalIndex: index 
    }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const categories: string[] = [];
  const primaryValues: number[] = [];
  const comparisonValues: number[] = [];

  allEntries.forEach((entry, index) => {
    // Add index suffix for duplicate dates
    const sameDate = allEntries.filter(e => e.date === entry.date);
    if (sameDate.length > 1) {
      const occurrence = allEntries.slice(0, index + 1).filter(e => e.date === entry.date).length;
      categories.push(`${entry.date} (${occurrence})`);
    } else {
      categories.push(entry.date);
    }

    if (entry.source === 'primary') {
      primaryValues.push(entry.total);
      comparisonValues.push(0);
    } else {
      primaryValues.push(0);
      comparisonValues.push(entry.total);
    }
  });

  return { categories, primaryValues, comparisonValues };
};

export const processTimelineData = (
  timeline: TimelineEntry[],
  comparisonTimeline: TimelineEntry[],
  isComparisonMode: boolean
): ProcessedTimelineData => {
  if (timeline.length === 0 && (!isComparisonMode || comparisonTimeline.length === 0)) {
    return { 
      primarySeries: [], 
      comparisonSeries: [],
      categories: [], 
      totalVisitors: 0, 
      averagePerVisit: 0,
      comparisonTotalVisitors: 0,
      comparisonAveragePerVisit: 0,
      peakVisit: 0,
      comparisonPeakVisit: 0
    };
  }

  const primary = processTimelineEntries(timeline);
  const comparison = isComparisonMode 
    ? processTimelineEntries(comparisonTimeline) 
    : { entries: [], total: 0 };

  let categories: string[] = [];
  let primaryValues: number[] = [];
  let comparisonValues: number[] = [];

  if (!isComparisonMode) {
    categories = primary.entries.map(entry => entry.date);
    primaryValues = primary.entries.map(entry => entry.total);
  } else {
    const unified = createUnifiedTimeline(primary.entries, comparison.entries);
    categories = unified.categories;
    primaryValues = unified.primaryValues;
    comparisonValues = unified.comparisonValues;
  }

  // Calculate statistics
  const primaryNonZeroValues = primaryValues.filter(v => v > 0);
  const comparisonNonZeroValues = comparisonValues.filter(v => v > 0);

  return {
    primarySeries: primaryValues,
    comparisonSeries: comparisonValues,
    categories,
    totalVisitors: primary.total,
    averagePerVisit: primaryNonZeroValues.length > 0 
      ? Math.round(primary.total / primaryNonZeroValues.length) 
      : 0,
    comparisonTotalVisitors: comparison.total,
    comparisonAveragePerVisit: comparisonNonZeroValues.length > 0 
      ? Math.round(comparison.total / comparisonNonZeroValues.length) 
      : 0,
    peakVisit: primaryValues.length > 0 ? Math.max(...primaryValues) : 0,
    comparisonPeakVisit: comparisonValues.length > 0 ? Math.max(...comparisonValues) : 0
  };
};