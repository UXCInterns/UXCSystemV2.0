import { supabaseAdmin } from '../supabaseAdmin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'project' or 'task'
    const itemId = searchParams.get('item_id'); // specific project/task ID
    const userId = searchParams.get('user_id'); // filter by user
    const updateType = searchParams.get('update_type'); // specific update type
    const limit = parseInt(searchParams.get('limit') || '50');
    const hours = searchParams.get('hours'); // last N hours

    // Build the query
    let query = supabaseAdmin
      .from('activity_log_details')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Apply filters
    if (type) {
      query = query.eq('item_type', type);
    }

    if (itemId) {
      query = query.eq('item_id', itemId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (updateType) {
      query = query.eq('update_type', updateType);
    }

    if (hours) {
      const hoursAgo = new Date();
      hoursAgo.setHours(hoursAgo.getHours() - parseInt(hours));
      query = query.gte('created_at', hoursAgo.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch activity log', details: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Transform the data for the frontend
    const updates = data.map((activity) => ({
      id: activity.activity_id,
      item_type: activity.item_type,
      item_id: activity.item_id,
      item_name: activity.item_name,
      update_type: activity.update_type,
      old_value: activity.old_value,
      new_value: activity.new_value,
      comment: activity.comment_text,
      user_name: activity.user_name || 'System',
      user_avatar: activity.user_avatar,
      timestamp: activity.created_at,
    }));

    return new Response(
      JSON.stringify({ updates, count: updates.length }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('GET handler error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
