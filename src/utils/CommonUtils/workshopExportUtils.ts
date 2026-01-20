import * as XLSX from 'xlsx';
import { Workshop } from '@/types/WorkshopTypes/workshop';
import { ExportFilters } from '@/components/workshops/WorkshopExportModal';

export const exportWorkshopsToExcel = (data: Workshop[], filename: string = 'workshops') => {
  // Transform data for export
  const exportData = data.map((workshop) => ({
    'Course/Program Title': workshop.course_program_title,
    'Run Number': workshop.run_number || '',
    'Program Type': workshop.program_type,
    'Course Type': workshop.course_type || '',
    'Category': workshop.category || '',
    'School/Department': workshop.school_dept,
    'Start Date': new Date(workshop.program_start_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    'End Date': new Date(workshop.program_end_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    'Duration (Days)': Math.ceil(
      (new Date(workshop.program_end_date).getTime() - new Date(workshop.program_start_date).getTime()) / 
      (1000 * 60 * 60 * 24)
    ),
    'Total Participants': workshop.no_of_participants,
    'Company Sponsored': workshop.company_sponsored_participants,
    'Individual/Group': workshop.individual_group_participants || 0,
    'Course Hours': workshop.course_hours,
    'Trainee Hours': workshop.trainee_hours,
    'BIA Level': workshop.bia_level || '',
    'Subsidy Description': workshop.subsidy_description || '',
    'CSC': workshop.csc ? 'Yes' : 'No',
    'Learning Outcome': workshop.learning_outcome || '',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 40 }, // Course/Program Title
    { wch: 12 }, // Run Number
    { wch: 20 }, // Program Type
    { wch: 20 }, // Course Type
    { wch: 20 }, // Category
    { wch: 30 }, // School/Department
    { wch: 15 }, // Start Date
    { wch: 15 }, // End Date
    { wch: 15 }, // Duration
    { wch: 15 }, // Total Participants
    { wch: 18 }, // Company Sponsored
    { wch: 18 }, // Individual/Group
    { wch: 12 }, // Course Hours
    { wch: 12 }, // Trainee Hours
    { wch: 15 }, // BIA Level
    { wch: 25 }, // Subsidy Description
    { wch: 8 },  // CSC
    { wch: 50 }, // Learning Outcome
  ];
  worksheet['!cols'] = columnWidths;

  // Style header row
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
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Workshops');

  // Add summary sheet
  const summaryData = generateWorkshopSummary(data);
  const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
  summaryWorksheet['!cols'] = [{ wch: 30 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = `${filename}_${timestamp}.xlsx`;

  // Save file
  XLSX.writeFile(workbook, fileName);
};

// Generate summary statistics
const generateWorkshopSummary = (data: Workshop[]) => {
  const totalWorkshops = data.length;
  const totalParticipants = data.reduce((sum, w) => sum + w.no_of_participants, 0);
  const totalCompanySponsored = data.reduce((sum, w) => sum + w.company_sponsored_participants, 0);
  const totalIndividualGroup = data.reduce((sum, w) => sum + (w.individual_group_participants || 0), 0);
  const totalCourseHours = data.reduce((sum, w) => sum + w.course_hours, 0);
  const totalTraineeHours = data.reduce((sum, w) => sum + w.trainee_hours, 0);
  const avgParticipants = totalWorkshops > 0 ? (totalParticipants / totalWorkshops).toFixed(1) : 0;

  // Group by program type
  const programTypeStats: { [key: string]: number } = {};
  data.forEach(w => {
    programTypeStats[w.program_type] = (programTypeStats[w.program_type] || 0) + 1;
  });

  // Group by school/dept
  const schoolStats: { [key: string]: number } = {};
  data.forEach(w => {
    schoolStats[w.school_dept] = (schoolStats[w.school_dept] || 0) + 1;
  });

  // Group by category
  const categoryStats: { [key: string]: number } = {};
  data.forEach(w => {
    if (w.category) {
      categoryStats[w.category] = (categoryStats[w.category] || 0) + 1;
    }
  });

  // CSC count
  const cscCount = data.filter(w => w.csc).length;

  const summary = [
    { Metric: 'Total Workshops', Value: totalWorkshops },
    { Metric: 'Total Participants', Value: totalParticipants },
    { Metric: 'Average Participants per Workshop', Value: avgParticipants },
    { Metric: 'Total Company Sponsored', Value: totalCompanySponsored },
    { Metric: 'Total Individual/Group', Value: totalIndividualGroup },
    { Metric: 'Total Course Hours', Value: totalCourseHours },
    { Metric: 'Total Trainee Hours', Value: totalTraineeHours },
    { Metric: 'CSC Workshops', Value: cscCount },
    { Metric: '', Value: '' }, // Empty row
    { Metric: 'Program Type Breakdown', Value: '' },
    ...Object.entries(programTypeStats).map(([type, count]) => ({
      Metric: `  ${type}`,
      Value: count,
    })),
    { Metric: '', Value: '' }, // Empty row
    { Metric: 'School/Department Breakdown', Value: '' },
    ...Object.entries(schoolStats).map(([school, count]) => ({
      Metric: `  ${school}`,
      Value: count,
    })),
    { Metric: '', Value: '' }, // Empty row
    { Metric: 'Category Breakdown', Value: '' },
    ...Object.entries(categoryStats).map(([category, count]) => ({
      Metric: `  ${category}`,
      Value: count,
    })),
  ];

  return summary;
};

// Export with custom filters
export const exportWorkshopsWithFilters = (
  allData: Workshop[],
  filters: ExportFilters,
  filename: string = 'workshops'
) => {
  let filteredData = [...allData];

  // Apply years filter
  if (filters.years && filters.years.length > 0) {
    filteredData = filteredData.filter(w => 
      filters.years!.includes(new Date(w.program_start_date).getFullYear().toString())
    );
  }

  // Apply months filter
  if (filters.months && filters.months.length > 0) {
    filteredData = filteredData.filter(w => {
      const month = (new Date(w.program_start_date).getMonth() + 1).toString().padStart(2, '0');
      return filters.months!.includes(month);
    });
  }

  // Apply date range
  if (filters.dateFrom) {
    filteredData = filteredData.filter(w => 
      new Date(w.program_start_date) >= new Date(filters.dateFrom!)
    );
  }
  if (filters.dateTo) {
    filteredData = filteredData.filter(w => 
      new Date(w.program_end_date) <= new Date(filters.dateTo!)
    );
  }

  // Apply program type filter
  if (filters.programType && filters.programType.length > 0) {
    filteredData = filteredData.filter(w => 
      filters.programType!.includes(w.program_type)
    );
  }

  // Apply course type filter
  if (filters.courseType && filters.courseType.length > 0) {
    filteredData = filteredData.filter(w => 
      w.course_type && filters.courseType!.includes(w.course_type)
    );
  }

  // Apply category filter
  if (filters.category && filters.category.length > 0) {
    filteredData = filteredData.filter(w => 
      w.category && filters.category!.includes(w.category)
    );
  }

  // Apply school/dept filter
  if (filters.schoolDept && filters.schoolDept.length > 0) {
    filteredData = filteredData.filter(w => 
      filters.schoolDept!.includes(w.school_dept)
    );
  }

  // Apply BIA level filter
  if (filters.biaLevel && filters.biaLevel.length > 0) {
    filteredData = filteredData.filter(w => 
      w.bia_level && filters.biaLevel!.includes(w.bia_level)
    );
  }

  // Apply CSC filter
  if (filters.csc === true) {
    filteredData = filteredData.filter(w => w.csc === true);
  }

  // Generate filename with filters
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

  exportWorkshopsToExcel(filteredData, finalFilename);
};