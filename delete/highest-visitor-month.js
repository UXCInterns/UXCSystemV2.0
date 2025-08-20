// pages/api/attendance/learning-journeys/highest-visitor-month.js
import { supabase } from '@/lib/supabase/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const selectedYear = parseInt(req.query.year) || new Date().getFullYear();
      const { data, error } = await supabase.rpc('get_highest_visitor_month', {
        year_input: selectedYear
      });
      if (error) throw error;
      return res.status(200).json(data);
    } catch (error) {
      console.error('Failed to fetch highest visitor month:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}