// pages/api/attendance/learning-journeys/companies.js
import { supabase } from '@/lib/supabase/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('learning_journeys')
        .select('company_name')
        .order('company_name');
      
      if (error) throw error;
      
      // Get unique company names
      const uniqueCompanies = [...new Set(data.map(item => item.company_name))];
      
      return res.status(200).json(uniqueCompanies);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}