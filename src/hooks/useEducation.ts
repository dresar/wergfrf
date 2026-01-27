import { useQuery } from '@tanstack/react-query';
import { educationAPI } from '../services/api';

export const useEducation = () => {
  const { data: education, isLoading, error } = useQuery({
    queryKey: ['education'],
    queryFn: educationAPI.getAll,
  });

  return {
    education,
    isLoading,
    error,
  };
};
