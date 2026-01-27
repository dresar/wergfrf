import { useQuery } from '@tanstack/react-query';
import { profileAPI } from '../services/api';

export const useProfile = () => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: profileAPI.get,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    profile,
    isLoading,
    error,
  };
};
