// pages/api/attendance/learning-journeys/monthly-stats.js
import { supabase } from '@/lib/supabase/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { period, type } = req.query;
      
      let data;
      switch(type) {
        case 'financial':
          const [startYear] = period.split('/');
          data = await supabase.rpc('get_monthly_stats_fy', {
            year_input: parseInt(startYear)
          });
          break;
        
        case 'quarterly':
          const [quarter, year] = period.split(' ');
          data = await supabase.rpc('get_monthly_stats_quarterly', {
            year_input: parseInt(year),
            quarter_input: quarter
          });
          break;
        
        default:
          data = await supabase.rpc('get_monthly_stats', {
            year_input: parseInt(period)
          });
      }

      if (data.error) throw data.error;
      return res.status(200).json(data.data);
    } catch (error) {
      console.error('Failed to fetch monthly stats:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

