// pages/api/attendance/learning-journeys/industry-stats.js
import { supabase } from '@/lib/supabase/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { period, type = 'calendar' } = req.query;

    if (!period) {
      return res.status(400).json({ error: 'Period is required' });
    }

    // Call the Supabase function
    const { data, error } = await supabase
      .rpc('get_industry_stats', {
        period: period,
        period_type: type
      });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch industry stats' });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}