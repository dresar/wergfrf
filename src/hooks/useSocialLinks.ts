import { useQuery } from '@tanstack/react-query';
import { socialLinksAPI } from '../services/api';

export const useSocialLinks = () => {
  const { data: socialLinks, isLoading, error } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: socialLinksAPI.getAll,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    socialLinks,
    isLoading,
    error,
  };
};
