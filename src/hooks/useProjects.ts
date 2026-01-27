import { useQuery } from '@tanstack/react-query';
import { projectsAPI } from '@/services/api';
import { useMemo } from 'react';

export function useProjects() {
  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.getAll,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const projects = useMemo(() => projectsQuery.data || [], [projectsQuery.data]);

  return {
    projects,
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    error: projectsQuery.error,
  };
}
