import { useQuery } from '@tanstack/react-query';
import { socialLinksAPI } from '../services/api';
import { useMemo } from 'react';

export const useSocialLinks = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: socialLinksAPI.getAll,
  });

  const socialLinks = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  }, [data]);

  return {
    socialLinks,
    isLoading,
    error,
  };
};
