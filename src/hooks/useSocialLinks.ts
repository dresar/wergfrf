import { useQuery } from '@tanstack/react-query';
import { socialLinksAPI } from '../services/api';

export const useSocialLinks = () => {
  const { data: socialLinks, isLoading, error } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: socialLinksAPI.getAll,
  });

  return {
    socialLinks,
    isLoading,
    error,
  };
};
