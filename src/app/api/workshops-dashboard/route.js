import { supabaseAdmin } from '../supabaseAdmin';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const periodType = url.searchParams.get('periodType');
    const programType = url.searchParams.get('programType');
    const isComparison = url.searchParams.get('isComparison') === 'true';
    const comparisonStartDate = url.searchParams.get('comparisonStartDate');
    const comparisonEndDate = url.searchParams.get('comparisonEndDate');

    // Helper function to filter workshops by date range
    const filterWorkshopsByDateRange = (workshops, rangeStart, rangeEnd) => {
      return workshops.filter(workshop => {
        const workshopStart = new Date(workshop.program_start_date);
        const workshopEnd = new Date(workshop.program_end_date);
        const filterStart = new Date(rangeStart);
        const filterEnd = new Date(rangeEnd);
        
        // Include workshops that overlap with the period
        return workshopStart <= filterEnd && workshopEnd >= filterStart;
      });
    };

    // Build base query - get ALL workshops first, then filter later
    let query = supabaseAdmin
      .from('workshops')
      .select('*')
      .order('program_start_date', { ascending: false });

    // Get ALL workshops (don't filter by program type in query)
    const { data: workshops, error: workshopsError } = await query;
    if (workshopsError) throw workshopsError;

    // Get PACE workshop categories
    const { data: paceWorkshops, error: paceError } = await supabaseAdmin
      .from('paceworkshops')
      .select('workshop_id, category');

    if (paceError) throw paceError;

    // Get NON-PACE workshop CSC status
    const { data: nonPaceWorkshops, error: nonPaceError } = await supabaseAdmin
      .from('nonpaceworkshops')
      .select('workshop_id, csc');

    if (nonPaceError) throw nonPaceError;

    // Create maps for efficient lookup
    const paceMap = new Map(paceWorkshops?.map(p => [p.workshop_id, p.category]) || []);
    const nonPaceMap = new Map(nonPaceWorkshops?.map(n => [n.workshop_id, n.csc]) || []);

    // Combine workshop data with type-specific fields
    const enrichWorkshops = (workshopList) => {
      return workshopList?.map(workshop => {
        const enriched = { ...workshop };
        
        if (workshop.program_type === 'pace') {
          enriched.category = paceMap.get(workshop.id) || null;
        } else if (workshop.program_type === 'non_pace') {
          enriched.csc = nonPaceMap.get(workshop.id) || false;
        }
        
        return enriched;
      }) || [];
    };

    const enrichedWorkshops = enrichWorkshops(workshops);

    // Filter workshops by primary date range and program type if provided
    let primaryWorkshops = enrichedWorkshops;
    if (startDate && endDate) {
      primaryWorkshops = filterWorkshopsByDateRange(enrichedWorkshops, startDate, endDate);
    }
    
    // Apply program type filter to primary workshops if specified
    if (programType && (programType === 'pace' || programType === 'non_pace')) {
      primaryWorkshops = primaryWorkshops.filter(w => w.program_type === programType);
    }

    // Generate top categories/CSC data
    const generateTopCategories = (workshops, type) => {
      if (type === 'pace') {
        // Count categories
        const categoryCount = new Map();
        workshops.forEach(workshop => {
          if (workshop.category) {
            categoryCount.set(workshop.category, (categoryCount.get(workshop.category) || 0) + 1);
          }
        });

        const sortedCategories = Array.from(categoryCount.entries())
          .sort((a, b) => b[1] - a[1]);

        const allDetails = sortedCategories.map(([cat, count]) => `${cat}: ${count} workshops`);

        return {
          first: sortedCategories[0] ? {
            name: sortedCategories[0][0],
            count: sortedCategories[0][1],
            label: `${sortedCategories[0][0]} (${sortedCategories[0][1]})`
          } : null,
          second: sortedCategories[1] ? {
            name: sortedCategories[1][0],
            count: sortedCategories[1][1],
            label: `${sortedCategories[1][0]} (${sortedCategories[1][1]})`
          } : null,
          allDetails
        };
      } else {
        // Count CSC vs Non-CSC
        const cscCount = workshops.filter(w => w.csc === true).length;
        const nonCscCount = workshops.filter(w => w.csc === false).length;
        const totalCount = workshops.length;

        return {
          first: {
            name: 'CSC',
            count: cscCount,
            label: `CSC (${cscCount})`
          },
          second: {
            name: 'Non-CSC',
            count: nonCscCount,
            label: `Non-CSC (${nonCscCount})`
          },
          allDetails: [
            `CSC Workshops: ${cscCount}`,
            `Non-CSC Workshops: ${nonCscCount}`,
            `Total Workshops: ${totalCount}`
          ]
        };
      }
    };

    // Generate monthly breakdown for chart - TRACKING VISITORS
    const generateMonthlyVisitorsBreakdown = (workshops) => {
      const monthlyData = {};
      
      workshops.forEach(workshop => {
        const workshopStart = new Date(workshop.program_start_date);
        const month = workshopStart.toLocaleDateString('en-US', { month: 'short' });
        
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        
        monthlyData[month] += workshop.no_of_participants || 0;
      });

      return Object.entries(monthlyData).map(([month, count]) => ({
        month,
        visitorCount: count
      }));
    };

    // Generate course types breakdown
    const generateCourseTypesBreakdown = (workshops) => {
      const courseTypeMap = new Map();
      
      workshops.forEach(workshop => {
        const courseType = workshop.course_type || 'Uncategorized';
        
        if (!courseTypeMap.has(courseType)) {
          courseTypeMap.set(courseType, {
            courseType: courseType,
            count: 0,
            participants: 0
          });
        }
        
        const current = courseTypeMap.get(courseType);
        current.count += 1;
        current.participants += workshop.no_of_participants || 0;
      });
      
      return Array.from(courseTypeMap.values())
        .sort((a, b) => b.participants - a.participants);
    };

    // Generate BIA level breakdown
    const generateBIALevelBreakdown = (workshops) => {
      const biaLevelMap = new Map([
        ['Basic', { level: 'Basic', count: 0, participants: 0 }],
        ['Intermediate', { level: 'Intermediate', count: 0, participants: 0 }],
        ['Advanced', { level: 'Advanced', count: 0, participants: 0 }],
        ['Uncategorized', { level: 'Uncategorized', count: 0, participants: 0 }]
      ]);
      
      workshops.forEach(workshop => {
        const biaLevel = workshop.bia_level || 'Uncategorized';
        
        if (biaLevelMap.has(biaLevel)) {
          const current = biaLevelMap.get(biaLevel);
          current.count += 1;
          current.participants += workshop.no_of_participants || 0;
        } else {
          const uncategorized = biaLevelMap.get('Uncategorized');
          uncategorized.count += 1;
          uncategorized.participants += workshop.no_of_participants || 0;
        }
      });
      
      return Array.from(biaLevelMap.values());
    };

    const primaryTopCategories = generateTopCategories(primaryWorkshops, programType);

    let response = {
      workshops: primaryWorkshops,
      totalWorkshops: primaryWorkshops.length,
      totalVisitors: primaryWorkshops.reduce((sum, w) => sum + (w.no_of_participants || 0), 0),
      monthlyBreakdown: generateMonthlyVisitorsBreakdown(primaryWorkshops, startDate, endDate),
      courseTypes: generateCourseTypesBreakdown(primaryWorkshops),
      biaLevels: generateBIALevelBreakdown(primaryWorkshops),
      topCategories: primaryTopCategories,
      periodInfo: {
        startDate,
        endDate,
        periodType,
        programType
      }
    };

    // Handle comparison period if requested
    if (isComparison && comparisonStartDate && comparisonEndDate) {
      let comparisonWorkshops = enrichedWorkshops;
      
      comparisonWorkshops = filterWorkshopsByDateRange(enrichedWorkshops, comparisonStartDate, comparisonEndDate);
      
      if (programType && (programType === 'pace' || programType === 'non_pace')) {
        comparisonWorkshops = comparisonWorkshops.filter(w => w.program_type === programType);
      }

      const comparisonTopCategories = generateTopCategories(comparisonWorkshops, programType);

      // Calculate percentage changes for top categories
      if (primaryTopCategories.first && comparisonTopCategories.first) {
        const primaryCount = primaryTopCategories.first.count;
        const comparisonCount = comparisonTopCategories.first.count;
        primaryTopCategories.first.percentageChange = comparisonCount > 0
          ? ((primaryCount - comparisonCount) / comparisonCount) * 100
          : null;
      }

      if (primaryTopCategories.second && comparisonTopCategories.second) {
        const primaryCount = primaryTopCategories.second.count;
        const comparisonCount = comparisonTopCategories.second.count;
        primaryTopCategories.second.percentageChange = comparisonCount > 0
          ? ((primaryCount - comparisonCount) / comparisonCount) * 100
          : null;
      }

      response.comparisonWorkshops = comparisonWorkshops;
      response.comparisonMonthlyBreakdown = generateMonthlyVisitorsBreakdown(comparisonWorkshops, comparisonStartDate, comparisonEndDate);
      response.comparisonCourseTypes = generateCourseTypesBreakdown(comparisonWorkshops);
      response.comparisonBIALevels = generateBIALevelBreakdown(comparisonWorkshops);
      response.comparisonTopCategories = comparisonTopCategories;
      response.isComparison = true;
      response.comparisonPeriodInfo = {
        startDate: comparisonStartDate,
        endDate: comparisonEndDate,
        periodType,
        programType
      };

      const primaryMetrics = calculateMetrics(primaryWorkshops);
      const comparisonMetrics = calculateMetrics(comparisonWorkshops);
      
      response.metrics = {
        primary: primaryMetrics,
        comparison: comparisonMetrics,
        changes: calculateChanges(primaryMetrics, comparisonMetrics)
      };
      
      response.comparison = {
        totalVisitors: comparisonMetrics.totalParticipants
      };
    } else {
      response.isComparison = false;
      response.metrics = {
        primary: calculateMetrics(primaryWorkshops)
      };
    }

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        workshops: [],
        totalWorkshops: 0,
        totalVisitors: 0,
        monthlyBreakdown: [],
        courseTypes: [],
        biaLevels: [],
        topCategories: { first: null, second: null, allDetails: [] },
        metrics: {
          primary: {
            totalWorkshops: 0,
            totalParticipants: 0,
            companySponsoredParticipants: 0,
            averageCourseHours: 0,
            averageDurationDays: 0,
            totalHours: 0,
            totalTraineeHours: 0,
            averageVisitorsPerWorkshop: 0
          }
        }
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function calculateMetrics(workshops) {
  const totalWorkshops = workshops.length;
  
  const totalParticipants = workshops.reduce((sum, w) => 
    sum + (w.no_of_participants || 0), 0
  );
  
  const companySponsoredParticipants = workshops.reduce((sum, w) => 
    sum + (w.company_sponsored_participants || 0), 0
  );

  const individualGroupParticipants = workshops.reduce((sum, w) => 
    sum + (w.individual_group_participants || 0), 0
  );
  
  const totalHours = workshops.reduce((sum, w) => 
    sum + (w.course_hours || 0), 0
  );
  
  const totalTraineeHours = workshops.reduce((sum, w) => {
    const participants = w.no_of_participants || 0;
    const courseHours = w.course_hours || 0;
    return sum + (participants * courseHours);
  }, 0);
  
  const averageCourseHours = totalWorkshops > 0 
    ? Math.round(totalHours / totalWorkshops) 
    : 0;

  // Calculate average duration in days
  const totalDurationDays = workshops.reduce((sum, w) => {
    if (w.program_start_date && w.program_end_date) {
      const startDate = new Date(w.program_start_date);
      const endDate = new Date(w.program_end_date);
      
      // Calculate difference in days (including both start and end date)
      const timeDiff = endDate.getTime() - startDate.getTime();
      const durationDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
      
      return sum + durationDays;
    }
    return sum;
  }, 0);

  const averageDurationDays = totalWorkshops > 0
    ? Math.round(totalDurationDays / totalWorkshops)
    : 0;

  const averageVisitorsPerWorkshop = totalWorkshops > 0
    ? Math.round(totalParticipants / totalWorkshops)
    : 0;

  return {
    totalWorkshops,
    totalParticipants,
    companySponsoredParticipants,
    individualGroupParticipants,
    averageCourseHours,
    averageDurationDays,
    totalHours,
    totalTraineeHours,
    averageVisitorsPerWorkshop
  };
}

function calculateChanges(primaryMetrics, comparisonMetrics) {
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    totalWorkshops: calculatePercentageChange(primaryMetrics.totalWorkshops, comparisonMetrics.totalWorkshops),
    totalParticipants: calculatePercentageChange(primaryMetrics.totalParticipants, comparisonMetrics.totalParticipants),
    companySponsoredParticipants: calculatePercentageChange(primaryMetrics.companySponsoredParticipants, comparisonMetrics.companySponsoredParticipants),
    individualGroupParticipants: calculatePercentageChange(primaryMetrics.individualGroupParticipants, comparisonMetrics.individualGroupParticipants),
    averageCourseHours: calculatePercentageChange(primaryMetrics.averageCourseHours, comparisonMetrics.averageCourseHours),
    averageDurationDays: calculatePercentageChange(primaryMetrics.averageDurationDays, comparisonMetrics.averageDurationDays),
    totalTraineeHours: calculatePercentageChange(primaryMetrics.totalTraineeHours, comparisonMetrics.totalTraineeHours),
    averageVisitorsPerWorkshop: calculatePercentageChange(primaryMetrics.averageVisitorsPerWorkshop, comparisonMetrics.averageVisitorsPerWorkshop)
  };
}