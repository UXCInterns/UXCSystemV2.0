// pages/api/attendance/learning-journeys/conversion-stats.js
import { supabase } from '@/lib/supabase/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { period = new Date().getFullYear(), type = 'calendar' } = req.query;
      const { data, error } = await supabase.rpc('get_conversion_stats', {
        period: period,
        period_type: type
      });
      if (error) throw error;
      return res.status(200).json(data);
    } catch (error) {
      console.error('Failed to fetch conversion stats:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}