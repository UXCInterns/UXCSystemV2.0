import * as XLSX from 'xlsx';
import { Visit } from '@/types/LearningJourneyAttendanceTypes/visit';
import { ExportFilters } from '@/components/uxcattendance/AttendanceTable/ExportModal';

export const exportToExcel = (data: Visit[], filename: string = 'uxc-learning-journey') => {
  // Transform data for export
  const exportData = data.map((visit) => ({
    'Company Name': visit.company_name,
    'UEN Number': visit.uen_number,
    'Date': new Date(visit.date_of_visit).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    'Start Time': visit.start_time,
    'End Time': visit.end_time,
    'Duration': visit.duration,
    'Session Type': visit.session_type,
    'Total Registered': visit.total_registered,
    'Total Attended': visit.total_attended,
    'Attendance Rate': visit.total_registered > 0 
      ? `${Math.round((visit.total_attended / visit.total_registered) * 100)}%` 
      : 'N/A',
    'Consultancy': visit.consultancy ? 'Yes' : 'No',
    'Training': visit.training ? 'Yes' : 'No',
    'PACE': visit.pace ? 'Yes' : 'No',
    'Informal': visit.informal ? 'Yes' : 'No',
    'Revenue': `$${visit.revenue.toFixed(2)}`,
    'Sector': visit.sector,
    'Company Size': visit.size,
    'Industry': visit.industry,
    'Conversion Status': visit.conversion_status,
    'Notes': visit.notes || '',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 40 }, // Company Name
    { wch: 15 }, // UEN Number
    { wch: 15 }, // Date
    { wch: 12 }, // Start Time
    { wch: 12 }, // End Time
    { wch: 18 }, // Duration
    { wch: 18 }, // Session Type
    { wch: 12 }, // Total Registered
    { wch: 12 }, // Total Attended
    { wch: 15 }, // Attendance Rate
    { wch: 12 }, // Consultancy
    { wch: 10 }, // Training
    { wch: 8 },  // PACE
    { wch: 10 }, // Informal
    { wch: 12 }, // Revenue
    { wch: 15 }, // Sector
    { wch: 15 }, // Company Size
    { wch: 20 }, // Industry
    { wch: 18 }, // Conversion Status
    { wch: 50 }, // Notes
  ];
  worksheet['!cols'] = columnWidths;

  // Style header row (bold)
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;
    worksheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'E9ECEF' } },
    };
  }

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'UXC Visits');

  // Add summary sheet
  const summaryData = generateSummaryData(data);
  const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
  summaryWorksheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = `${filename}_${timestamp}.xlsx`;

  // Save file
  XLSX.writeFile(workbook, fileName);
};

// Generate summary statistics
const generateSummaryData = (data: Visit[]) => {
  const totalVisits = data.length;
  const totalRegistered = data.reduce((sum, v) => sum + v.total_registered, 0);
  const totalAttended = data.reduce((sum, v) => sum + v.total_attended, 0);
  const totalRevenue = data.reduce((sum, v) => sum + v.revenue, 0);
  const consultancyCount = data.filter(v => v.consultancy).length;
  const trainingCount = data.filter(v => v.training).length;
  const paceCount = data.filter(v => v.pace).length;
  const informalCount = data.filter(v => v.informal).length;

  // Group by conversion status
  const conversionStats: { [key: string]: number } = {};
  data.forEach(v => {
    conversionStats[v.conversion_status] = (conversionStats[v.conversion_status] || 0) + 1;
  });

  // Group by session type
  const sessionTypeStats: { [key: string]: number } = {};
  data.forEach(v => {
    sessionTypeStats[v.session_type] = (sessionTypeStats[v.session_type] || 0) + 1;
  });

  const summary = [
    { Metric: 'Total Visits', Value: totalVisits },
    { Metric: 'Total Registered', Value: totalRegistered },
    { Metric: 'Total Attended', Value: totalAttended },
    { Metric: 'Attendance Rate', Value: totalRegistered > 0 ? `${Math.round((totalAttended / totalRegistered) * 100)}%` : 'N/A' },
    { Metric: 'Total Revenue', Value: `$${totalRevenue.toFixed(2)}` },
    { Metric: '', Value: '' }, // Empty row
    { Metric: 'Service Breakdown', Value: '' },
    { Metric: '  Consultancy', Value: consultancyCount },
    { Metric: '  Training', Value: trainingCount },
    { Metric: '  PACE', Value: paceCount },
    { Metric: '  Informal', Value: informalCount },
    { Metric: '', Value: '' }, // Empty row
    { Metric: 'Conversion Status', Value: '' },
    ...Object.entries(conversionStats).map(([status, count]) => ({
      Metric: `  ${status}`,
      Value: count,
    })),
    { Metric: '', Value: '' }, // Empty row
    { Metric: 'Session Types', Value: '' },
    ...Object.entries(sessionTypeStats).map(([type, count]) => ({
      Metric: `  ${type}`,
      Value: count,
    })),
  ];

  return summary;
};

