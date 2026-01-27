import { useQuery } from '@tanstack/react-query';
import { skillsAPI } from '../services/api';

export const useSkills = () => {
  const { data: skills, isLoading, error } = useQuery({
    queryKey: ['skills'],
    queryFn: skillsAPI.getAll,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    skills,
    isLoading,
    error,
  };
};
