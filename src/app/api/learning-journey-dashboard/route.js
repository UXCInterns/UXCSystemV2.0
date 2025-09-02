import { supabaseAdmin } from "../supabaseAdmin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Primary period parameters
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const periodType = searchParams.get("periodType") || "calendar";
    
    // Comparison period parameters
    const isComparison = searchParams.get("isComparison") === "true";
    const comparisonStartDate = searchParams.get("comparisonStartDate");
    const comparisonEndDate = searchParams.get("comparisonEndDate");

    // ⚡ Force no cache
    request.headers.set("Cache-Control", "no-store");

    // -------------------------
    // Fetch Data (in parallel)
    // -------------------------
    const queries = [
      // Primary period data
      supabaseAdmin
        .from("learning_journeys")
        .select(
          "company_name, training, consultancy, industry, sector, total_attended, date_of_visit, pace, informal"
        )
        .gte("date_of_visit", startDate || "1900-01-01")
        .lte("date_of_visit", endDate || "2999-12-31")
        .order("date_of_visit", { ascending: false })
    ];

    // Add comparison period query if comparison mode is enabled
    if (isComparison && comparisonStartDate && comparisonEndDate) {
      queries.push(
        supabaseAdmin
          .from("learning_journeys")
          .select(
            "company_name, training, consultancy, industry, sector, total_attended, date_of_visit, pace, informal"
          )
          .gte("date_of_visit", comparisonStartDate)
          .lte("date_of_visit", comparisonEndDate)
          .order("date_of_visit", { ascending: false })
      );
    } else {
      // Add empty promise to maintain array structure
      queries.push(Promise.resolve({ data: [], error: null }));
    }

    const [mainRes, comparisonRes] = await Promise.all(queries);

    if (mainRes.error) throw mainRes.error;
    if (comparisonRes.error) throw comparisonRes.error;

    const data = mainRes.data || [];
    const comparisonData = comparisonRes.data || [];

    // -------------------------
    // Helper Functions
    // -------------------------
    const processDataSet = (dataset, periodStart = null, periodEnd = null) => {
      const companies = dataset.map((row) => row.company_name);
      const uniqueCompanies = Array.from(new Set(companies));

      const totalVisitors = dataset.reduce(
        (sum, row) => sum + (row.total_attended || 0),
        0
      );

      const trainingSet = new Set(
        dataset.filter((row) => row.training).map((row) => row.company_name)
      );
      const consultancySet = new Set(
        dataset.filter((row) => row.consultancy).map((row) => row.company_name)
      );

      // Industry & Sector counts
      const tally = (field) => {
        const counts = {};
        for (const row of dataset) {
          if (!row[field]) continue;
          if (!counts[row[field]]) counts[row[field]] = { count: 0, companies: [] };
          counts[row[field]].count++;
          if (!counts[row[field]].companies.includes(row.company_name)) {
            counts[row[field]].companies.push(row.company_name);
          }
        }
        return Object.entries(counts).sort((a, b) => b[1].count - a[1].count);
      };

      const sortedIndustries = tally("industry");
      const sortedSectors = tally("sector");

      // Period breakdown
      const isWithinPeriod = (dateString) => {
        if (!periodStart || !periodEnd) return true;
        const d = new Date(dateString);
        return d >= new Date(periodStart) && d <= new Date(periodEnd);
      };

      let periodBreakdown = [];
      if (periodType === "quarterly" && periodStart && periodEnd) {
        const start = new Date(periodStart);
        const end = new Date(periodEnd);
        const current = new Date(start);

        while (current <= end) {
          const month = current.getMonth();
          const year = current.getFullYear();
          const monthName = current.toLocaleDateString("en-GB", {
            month: "short",
          });
          const fullPeriod = current.toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          });

          const monthData = dataset.filter((row) => {
            if (!row.date_of_visit) return false;
            const d = new Date(row.date_of_visit);
            return (
              d.getMonth() === month &&
              d.getFullYear() === year &&
              isWithinPeriod(row.date_of_visit)
            );
          });

          periodBreakdown.push({
            period: fullPeriod,
            monthName,
            total: monthData.reduce(
              (sum, row) => sum + (row.total_attended || 0),
              0
            ),
            companies: monthData.length,
            uniqueCompanies: new Set(monthData.map((r) => r.company_name)).size,
          });

          current.setMonth(current.getMonth() + 1);
        }
      } else {
        // Monthly breakdown for other period types
        const currentYear = periodStart
          ? new Date(periodStart).getFullYear()
          : new Date().getFullYear();
        const monthlyTotals = Array(12).fill(0);
        const monthlyCompanies = Array(12).fill(0);
        const monthlyUniqueCompanies = Array.from({ length: 12 }, () => new Set());

        for (const row of dataset) {
          if (row.date_of_visit && isWithinPeriod(row.date_of_visit)) {
            const m = new Date(row.date_of_visit).getMonth();
            monthlyTotals[m] += row.total_attended || 0;
            monthlyCompanies[m]++;
            monthlyUniqueCompanies[m].add(row.company_name);
          }
        }

        periodBreakdown = monthlyTotals.map((total, idx) => ({
          period: new Date(currentYear, idx, 1).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          }),
          monthName: new Date(currentYear, idx, 1).toLocaleDateString("en-GB", {
            month: "short",
          }),
          total,
          companies: monthlyCompanies[idx],
          uniqueCompanies: monthlyUniqueCompanies[idx].size,
        }));
      }

      // Session type breakdown (monthly totals)
      const sessionTypeBreakdown = {};
      for (const row of dataset) {
        if (!row.date_of_visit) continue;
        const d = new Date(row.date_of_visit);
        const monthKey = d.toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        });

        if (!sessionTypeBreakdown[monthKey]) {
          sessionTypeBreakdown[monthKey] = { pace: 0, informal: 0 };
        }

        if (row.pace) {
          sessionTypeBreakdown[monthKey].pace += row.total_attended || 0;
        }
        if (row.informal) {
          sessionTypeBreakdown[monthKey].informal += row.total_attended || 0;
        }
      }

      return {
        training: Array.from(trainingSet),
        consultancy: Array.from(consultancySet),
        companies,
        totalCompanies: companies.length,
        multipleVisits: uniqueCompanies.filter(
          (c) => companies.filter((x) => x === c).length > 1
        ),
        uniqueCompanies,
        mostVisitedIndustry: sortedIndustries[0]?.[0] || null,
        secondMostVisitedIndustry: sortedIndustries[1]?.[0] || null,
        mostVisitedSector: sortedSectors[0]?.[0] || null,
        secondMostVisitedSector: sortedSectors[1]?.[0] || null,
        industryCompanies: sortedIndustries[0]?.[1].companies || [],
        sectorCompanies: sortedSectors[0]?.[1].companies || [],
        allIndustries: sortedIndustries,
        allSectors: sortedSectors,
        totalVisitors,
        sessionTypeBreakdown,
        timeline: dataset
          .filter((r) => r.date_of_visit && isWithinPeriod(r.date_of_visit))
          .map((r) => ({
            date: new Date(r.date_of_visit).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            total: r.total_attended,
            company_name: r.company_name,
          })),
        periodBreakdown,
      };
    };

    // -------------------------
    // Process Primary Data
    // -------------------------
    const primaryResults = processDataSet(data, startDate, endDate);

    // -------------------------
    // Process Comparison Data
    // -------------------------
    let comparisonResults = null;
    let comparisonMetrics = null;

    if (isComparison && comparisonData.length > 0) {
      comparisonResults = processDataSet(comparisonData, comparisonStartDate, comparisonEndDate);

      // Calculate comparison metrics
      comparisonMetrics = {
        totalCompaniesChange:
          comparisonResults.totalCompanies > 0
            ? (
                ((primaryResults.totalCompanies - comparisonResults.totalCompanies) /
                  comparisonResults.totalCompanies) *
                100
              ).toFixed(2)
            : primaryResults.totalCompanies > 0 ? 100 : 0,
        
        uniqueCompaniesChange:
          comparisonResults.uniqueCompanies.length > 0
            ? (
                ((primaryResults.uniqueCompanies.length - comparisonResults.uniqueCompanies.length) /
                  comparisonResults.uniqueCompanies.length) *
                100
              ).toFixed(2)
            : primaryResults.uniqueCompanies.length > 0 ? 100 : 0,
        
        totalVisitorsChange:
          comparisonResults.totalVisitors > 0
            ? (
                ((primaryResults.totalVisitors - comparisonResults.totalVisitors) /
                  comparisonResults.totalVisitors) *
                100
              ).toFixed(2)
            : primaryResults.totalVisitors > 0 ? 100 : 0,

        // Additional comparison metrics
        trainingChange:
          comparisonResults.training.length > 0
            ? (
                ((primaryResults.training.length - comparisonResults.training.length) /
                  comparisonResults.training.length) *
                100
              ).toFixed(2)
            : primaryResults.training.length > 0 ? 100 : 0,
        
        consultancyChange:
          comparisonResults.consultancy.length > 0
            ? (
                ((primaryResults.consultancy.length - comparisonResults.consultancy.length) /
                  comparisonResults.consultancy.length) *
                100
              ).toFixed(2)
            : primaryResults.consultancy.length > 0 ? 100 : 0,
      };
    }

    // ✅ Final Response
    const response = {
      // Primary period data
      ...primaryResults,
      
      // Comparison data (if enabled)
      ...(isComparison && {
        comparison: comparisonResults,
        comparisonMetrics,
        isComparison: true,
      }),
      
      // Period information
      periodInfo: {
        primary: {
          type: periodType,
          startDate,
          endDate,
          totalDays:
            startDate && endDate
              ? Math.ceil(
                  (new Date(endDate).getTime() -
                    new Date(startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : null,
        },
        ...(isComparison && {
          comparison: {
            type: periodType, // Assuming same type for comparison
            startDate: comparisonStartDate,
            endDate: comparisonEndDate,
            totalDays:
              comparisonStartDate && comparisonEndDate
                ? Math.ceil(
                    (new Date(comparisonEndDate).getTime() -
                      new Date(comparisonStartDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : null,
          },
        }),
      },
    };

    return new Response(JSON.stringify(response), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}