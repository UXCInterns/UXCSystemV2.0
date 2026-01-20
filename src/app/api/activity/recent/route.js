import { supabaseAdmin } from '../../supabaseAdmin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');
    const limit = parseInt(searchParams.get('limit') || '100');

    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - hours);

    const { data, error } = await supabaseAdmin
      .from('activity_log_details')
      .select('*')
      .gte('created_at', hoursAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch recent activity', details: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Filter and map activities
    const updates = data
      .filter((activity) => {
        // Always include created events
        if (activity.update_type === 'created') {
          return activity.item_name && activity.item_name.trim() !== '';
        }

        // Always include comment_added and notes_updated (they don't need old/new values)
        if (activity.update_type === 'comment_added' || activity.update_type === 'notes_updated') {
          return activity.item_name && activity.item_name.trim() !== '';
        }

        // For other events, check if there's meaningful change
        const hasOldValue = activity.old_value !== null && 
                           activity.old_value !== undefined && 
                           activity.old_value !== '';
        const hasNewValue = activity.new_value !== null && 
                           activity.new_value !== undefined && 
                           activity.new_value !== '';

        // Skip if both old and new values are empty
        if (!hasOldValue && !hasNewValue) {
          return false;
        }

        // Skip if item_name is missing
        if (!activity.item_name || activity.item_name.trim() === '') {
          return false;
        }

        return true;
      })
      .map((activity) => ({
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

    // Group by item type
    const projectUpdates = updates.filter(u => u.item_type === 'project');
    const taskUpdates = updates.filter(u => u.item_type === 'task');

    return new Response(
      JSON.stringify({
        all: updates,
        projects: projectUpdates,
        tasks: taskUpdates,
        total_count: updates.length,
        hours: hours,
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