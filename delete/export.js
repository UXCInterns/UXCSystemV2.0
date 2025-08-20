// pages/api/attendance/learning-journeys/export.js
import { supabase } from '@/lib/supabase/supabaseClient';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

// Helper function to get month name
const getMonthName = (monthNum) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[parseInt(monthNum) - 1];
};

// Helper function to fetch data for a specific year/month
const fetchData = async (year, month = null) => {
  let query = supabase
    .from('learning_journeys')
    .select('*');

  if (month) {
    const startDate = `${year}-${month}-01`;
    const endDate = new Date(year, parseInt(month), 0).toISOString().split('T')[0];
    query = query
      .gte('date_of_visit', startDate)
      .lte('date_of_visit', endDate);
  } else {
    query = query
      .gte('date_of_visit', `${year}-01-01`)
      .lte('date_of_visit', `${year}-12-31`);
  }

  const { data, error } = await query.order('date_of_visit', { ascending: true });
  if (error) throw error;
  return data || [];
};

// Helper function to format data for Excel
const formatDataForExcel = (data) => {
  return data.map(record => ({
    'Company Name': record.company_name,
    'Date of Visit': new Date(record.date_of_visit).toLocaleDateString(),
    'Total Registered': record.total_registered || '',
    'Total Attended': record.total_attended,
    'UEN Number': record.uen_number || '',
    'Start Time': record.start_time?.slice(0, 5) || '',
    'End Time': record.end_time?.slice(0, 5) || '',
    'Duration': record.duration || '',
    'Session Type': record.session_type || '',
    'Sector': record.sector || '',
    'Industry': record.industry || '',
    'Organization Size': record.size || '',
    'Consultancy': record.consultancy ? 'Yes' : 'No',
    'Training': record.training ? 'Yes' : 'No',
    'Revenue': record.revenue ? `$${record.revenue.toFixed(2)}` : '',
    'Notes': record.notes || '',
    'Created At': new Date(record.created_at).toLocaleString(),
    'Last Updated': new Date(record.updated_at).toLocaleString()
  }));
};

// Helper function to get column widths
const getColumnWidths = () => [
  { wch: 35 }, // Company Name
  { wch: 15 }, // Date of Visit
  { wch: 15 }, // Total Registered
  { wch: 15 }, // Total Attended
  { wch: 20 }, // UEN Number
  { wch: 12 }, // Start Time
  { wch: 12 }, // End Time
  { wch: 20 }, // Duration
  { wch: 12 }, // Session Type
  { wch: 20 }, // Sector
  { wch: 20 }, // Industry
  { wch: 20 }, // Organization Size
  { wch: 12 }, // Consultancy
  { wch: 12 }, // Training
  { wch: 15 }, // Revenue
  { wch: 40 }, // Notes
  { wch: 20 }, // Created At
  { wch: 20 }  // Last Updated
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { exportType, selections } = req.body;

    if (!selections || selections.length === 0) {
      return res.status(400).json({ error: 'No selections provided' });
    }

    // Single Spreadsheet Export (Chronological)
    if (exportType === 'single') {
      let allData = [];
      
      for (const selection of selections) {
        const data = await fetchData(selection.year, selection.month);
        allData = [...allData, ...data];
      }
      
      if (allData.length === 0) {
        return res.status(404).json({ error: 'No data found for the selected periods' });
      }

      // Sort all data chronologically
      allData.sort((a, b) => new Date(a.date_of_visit) - new Date(b.date_of_visit));

      const formattedData = formatDataForExcel(allData);
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      worksheet['!cols'] = getColumnWidths();

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Visits Data');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=visits_combined_export.xlsx`);
      return res.send(buffer);
    }

    // Multiple Sheets Export (One File)
    if (exportType === 'multiple-sheets') {
      const workbook = XLSX.utils.book_new();
      let hasData = false;

      for (const selection of selections) {
        const data = await fetchData(selection.year, selection.month);
        
        if (data.length === 0) continue;
        hasData = true;

        const formattedData = formatDataForExcel(data);
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        worksheet['!cols'] = getColumnWidths();

        let sheetName = selection.month ? 
          `${getMonthName(parseInt(selection.month))} ${selection.year}` : 
          `Year ${selection.year}`;

        // Ensure unique sheet names
        let sheetIndex = 1;
        let finalSheetName = sheetName;
        while (workbook.Sheets[finalSheetName]) {
          finalSheetName = `${sheetName} (${sheetIndex})`;
          sheetIndex++;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, finalSheetName);
      }

      if (!hasData) {
        return res.status(404).json({ error: 'No data found for any of the selected periods' });
      }

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=visits_multiple_sheets.xlsx`);
      return res.send(buffer);
    }

    // Multiple Files Export (Zip)
    if (exportType === 'multiple-files') {
      const zip = new JSZip();
      let hasData = false;

      for (const selection of selections) {
        const data = await fetchData(selection.year, selection.month);
        
        if (data.length === 0) continue;
        hasData = true;

        const formattedData = formatDataForExcel(data);
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        worksheet['!cols'] = getColumnWidths();

        const sheetName = 'Visits Data';
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        const fileName = selection.month ? 
          `visits_${selection.year}_${getMonthName(parseInt(selection.month))}.xlsx` : 
          `visits_${selection.year}.xlsx`;

        zip.file(fileName, buffer);
      }

      if (!hasData) {
        return res.status(404).json({ error: 'No data found for any of the selected periods' });
      }

      const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=visits_export.zip`);
      return res.send(zipBuffer);
    }

    return res.status(400).json({ error: 'Invalid export type' });

  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({
      error: error.message || 'Export failed'
    });
  }
}