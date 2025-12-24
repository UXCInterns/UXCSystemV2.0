import { supabaseAdmin } from '../../../supabaseAdmin';

export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const { data, error } = await supabaseAdmin
      .from('activity_log_details')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user activity', details: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

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