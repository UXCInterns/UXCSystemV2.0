import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase/supabaseClient';

/**
 * Hook to check if the current user is a member of a project
 * Returns loading state and whether user has edit permissions
 */
export function useProjectPermissions(projectId: string, currentUserId?: string) {
  const [isProjectMember, setIsProjectMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPermissions() {
      if (!currentUserId || !projectId) {
        setIsProjectMember(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Method 1: Use the database function directly (RECOMMENDED)
        const { data, error } = await supabase.rpc('is_project_member', {
          user_id: currentUserId,
          proj_id: projectId
        });

        if (error) {
          console.error('Error checking project permissions:', error);
          // Fallback to Method 2 if RPC fails
          await checkPermissionsDirectly();
        } else {
          // Handle null case explicitly
          setIsProjectMember(data === true);
        }

      } catch (error) {
        console.error('Error checking permissions:', error);
        setIsProjectMember(false);
      } finally {
        setLoading(false);
      }
    }

    // Method 2: Query tables directly (FALLBACK)
    async function checkPermissionsDirectly() {
      try {
        // Check if user is project manager or project lead
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('project_manager_id, project_lead_id')
          .eq('project_id', projectId)
          .single();

        if (projectError) {
          console.error('Error fetching project:', projectError);
          setIsProjectMember(false);
          return;
        }

        // Check if user is manager or lead
        const isManagerOrLead = 
          projectData.project_manager_id === currentUserId ||
          projectData.project_lead_id === currentUserId;

        if (isManagerOrLead) {
          setIsProjectMember(true);
          return;
        }

        // Check core team
        const { data: coreTeam, error: coreError } = await supabase
          .from('project_core_team')
          .select('profile_id')
          .eq('project_id', projectId)
          .eq('profile_id', currentUserId)
          .limit(1);

        if (coreError) {
          console.error('Error checking core team:', coreError);
        }

        if (coreTeam && coreTeam.length > 0) {
          setIsProjectMember(true);
          return;
        }

        // Check support team
        const { data: supportTeam, error: supportError } = await supabase
          .from('project_support_team')
          .select('profile_id')
          .eq('project_id', projectId)
          .eq('profile_id', currentUserId)
          .limit(1);

        if (supportError) {
          console.error('Error checking support team:', supportError);
        }

        setIsProjectMember(!!(supportTeam && supportTeam.length > 0));

      } catch (error) {
        console.error('Error in direct permission check:', error);
        setIsProjectMember(false);
      }
    }

    checkPermissions();
  }, [projectId, currentUserId]);

  return { isProjectMember, loading };
}