/**
 * Workshop Excel Data Extraction Utility
 * Maps Excel columns to Workshop data structure
 */

export interface WorkshopImportData {
  program_type: 'pace' | 'non_pace';
  school_dept: string;
  course_program_title: string;
  program_start_date: string;
  program_end_date: string;
  course_hours: number;
  no_of_participants: number;
  company_sponsored_participants?: number;
  trainee_hours: number;
  course_type?: string;
  bia_level?: string;
  learning_outcome?: string;
  category?: string;
  csc?: boolean;

}

/**
 * Extract and transform raw Excel data to structured Workshop data
 */
export function transformExcelData(rawData: any[], programType: 'pace' | 'non_pace'): WorkshopImportData[] {

  const cleanedData = rawData.filter((row) => {
    return (
      row['Course/Program Title'] &&
      String(row['Course/Program Title']).trim() !== ''
    );
  });

  return cleanedData.map((row, index) => {
    try {
      return {

        program_type: programType,

        school_dept: String(row['School/Dept'] || '').trim(),

        course_program_title: String(row['Course/Program Title'] || '').trim(),

        program_start_date: formatDate(row['Program/Course Start Date']),

        program_end_date: formatDate(row['Program/Course End Date']),

        course_hours: parseNumber(row['Course Hours']),

        no_of_participants: parseNumber(row['No. of Participants']),

        company_sponsored_participants: 0,

        trainee_hours: parseNumber(row['Trainee Hours']),

        course_type: String(row['Course Type'] || '').trim(),

        bia_level: String(row['BIA (Basic, Intermediate, Advanced)'] || '').trim(),

        learning_outcome: String(row['Learning Outcome / Transfer of Knowledge'] || '').trim(),

        // PACE-specific field
        category:
          programType === 'pace'
            ? String(row['Category'] || '').trim()
            : undefined,

        // NON-PACE-specific field
        csc:
          programType === 'non_pace'
            ? parseBooleanStrict(row['CSC'])
            : undefined,
        
            

      };
    } catch (error) {
      throw new Error(
        `Failed to parse row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  });
}
/**
 * Validate Excel data structure
 */
export function validateExcelData(rawData: any[], programType: 'pace' | 'non_pace'): {
  isValid: boolean;
  errors: string[];
  warnings: string[]
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(rawData) || rawData.length === 0) {
    errors.push('No data found in Excel file');
    return { isValid: false, errors, warnings };
  }

  // Check required columns
  const requiredColumns = [
    'School/Dept',
    'Course/Program Title',
    'Program/Course Start Date',
    'Program/Course End Date',
    'Course Hours',
    'No. of Participants',
    'Course Type',
  ];


  const firstRow = rawData[0];
  const actualColumns = Object.keys(firstRow);

  requiredColumns.forEach(col => {
    const exists = actualColumns.some(actualCol =>
      actualCol.toLowerCase().includes(col.toLowerCase())
    );
    if (!exists) {
      errors.push(`Missing required column: "${col}"`);
    }
  });

  //Program type specific validation
  if (programType === 'pace') {
    const hasCategory = actualColumns.some(col =>
      col.toLowerCase().includes('category')
    );

    if (!hasCategory) {
      errors.push('Missing required column for PACE: "Category"');
    }
  }

  if (programType === 'non_pace') {
    const hasCSC = actualColumns.some(col =>
      col.toLowerCase().includes('csc')
    );

    if (!hasCSC) {
      errors.push('Missing required column for NON-PACE: "CSC"');
    }
  }

  // Validate each row
  rawData.forEach((row, index) => {
    const rowNum = index + 2; // +2 because of header and 1-based indexing

    // Check for empty rows
    if (!row['Course/Program Title'] || String(row['Course/Program Title']).trim() === '') {
      warnings.push(`Row ${rowNum}: Empty course title`);
      return;
    }

    // Validate dates
    if (row['Program/Course Start Date']) {
      const startDate = parseDate(row['Program/Course Start Date']);
      if (!startDate) {
        errors.push(`Row ${rowNum}: Invalid start date format`);
      }
    }

    if (row['Program/Course End Date']) {
      const endDate = parseDate(row['Program/Course End Date']);
      if (!endDate) {
        errors.push(`Row ${rowNum}: Invalid end date format`);
      }
    }

    // Validate numeric fields
    if (isNaN(parseNumber(row['Course Hours']))) {
      errors.push(`Row ${rowNum}: Course hours must be a number`);
    }

    if (isNaN(parseNumber(row['No. of Participants']))) {
      errors.push(`Row ${rowNum}: Number of participants must be a number`);
    }


  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}


/* Helper function to tranform csc's bolean */
function parseBooleanStrict(value: any): boolean | undefined {
  if (value === null || value === undefined || value === '') return undefined;

  const v = String(value).trim().toLowerCase();

  if (['yes', 'y', 'true', '1'].includes(v)) return true;
  if (['no', 'n', 'false', '0'].includes(v)) return false;

  return undefined;
}

/* Helper function for the date*/
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/*
  Parse Excel date (handles both date formats and serial numbers)
]
 */
function parseDate(value: any): string | null {
  if (!value) return null;

  try {
    // If it's already a string, try to parse it
    if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return formatLocalDate(date);
      }
      return null;
    }

    // If it's a number, it might be Excel serial date
    if (typeof value === 'number') {
      const date = new Date(Date.UTC(1899, 11, 30));
      date.setUTCDate(date.getUTCDate() + value);
      return formatLocalDate(date);
    }

    // If it's a Date object
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }

    return null;
  } catch (error) {
    console.error('Date parsing error:', error);
    return null;
  }
}

/*
  Format date to ISO string (YYYY-MM-DD)
 */
function formatDate(value: any): string {
  const parsed = parseDate(value);
  return parsed || formatLocalDate(new Date());
}

/**
 * Parse numeric value safely

 */
function parseNumber(value: any): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? 0 : parsed;
}

/*
  Get column name suggestions if exact match not found
 */
export function findSimilarColumns(
  availableColumns: string[],
  searchTerm: string
): string[] {
  return availableColumns.filter(col =>
    col.toLowerCase().includes(searchTerm.toLowerCase()) ||
    searchTerm.toLowerCase().includes(col.toLowerCase())
  );
}

