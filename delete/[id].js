// pages/api/attendance/learning-journeys/[id].js
import { supabase } from '@/lib/supabase/supabaseClient';

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      try {
        const updateData = {
          ...req.body,
          // Ensure boolean fields are properly typed
          consultancy: Boolean(req.body.consultancy),
          training: Boolean(req.body.training),
          // Convert revenue to numeric if present
          revenue: req.body.revenue ? parseFloat(req.body.revenue) : null
        };

        const { data, error } = await supabase
          .from('learning_journeys')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const { error } = await supabase
          .from('learning_journeys')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return res.status(200).json({ success: true });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}