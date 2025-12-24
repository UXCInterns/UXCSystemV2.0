import { supabaseAdmin } from '../../supabaseAdmin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');

    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - hours);

    // Get all activity in the time range
    const { data, error } = await supabaseAdmin
      .from('activity_log_details')
      .select('*')
      .gte('created_at', hoursAgo.toISOString());

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch activity stats', details: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculate statistics
    const stats = {
      total_updates: data.length,
      project_updates: data.filter(a => a.item_type === 'project').length,
      task_updates: data.filter(a => a.item_type === 'task').length,
      by_type: {},
      most_active_users: {},
      recent_items: [],
    };

    // Count by update type
    data.forEach(activity => {
      stats.by_type[activity.update_type] = (stats.by_type[activity.update_type] || 0) + 1;
      
      if (activity.user_name) {
        stats.most_active_users[activity.user_name] = 
          (stats.most_active_users[activity.user_name] || 0) + 1;
      }
    });

    // Get top 10 most active users
    const topUsers = Object.entries(stats.most_active_users)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Get most recently updated items
    const recentItems = [...new Map(
      data.map(item => [item.item_id, {
        id: item.item_id,
        name: item.item_name,
        type: item.item_type,
        last_updated: item.created_at,
      }])
    ).values()].slice(0, 10);

    return new Response(
      JSON.stringify({
        ...stats,
        most_active_users: topUsers,
        recent_items: recentItems,
        time_range_hours: hours,
      }),
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