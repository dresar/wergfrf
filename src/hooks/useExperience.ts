import { useQuery } from '@tanstack/react-query';
import { experienceAPI } from '../services/api';

export const useExperience = () => {
  const { data: experiences, isLoading, error } = useQuery({
    queryKey: ['experience'],
    queryFn: experienceAPI.getAll,
  });

  return {
    experiences,
    isLoading,
    error,
  };
};
