import { useQuery } from '@tanstack/react-query';
import { skillsAPI } from '../services/api';

export const useSkills = () => {
  const { data: skills, isLoading, error } = useQuery({
    queryKey: ['skills'],
    queryFn: skillsAPI.getAll,
  });

  return {
    skills,
    isLoading,
    error,
  };
};
