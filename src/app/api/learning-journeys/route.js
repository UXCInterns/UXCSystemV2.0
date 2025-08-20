// // pages/api/attendance/learning-journeys/index.js
// import { supabase } from '@/lib/supabase/supabaseClient';

// function getLastDayOfMonth(year, month) {
//   return new Date(year, month, 0).getDate();
// }

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       // If requesting filter options
//       if (req.query.get_options) {
//         const [
//           { data: sectors },
//           { data: industries },
//           { data: sizes }
//         ] = await Promise.all([
//           supabase
//             .from('learning_journeys')
//             .select('sector')
//             .filter('sector', 'not.is', null),
//           supabase
//             .from('learning_journeys')
//             .select('industry')
//             .filter('industry', 'not.is', null),
//           supabase
//             .from('learning_journeys')
//             .select('size')
//             .filter('size', 'not.is', null)
//         ]);

//         // Process the data to get unique values
//         const uniqueSectors = [...new Set(sectors?.map(s => s.sector))].sort();
//         const uniqueIndustries = [...new Set(industries?.map(i => i.industry))].sort();
//         const uniqueSizes = [...new Set(sizes?.map(s => s.size))].sort();

//         return res.status(200).json({
//           sectors: uniqueSectors || [],
//           industries: uniqueIndustries || [],
//           sizes: uniqueSizes || []
//         });
//       }

//       // Normal data fetching
//       const page = parseInt(req.query.page) || 1;
//       const limit = 10;
//       const offset = (page - 1) * limit;

//       let query = supabase.from('learning_journeys').select('*', { count: 'exact' });

//       // Add filter options
//       if (req.query.sector) {
//         query = query.eq('sector', req.query.sector);
//       }
//       if (req.query.industry) {
//         query = query.eq('industry', req.query.industry);
//       }
//       if (req.query.size) {
//         query = query.eq('size', req.query.size);
//       }
//       if (req.query.session_type) {
//         query = query.eq('session_type', req.query.session_type);
//       }

//       // Handle month and year filtering with proper last day calculation
//       if (req.query.month && req.query.year) {
//         const month = parseInt(req.query.month);
//         const year = parseInt(req.query.year);
//         const lastDay = getLastDayOfMonth(year, month);
        
//         const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
//         const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
        
//         query = query.gte('date_of_visit', startDate)
//                     .lte('date_of_visit', endDate);
//       } else if (req.query.year) {
//         const year = parseInt(req.query.year);
//         const startDate = `${year}-01-01`;
//         const endDate = `${year}-12-31`;
//         query = query.gte('date_of_visit', startDate)
//                     .lte('date_of_visit', endDate);
//       }

//       // Handle attended range
//       if (req.query.attended_min !== undefined && req.query.attended_max !== undefined) {
//         const minAttended = parseInt(req.query.attended_min);
//         const maxAttended = parseInt(req.query.attended_max);
//         query = query.gte('total_attended', minAttended)
//                     .lte('total_attended', maxAttended);
//       }

//       // Handle search
//       if (req.query.search) {
//         query = query.ilike('company_name', `%${req.query.search}%`);
//       }

//       // Apply sorting
//       if (req.query.sort) {
//         const [field, direction] = req.query.sort.split('-');
//         const sortMapping = {
//           date: 'date_of_visit',
//           attended: 'total_attended'
//         };

//         query = query.order(sortMapping[field] || 'date_of_visit', { 
//           ascending: direction === 'asc' 
//         });
//       } else {
//         query = query.order('date_of_visit', { ascending: false });
//       }

//       // Apply pagination
//       const { data, count, error } = await query.range(offset, offset + limit - 1);

//       if (error) {
//         console.error('Supabase Error:', error);
//         throw error;
//       }

//       return res.status(200).json({
//         data,
//         metadata: {
//           total: count,
//           pages: Math.ceil(count / limit),
//           currentPage: page
//         }
//       });

//     } catch (error) {
//       console.error('API Error:', error);
//       return res.status(500).json({ error: error.message || 'Failed to fetch visits' });
//     }
//   }

//   if (req.method === 'POST') {
//     try {
//       const visitData = {
//         ...req.body,
//         consultancy: Boolean(req.body.consultancy),
//         training: Boolean(req.body.training),
//         revenue: req.body.revenue ? parseFloat(req.body.revenue) : null
//       };

//       const { data, error } = await supabase
//         .from('learning_journeys')
//         .insert(visitData)
//         .select()
//         .single();

//       if (error) throw error;
//       return res.status(201).json(data);
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   }

//   return res.status(405).json({ error: 'Method not allowed' });
// }

// src/app/api/learning-journeys/route.js
// server-side only: safe with Service Role Key
import { supabaseAdmin } from '../supabaseAdmin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('learning_journeys')
      .select('id, company_name, date_of_visit, total_attended, duration, consultancy, training')
      .order('date_of_visit', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


