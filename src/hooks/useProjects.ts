import { useQuery } from '@tanstack/react-query';
import { projectsAPI } from '@/services/api';
import { useMemo } from 'react';

export function useProjects() {
  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.getAll,
  });

  const projects = useMemo(() => {
    const data = projectsQuery.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  }, [projectsQuery.data]);

  return {
    projects,
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    error: projectsQuery.error,
  };
}
