import { supabaseAdmin } from "../supabaseAdmin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const periodType = searchParams.get("periodType") || "calendar";

    // ⚡ Force no cache
    request.headers.set("Cache-Control", "no-store");

    // -------------------------
    // Fetch Data (in parallel where possible)
    // -------------------------
    const [mainRes, prevRes] = await Promise.all([
      supabaseAdmin
        .from("learning_journeys")
        .select(
          "company_name, training, consultancy, industry, sector, total_attended, date_of_visit, pace, informal"
        )
        .gte("date_of_visit", startDate || "1900-01-01")
        .lte("date_of_visit", endDate || "2999-12-31")
        .order("date_of_visit", { ascending: false }),

      // Pre-compute previous-period data only if needed
      startDate && endDate
        ? (() => {
            const periodLength =
              new Date(endDate).getTime() - new Date(startDate).getTime();
            const prevStartDate = new Date(
              new Date(startDate).getTime() - periodLength
            )
              .toISOString()
              .split("T")[0];
            const prevEndDate = new Date(
              new Date(endDate).getTime() - periodLength
            )
              .toISOString()
              .split("T")[0];

            return supabaseAdmin
              .from("learning_journeys")
              .select("company_name, total_attended, date_of_visit")
              .gte("date_of_visit", prevStartDate)
              .lte("date_of_visit", prevEndDate);
          })()
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (mainRes.error) throw mainRes.error;
    if (prevRes.error) throw prevRes.error;

    const data = mainRes.data || [];
    const prevData = prevRes.data || [];

    // -------------------------
    // Processing functions
    // -------------------------
    const companies = data.map((row) => row.company_name);
    const uniqueCompanies = Array.from(new Set(companies));

    const totalVisitors = data.reduce(
      (sum, row) => sum + (row.total_attended || 0),
      0
    );

    const trainingSet = new Set(
      data.filter((row) => row.training).map((row) => row.company_name)
    );
    const consultancySet = new Set(
      data.filter((row) => row.consultancy).map((row) => row.company_name)
    );

    // Industry & Sector counts
    const tally = (field) => {
      const counts = {};
      for (const row of data) {
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

    // Period breakdown (simplify into a helper)
    const isWithinPeriod = (dateString) => {
      if (!startDate || !endDate) return true;
      const d = new Date(dateString);
      return d >= new Date(startDate) && d <= new Date(endDate);
    };

    let periodBreakdown = [];
    if (periodType === "quarterly" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
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

        const monthData = data.filter((row) => {
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
      const currentYear = startDate
        ? new Date(startDate).getFullYear()
        : new Date().getFullYear();
      const monthlyTotals = Array(12).fill(0);
      const monthlyCompanies = Array(12).fill(0);
      const monthlyUniqueCompanies = Array.from({ length: 12 }, () => new Set());

      for (const row of data) {
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

    // Comparison metrics
    let comparisonMetrics = null;
    if (prevData.length > 0) {
      const prevCompanies = prevData.map((r) => r.company_name);
      const prevUnique = new Set(prevCompanies);
      const prevVisitors = prevData.reduce(
        (sum, r) => sum + (r.total_attended || 0),
        0
      );

      comparisonMetrics = {
        totalCompaniesChange:
          prevCompanies.length > 0
            ? (
                ((companies.length - prevCompanies.length) /
                  prevCompanies.length) *
                100
              ).toFixed(2)
            : 0,
        uniqueCompaniesChange:
          prevUnique.size > 0
            ? (
                ((uniqueCompanies.length - prevUnique.size) /
                  prevUnique.size) *
                100
              ).toFixed(2)
            : 0,
        totalVisitorsChange:
          prevVisitors > 0
            ? (
                ((totalVisitors - prevVisitors) / prevVisitors) *
                100
              ).toFixed(2)
            : 0,
      };
    }

    // Session type breakdown (monthly totals)
    const sessionTypeBreakdown = {};
    for (const row of data) {
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

    // ✅ Final Response
    return new Response(
      JSON.stringify({
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
        timeline: data
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
        comparisonMetrics,
        periodInfo: {
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
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}