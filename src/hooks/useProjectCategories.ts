import { useQuery } from '@tanstack/react-query';
import { projectCategoriesAPI } from '@/services/api';

export function useProjectCategories() {
  const categoriesQuery = useQuery({
    queryKey: ['project-categories'],
    queryFn: projectCategoriesAPI.getAll,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
  };
}
