import { useQuery } from '@tanstack/react-query';
import { siteSettingsAPI } from '../services/api';

export const useSettings = () => {
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: siteSettingsAPI.get,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    settings,
    isLoading,
    error,
  };
};
