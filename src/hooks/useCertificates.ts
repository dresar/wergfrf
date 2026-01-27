import { useQuery } from '@tanstack/react-query';
import { certificatesAPI } from '../services/api';

export const useCertificates = () => {
  const { data: certificates, isLoading, error, refetch } = useQuery({
    queryKey: ['certificates'],
    queryFn: certificatesAPI.getAll,
  });

  return {
    certificates,
    isLoading,
    error,
    refetch,
  };
};
