/**
 * Excel File Parsing Utility
 * Handles reading and parsing Excel files using SheetJS
 */

/*** Parse an Excel file and return the data as an array of objects*/
export async function parseExcelFile(file: File): Promise<any[]> {
  // Dynamically import SheetJS only when needed (better for bundle size)
  const { read, utils } = await import('xlsx');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = read(data, { type: 'array' });

        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData = utils.sheet_to_json(worksheet, {
          raw: false,
          dateNF: 'yyyy-mm-dd',
          defval: ''
        });

        resolve(jsonData as any[]);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: Invalid format or corrupted file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file: Unable to access file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/* * Parse Excel file with options*/
export async function parseExcelFileWithOptions(
  file: File,
  options?: {
    sheetIndex?: number;
    hasHeaders?: boolean;
  }
): Promise<any[]> {
  const { read, utils } = await import('xlsx');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = read(data, { type: 'array' });

        const sheetIndex = options?.sheetIndex ?? 0;
        const sheetName = workbook.SheetNames[sheetIndex];

        if (!sheetName) {
          throw new Error(`Sheet at index ${sheetIndex} not found`);
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json(worksheet, {
          raw: false,
          dateNF: 'yyyy-mm-dd',
          defval: ''
        });

        resolve(jsonData as any[]);
      } catch (error) {
        reject(new Error('Failed to parse Excel file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/* Validate if file is a valid Excel file */
export function isValidExcelFile(file: File): boolean {
  const validExtensions = ['.xlsx', '.xls', '.csv'];
  const fileName = file.name.toLowerCase();
  return validExtensions.some(ext => fileName.endsWith(ext));
}