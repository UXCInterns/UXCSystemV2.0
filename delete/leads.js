// pages/api/attendance/learning-journeys/leads.js
import { supabase } from '@/lib/supabase/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const selectedYear = parseInt(req.query.year) || new Date().getFullYear();
      const selectedMonth = parseInt(req.query.month) || new Date().getMonth();
      const { data, error } = await supabase.rpc('get_leads_by_month', {
        year_input: selectedYear,
        month_input: selectedMonth
      });
      if (error) throw error;
      return res.status(200).json(data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}