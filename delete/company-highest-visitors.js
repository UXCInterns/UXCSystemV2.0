// pages/api/attendance/learning-journeys/company-highest-visitors.js
import { supabase } from '@/lib/supabase/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const selectedYear = parseInt(req.query.year) || new Date().getFullYear();
      const { data, error } = await supabase.rpc('get_company_highest_visitors', {
        year_input: selectedYear
      });
      if (error) throw error;
      return res.status(200).json(data);
    } catch (error) {
      console.error('Failed to fetch company with highest visitors:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}
