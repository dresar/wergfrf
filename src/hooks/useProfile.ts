import { useQuery } from '@tanstack/react-query';
import { profileAPI } from '../services/api';

export const useProfile = () => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: profileAPI.get,
  });

  return {
    profile,
    isLoading,
    error,
  };
};