export const exportWithFilters = (
  allData: Visit[],
  filters: ExportFilters,
  filename: string = 'uxc-learning-journey'
) => {
  let filteredData = [...allData];

  // ✅ Apply years filter (now handles array)
  if (filters.years && filters.years.length > 0) {
    filteredData = filteredData.filter(v => 
      filters.years!.includes(new Date(v.date_of_visit).getFullYear().toString())
    );
  }

  // Apply months filter
  if (filters.months && filters.months.length > 0) {
    filteredData = filteredData.filter(v => {
      const month = (new Date(v.date_of_visit).getMonth() + 1).toString().padStart(2, '0');
      return filters.months!.includes(month);
    });
  }

  // Apply date range
  if (filters.dateFrom) {
    filteredData = filteredData.filter(v => 
      new Date(v.date_of_visit) >= new Date(filters.dateFrom!)
    );
  }
  if (filters.dateTo) {
    filteredData = filteredData.filter(v => 
      new Date(v.date_of_visit) <= new Date(filters.dateTo!)
    );
  }

  // Apply conversion status filter
  if (filters.conversionStatus && filters.conversionStatus.length > 0) {
    filteredData = filteredData.filter(v => 
      filters.conversionStatus!.includes(v.conversion_status)
    );
  }

  // Apply session type filter
  if (filters.sessionType && filters.sessionType.length > 0) {
    filteredData = filteredData.filter(v => 
      filters.sessionType!.includes(v.session_type)
    );
  }

  // Apply sector filter
  if (filters.sector && filters.sector.length > 0) {
    filteredData = filteredData.filter(v => 
      filters.sector!.includes(v.sector)
    );
  }

  // Apply industry filter
  if (filters.industry && filters.industry.length > 0) {
    filteredData = filteredData.filter(v => 
      filters.industry!.includes(v.industry)
    );
  }

  // Apply company size filter
  if (filters.companySize && filters.companySize.length > 0) {
    filteredData = filteredData.filter(v => 
      filters.companySize!.includes(v.size)
    );
  }

  // Apply service type filters
  if (filters.consultancy === true) {
    filteredData = filteredData.filter(v => v.consultancy === true);
  }
  if (filters.training === true) {
    filteredData = filteredData.filter(v => v.training === true);
  }
  if (filters.pace === true) {
    filteredData = filteredData.filter(v => v.pace === true);
  }
  if (filters.informal === true) {
    filteredData = filteredData.filter(v => v.informal === true);
  }

  // ✅ Generate filename with years
  const filterParts = [];
  if (filters.years && filters.years.length > 0) {
    if (filters.years.length === 1) {
      filterParts.push(filters.years[0]);
    } else {
      filterParts.push(`${filters.years.length}years`);
    }
  }
  if (filters.months && filters.months.length > 0) {
    filterParts.push(`${filters.months.length}months`);
  }
  
  const finalFilename = filterParts.length > 0 
    ? `${filename}_${filterParts.join('_')}` 
    : filename;

  exportToExcel(filteredData, finalFilename);
};