import { supabaseAdmin } from '../supabaseAdmin';

// GET all kanban tasks or a specific task
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const task_id = searchParams.get('task_id');
    const assigned_to_id = searchParams.get('assigned_to_id');

    // If task_id is provided, get single task with details
    if (task_id) {
      const { data, error } = await supabaseAdmin
        .from('task_details')
        .select('*')
        .eq('task_id', task_id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return new Response(
          JSON.stringify({
            error: 'Failed to fetch task',
            details: error.message,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify({ task: data }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all tasks using the task_details view
    const { data, error } = await supabaseAdmin
      .from('task_details')
      .select('*')
      .order('priority', { ascending: false })
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch tasks',
          details: error.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Filter by assigned user if provided (client-side filtering since assignees is a JSON array)
    let filteredData = data || [];
    if (assigned_to_id) {
      filteredData = filteredData.filter((task) => {
        // Check if the user is in the assignees array
        return task.assignees?.some((assignee) => assignee.id === assigned_to_id);
      });
    }

    return new Response(JSON.stringify({ tasks: filteredData }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GET handler error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}